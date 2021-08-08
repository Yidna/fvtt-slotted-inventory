import { FlagManager } from './flag-manager.js';
import { cleanInventory } from './sanitation.js';

export class InventoryTransaction {

    constructor(actor) {
        this.actor = actor;
        this.inventory = FlagManager.getInventory(actor);
    }

    toggleSection(section) {
        this.inventory[section].minimized = !this.inventory[section].minimized;
    }

    getSlot(section, slot) {
        return this.inventory[section].slots[slot].item;
    }

    setSlot(section, slot, itemId) {
        this.inventory[section].slots[slot].item = itemId;
    }

    addItem(section, slot, itemId) {
        const currentSlotItem = this.getSlot(section, slot);
        if (currentSlotItem) {
            this.addOverflow(currentSlotItem);
        }
        this.setSlot(section, slot, itemId);
    }

    swapItems(section0, slot0, section1, slot1) {
        const tmp = this.inventory[section0].slots[slot0].item;
        this.inventory[section0].slots[slot0].item = this.inventory[section1].slots[slot1].item;
        this.inventory[section1].slots[slot1].item = tmp;
        this.sanitize();
    }

    addOverflow(itemId) {
        this.inventory.overflow.slots.push({
            label: '',
            size: '',
            item: itemId
        });
    }

    sanitize() {
        this.inventory = cleanInventory(this.actor, this.inventory);
    }

    commit() {
        FlagManager.setInventory(this.actor, this.inventory);
    }

}
