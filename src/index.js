import { SlottedInventorySheet } from './slotted-inventory-sheet.js';

Actors.registerSheet('dnd5e', SlottedInventorySheet, {
    types: ['character'],
    makeDefault: true
});

Hooks.on('init', () => {
})