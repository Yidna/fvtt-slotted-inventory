import { SlottedInventorySheet } from './slotted-inventory-sheet.js';
import { migrate } from './migrations.js';
import { FlagManager } from './flag-manager.js';
import { cleanInventory } from './sanitation.js';

Actors.registerSheet('dnd5e', SlottedInventorySheet, {
    types: ['character'],
    makeDefault: true
});

Hooks.on('init', () => {
    loadTemplates([
        'modules/fvtt-slotted-inventory/src/templates/partials/actor-inventory.html'
    ])
});

Hooks.on('ready', async () => {
    const players = game.actors.entities.filter(actor => actor.data.type === 'character' && actor.owner);
    await Promise.all(players.map(player => migrate(player)));
    players.forEach(player => {
        const inventory = FlagManager.getInventory(player);
        FlagManager.setInventory(player, cleanInventory(player, inventory));
    });
});

Hooks.on('createActor', actor => {
    if (actor.data.type !== 'character' || !actor.owner) {
        return;
    }
    migrate(actor);
});
