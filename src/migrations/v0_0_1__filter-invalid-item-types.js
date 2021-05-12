import { FlagManager } from '../flag-manager.js';

export async function v0_0_1(player) {
    const disallowedItemTypes = ['class', 'feat', 'spell'];
    const currentInventory = FlagManager.getInventory(player);
    const inventory = {
        ...currentInventory,
        overflow: {
            label: 'Overflow',
            slots: currentInventory.overflow.slots.filter(slot =>
                !disallowedItemTypes.includes(player.items.get(slot.item).type))
        }
    };

    return FlagManager.setVersion(player, '1.0.1').then(player =>
        FlagManager.setInventory(player, inventory)
    );
}
