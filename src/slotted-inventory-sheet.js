import ActorSheet5eCharacter from '../../../systems/dnd5e/module/actor/sheets/character.js'
import { FlagManager } from './flag-manager';

export class SlottedInventorySheet extends ActorSheet5eCharacter {
    get template() {
        if ( !game.user.isGM && this.actor.limited ) return 'systems/dnd5e/templates/actors/limited-sheet.html';
        return 'modules/fvtt-slotted-inventory/src/templates/character-sheet.html';
    }

    getData() {
        const currentInventory = FlagManager.getInventory(this.actor);
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