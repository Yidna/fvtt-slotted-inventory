import ActorSheet5eCharacter from '../../../systems/dnd5e/module/actor/sheets/character.js'
import { FlagManager } from './flag-manager.js';
import { disallowedItemTypes } from './sanitation.js';
import { QuickItemCreateDialog } from './dialogs/quick-item-create-dialog.js';
import { InventoryTransaction } from './inventory-transaction.js';
import { RenameDialog } from './dialogs/rename-dialog.js';
import { EditSlotDialog } from './dialogs/edit-slot-dialog.js';

export class SlottedInventorySheet extends ActorSheet5eCharacter {
    get template() {
        if ( !game.user.isGM && this.actor.limited ) return 'systems/dnd5e/templates/actors/limited-sheet.html';
        return 'modules/fvtt-slotted-inventory/src/templates/character-sheet.html';
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.slotted-inventory-section-toggle').click(event => this._toggleSection(event));
        html.find('.slotted-inventory-edit-toggle').click(event => this._toggleEdit(event));
        html.find('.slotted-inventory-section-edit').click(event => this._editSectionName(event));
        html.find('.slot-edit').click(event => this._editSlot(event));
    }

    _onDragStart(event) {
        super._onDragStart(event);
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        if (!data.data) {
            return;
        }
        event.dataTransfer.setData('text/plain', JSON.stringify({
            ...data,
            sourceInventorySlot: this._getInventorySlotFromElement(event.target)
        }));
    }

    async _onDropItem(event, itemData) {
        if (this._tabs[0].active !== "inventory") {
            return super._onDropItem(event, itemData);
        }
        const sourceSlot = JSON.parse(event.dataTransfer.getData('text/plain') || '{}').sourceInventorySlot;
        const droppedSlot = this._getInventorySlotFromElement(event.target) || {};
        const isNewItem = !(itemData.actorId === this.actor._id ||
            (this.actor.isToken && itemData.tokenId === this.actor.token.id));
        if (isNewItem) {
            Hooks.once('createItem', (item) => {
                if (disallowedItemTypes.includes(item.type)) {
                    return;
                }
                if (!droppedSlot.slot) {
                    const inventoryTransaction = new InventoryTransaction(this.actor);
                    inventoryTransaction.addOverflow(item._id);
                    inventoryTransaction.commit();
                }
                else {
                    const inventoryTransaction = new InventoryTransaction(this.actor);
                    inventoryTransaction.addItem(droppedSlot.section, droppedSlot.slot, item._id);
                    inventoryTransaction.commit();
                }
            })
        }
        else if (droppedSlot.slot) {
            const inventoryTransaction = new InventoryTransaction(this.actor);
            inventoryTransaction.swapItems(droppedSlot.section, droppedSlot.slot, sourceSlot.section, sourceSlot.slot);
            inventoryTransaction.commit();
        }
        return super._onDropItem(event, itemData);
    }

    _getInventorySlotFromElement(element) {
        const decoratedElement = element.closest('.item') || element.closest('.item-label');
        if (!decoratedElement) {
            return null;
        }
        return {
            section: decoratedElement.dataset.slottedInventorySection,
            slot: decoratedElement.dataset.slottedInventorySlot
        };
    }

    _onItemCreate(event) {
        const {section, slot} = this._getInventorySlotFromElement(event.target);
        QuickItemCreateDialog.show(async (data) => {
            const item = (await this.actor.createEmbeddedDocuments('Item', [data]))[0];
            const inventoryTransaction = new InventoryTransaction(this.actor);
            inventoryTransaction.addItem(section, slot, item._id);
            inventoryTransaction.commit();
        });
    }

    _onItemDelete(event) {
        Hooks.once('deleteItem', (item) => {
            if (item.parent.id !== this.actor.id) {
                return;
            }
            const inventoryTransaction = new InventoryTransaction(this.actor);
            inventoryTransaction.sanitize();
            inventoryTransaction.commit();
        });
        super._onItemDelete(event);
    }

    _toggleSection(event) {
        const sectionElement = event.currentTarget.closest(".items-header");
        const sectionKey = sectionElement.dataset.slottedInventorySection;
        const inventoryTransaction = new InventoryTransaction(this.actor);
        inventoryTransaction.toggleSection(sectionKey);
        inventoryTransaction.commit();
    }

    _editSectionName(event) {
        const sectionElement = event.currentTarget.closest(".items-header");
        const section = sectionElement.dataset.slottedInventorySection;
        const inventory = FlagManager.getInventory(this.actor);
        const label = inventory[section].label;
        RenameDialog.show(this.actor, section, label);
    }

    _editSlot(event) {
        const { section, slot } = this._getInventorySlotFromElement(event.currentTarget.closest('.item'));
        const inventory = FlagManager.getInventory(this.actor);
        const { label, size } = inventory[section].slots[slot];
        EditSlotDialog.show(this.actor, section, slot, label, size);
    }

    _toggleEdit() {
        FlagManager.toggleEditing(this.actor);
    }

    getData() {
        const currentInventory = FlagManager.getInventory(this.actor);
        if (!currentInventory) {
            return super.getData();
        }
        return {
            ...super.getData(),
            isEditing: FlagManager.getEditing(this.actor),
            inventory: Object.keys(currentInventory).reduce((inventory, key) => {
                inventory[key] = {
                    ...currentInventory[key],
                    slots: currentInventory[key].slots.map(slot => ({
                        ...slot,
                        item: this.actor.items.get(slot.item)?.data
                    }))
                };
                return inventory;
            }, {})
        }
    }
}
