import { v0_0_0 } from './migrations/v0_0_0__initialize-inventory-system.js';
import { FlagManager } from './flag-manager.js';

export async function migrate(player) {
    const migrationFns = [{
        v: undefined,
        fn: v0_0_0
    }];
    return migrationFns.reduce(async (player, migration) => {
        if (FlagManager.getVersion(player) === migration.v) {
            return await migration.fn(player);
        }
        return player;
    }, player);
}