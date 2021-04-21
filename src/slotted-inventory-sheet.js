import ActorSheet5eCharacter from '../../../systems/dnd5e/module/actor/sheets/character.js'

export class SlottedInventorySheet extends ActorSheet5eCharacter {
    get template() {
        if ( !game.user.isGM && this.actor.limited ) return 'systems/dnd5e/templates/actors/limited-sheet.html';
        return 'modules/fvtt-slotted-inventory/src/templates/character-sheet.html';
    }

    getData() {
        const slottedInventory = this.actor.getFlag('fvtt-slotted-inventory', 'inventory');
        return {
            ...super.getData(),
            inventory: Object.keys(slottedInventory).reduce((inventory, key) => {
                inventory[key] = {
                    ...slottedInventory[key],
                    slots: slottedInventory[key].slots.map(slot => ({
                        ...slot,
                        item: this.actor.items.get(slot.item)?.data
                    }))
                };
                return inventory;
            }, {})
        }
    }
}