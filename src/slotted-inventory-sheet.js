import ActorSheet5eCharacter from '../../../systems/dnd5e/module/actor/sheets/character.js'
import { FlagManager } from './flag-manager.js';
import { cleanInventory, disallowedItemTypes } from './sanitation.js';

export class SlottedInventorySheet extends ActorSheet5eCharacter {
    get template() {
        if ( !game.user.isGM && this.actor.limited ) return 'systems/dnd5e/templates/actors/limited-sheet.html';
        return 'modules/fvtt-slotted-inventory/src/templates/character-sheet.html';
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
        const currentInventory = FlagManager.getInventory(this.actor);
        const isNewItem = !(itemData.actorId === this.actor._id ||
            (this.actor.isToken && itemData.tokenId === this.actor.token.id));
        if (isNewItem) {
            Hooks.once('createOwnedItem', (actor, item) => {
                if (disallowedItemTypes.includes(item.type)) {
                    return;
                }
                if (!droppedSlot.slot) {
                    currentInventory.overflow.slots.push({
                        label: '',
                        size: '',
                        item: item._id
                    });
                    FlagManager.setInventory(this.actor, currentInventory);
                }
                else {
                    const currentSlotItem = currentInventory[droppedSlot.section].slots[droppedSlot.slot].item;
                    if (currentSlotItem) {
                        currentInventory.overflow.slots.push({
                            label: '',
                            size: '',
                            item: currentSlotItem
                        });
                    }
                    currentInventory[droppedSlot.section].slots[droppedSlot.slot].item = item._id;
                    FlagManager.setInventory(this.actor, currentInventory);
                }
            })
        }
        else if (droppedSlot.slot) {
            const currentSlotItem = currentInventory[droppedSlot.section].slots[droppedSlot.slot].item;
            currentInventory[droppedSlot.section].slots[droppedSlot.slot].item = currentInventory[sourceSlot.section].slots[sourceSlot.slot].item;
            currentInventory[sourceSlot.section].slots[sourceSlot.slot].item = currentSlotItem;
            FlagManager.setInventory(this.actor, cleanInventory(this.actor, currentInventory));
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

    _onItemDelete(event) {
        Hooks.once('deleteOwnedItem', (actor) => {
            if (actor.id !== this.actor.id) {
                return;
            }
            FlagManager.setInventory(this.actor, cleanInventory(this.actor, FlagManager.getInventory(this.actor)));
        });
        super._onItemDelete(event);
    }

    getData() {
        const currentInventory = FlagManager.getInventory(this.actor);
        if (!currentInventory) {
            return super.getData();
        }
        return {
            ...super.getData(),
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