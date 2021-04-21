import ActorSheet5eCharacter from '../../../systems/dnd5e/module/actor/sheets/character.js'

export class SlottedInventorySheet extends ActorSheet5eCharacter {
    get template() {
        if ( !game.user.isGM && this.actor.limited ) return 'systems/dnd5e/templates/actors/limited-sheet.html';
        return 'systems/dnd5e/templates/actors/character-sheet.html';
    }
}