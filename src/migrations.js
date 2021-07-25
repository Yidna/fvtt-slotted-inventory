import { v0_0_0 } from './migrations/v0_0_0__initialize-inventory-system.js';
import { v0_0_1 } from './migrations/v0_0_1__filter-invalid-item-types.js';
import { v1_0_1 } from './migrations/v1_0_1__add-minimized-flag.js';
import { FlagManager } from './flag-manager.js';

export async function migrate(player) {
    const migrationFns = [{
        v: undefined,
        fn: v0_0_0
    }, {
        v: '0.0.1',
        fn: v0_0_1
    }, {
        v: '1.0.1',
        fn: v1_0_1
    }];
    return migrationFns.reduce(async (player, migration) => {
        const actor = await player;
        if (FlagManager.getVersion(actor) === migration.v) {
            return await migration.fn(actor);
        }
        return player;
    }, player);
}