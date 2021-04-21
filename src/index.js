import { SlottedInventorySheet } from './slotted-inventory-sheet.js';

Actors.registerSheet('dnd5e', SlottedInventorySheet, {
    types: ['character'],
    makeDefault: true
});

Hooks.on('init', () => {
    loadTemplates([
        'modules/fvtt-slotted-inventory/src/templates/partials/actor-inventory.html'
    ])
})