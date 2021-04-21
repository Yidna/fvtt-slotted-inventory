import { v0_0_0 } from './migrations/v0_0_0__initialize-inventory-system.js';

const CURRENT_VERSION = '0.0.1';
const FLAG_NAMESPACE = 'fvtt-slotted-inventory';
const Flags = {
    VERSION: 'version',
    INVENTORY: 'inventory'
};

export async function migrate(player) {
    const flagInfo = {
        FLAG_NAMESPACE,
        CURRENT_VERSION,
        Flags
    };
    const migrationFns = [{
        v: undefined,
        fn: v0_0_0
    }];
    return migrationFns.reduce(async (player, migration) => {
        if (player.getFlag(FLAG_NAMESPACE, Flags.VERSION) === migration.v) {
            return await migration.fn(player, flagInfo);
        }
        return player;
    }, player);
}