import { FlagManager } from './flag-manager.js';
import { cleanInventory } from './sanitation.js';
import { Slot } from './slot.js';

export class InventoryTransaction {

    constructor(actor) {
        this.actor = actor;
        this.inventory = FlagManager.getInventory(actor);
    }

    toggleSection(section) {
        this.inventory[section].minimized = !this.inventory[section].minimized;
    }

    renameSection(section, label) {
        this.inventory[section].label = label;
    }

    addSlot(section) {
        this.inventory[section].slots.push(new Slot());
    }

    getItem(section, slot) {
        return this.inventory[section].slots[slot].item;
    }

    setItem(section, slot, itemId) {
        this.inventory[section].slots[slot].item = itemId;
    }

    editSlot(section, slot, label, size) {
        this.inventory[section].slots[slot].label = label;
        this.inventory[section].slots[slot].size = size;
    }

    deleteSlot(section, slot) {
        const item = this.inventory[section].slots[slot].item;
        this.inventory[section].slots.splice(slot, 1);
        if (item) {
            this.addOverflow(item);
        }
    }

    addItem(section, slot, itemId) {
        const currentSlotItem = this.getItem(section, slot);
        if (currentSlotItem) {
            this.addOverflow(currentSlotItem);
        }
        this.setItem(section, slot, itemId);
    }

    swapItems(section0, slot0, section1, slot1) {
        const tmp = this.inventory[section0].slots[slot0].item;
        this.inventory[section0].slots[slot0].item = this.inventory[section1].slots[slot1].item;
        this.inventory[section1].slots[slot1].item = tmp;
        this.sanitize();
    }

    addOverflow(itemId) {
        this.inventory.overflow.slots.push(new Slot('', '', itemId));
    }

    sanitize() {
        this.inventory = cleanInventory(this.actor, this.inventory);
    }

    commit() {
        FlagManager.setInventory(this.actor, this.inventory);
    }

}
