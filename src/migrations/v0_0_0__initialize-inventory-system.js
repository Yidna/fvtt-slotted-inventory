export async function v0_0_0(player, flagInfo) {
    const defaultInventory = {
        head: {
            label: 'Head',
            slots: [
                new Slot('Worn')
            ]
        },
        neck: {
            label: 'Neck',
            slots: [
                new Slot('Worn')
            ]
        },
        hands: {
            label: 'Hands',
            slots: [
                new Slot('Worn'),
                new Slot('Worn'),
                new Slot('Carried', 'XL')
            ]
        },
        belt: {
            label: 'Belt',
            slots: [
                new Slot('Bag 1'),
                new Slot('Strapped', 'S'),
                new Slot('Worn', 'M'),
                new Slot('Sheathed', 'M')
            ]
        },
        torso: {
            label: 'Torso',
            slots: [
                new Slot('Clothes'),
                new Slot('Armor'),
                new Slot('Strapped', 'M'),
                new Slot('Strapped', 'M'),
                new Slot('Strapped', 'M'),
                new Slot('Strapped', 'L')
            ]
        },
        waist: {
            label: 'Waist Bag',
            slots: [
                new Slot('', 'S'),
                new Slot('', 'S'),
                new Slot('', 'S'),
                new Slot('', 'T'),
                new Slot('', 'T'),
                new Slot('', 'T')
            ]
        },
        trinket: {
            label: 'Trinket Bag',
            slots: [
                new Slot('', 'S'),
                new Slot('', 'S'),
                new Slot('', 'T'),
                new Slot('', 'T'),
                new Slot('', 'T'),
                new Slot('', 'T'),
                new Slot('', 'T')
            ]
        },
        satchel: {
            label: 'Satchel Bag',
            slots: [
                new Slot('', 'M'),
                new Slot('', 'S'),
                new Slot('', 'T'),
                new Slot('', 'T')
            ]
        },
        backpack: {
            label: 'Backpack',
            slots: [
                new Slot('Bag 2'),
                new Slot('Bag 3'),
                new Slot('', 'S'),
                new Slot('', 'S'),
                new Slot('', 'L'),
                new Slot('', 'M'),
                new Slot('', 'M'),
                new Slot('', 'M'),
                new Slot('', 'M'),
                new Slot('', 'M'),
                new Slot('', 'M')
            ]
        },
        overflow: {
            label: 'Overflow',
            slots: player.data.items.map(item => new Slot('', '', item._id))
        }
    };
    return player.setFlag(flagInfo.FLAG_NAMESPACE, flagInfo.Flags.VERSION, flagInfo.CURRENT_VERSION).then(player =>
        player.setFlag(flagInfo.FLAG_NAMESPACE, flagInfo.Flags.INVENTORY, defaultInventory)
    );
}

class Slot {
    label;
    size;
    item;

    constructor(label = '', size = '', item = '') {
        this.label = label;
        this.size = size;
        this.item = item;
    }
}