import { FlagManager } from '../flag-manager.js';

export async function v1_0_1(player) {
    const currentInventory = FlagManager.getInventory(player);
    const inventory = Object.keys(currentInventory).reduce((inventory, key) => {
        inventory[key] = {
            ...inventory[key],
            minimized: false
        };
        return inventory;
    }, currentInventory);

    return FlagManager.setVersion(player, '1.0.2').then(player =>
        FlagManager.setInventory(player, inventory)
    )
}
