import { SlottedInventorySheet } from './slotted-inventory-sheet.js';
import { migrate } from './migrations.js';

Actors.registerSheet('dnd5e', SlottedInventorySheet, {
    types: ['character'],
    makeDefault: true
});

Hooks.on('init', () => {
    loadTemplates([
        'modules/fvtt-slotted-inventory/src/templates/partials/actor-inventory.html'
    ])
});

Hooks.on('ready', () => {
    const players = game.actors.entities.filter(actor => actor.data.type === 'character');
    players.forEach(player => migrate(player));
});