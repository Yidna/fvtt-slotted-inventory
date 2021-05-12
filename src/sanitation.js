export const disallowedItemTypes = ['class', 'feat', 'spell'];

export function cleanInventory(player, inventory) {
    const cleanup = [
        removeDeadLinks,
        trimOverflow,
        recoverOrphans
    ];
    return cleanup.reduce((inventory, clean) => {
        return clean(player, inventory);
    }, inventory);
}

function removeDeadLinks(player, inventory) {
    return Object.keys(inventory).reduce((cleanInventory, key) => {
        const section = inventory[key];
        cleanInventory[key] = {
            ...section,
            slots: section.slots.map(slot => ({
                ...slot,
                item: player.items.get(slot.item) && !disallowedItemTypes.includes(player.items.get(slot.item).type)
                    ? slot.item
                    : ''
            }))
        };
        return cleanInventory;
    }, {})
}

function trimOverflow(player, inventory) {
    return {
        ...inventory,
        overflow: {
            ...inventory.overflow,
            slots: inventory.overflow.slots.filter(slot => slot.item)
        }
    };
}

function recoverOrphans(player, inventory) {
    const listifiedInventory = Object.keys(inventory).reduce((list, key) => {
        return list.concat(inventory[key].slots)
    }, []).map(slot => slot.item);
    const orphanedItems = Array.from(player.items.values())
        .filter(item => !disallowedItemTypes.includes(item.type))
        .map(item => item._id)
        .filter(item => !listifiedInventory.includes(item));
    return {
        ...inventory,
        overflow: {
            ...inventory.overflow,
            slots: inventory.overflow.slots.concat(orphanedItems.map(item => ({
                label: '',
                size: '',
                item
            })))
        }
    };
}