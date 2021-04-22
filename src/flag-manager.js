export class FlagManager {

    static FLAG_NAMESPACE = 'fvtt-slotted-inventory';
    static Flags = {
        VERSION: 'version',
        INVENTORY: 'inventory'
    };

    static getInventory(actor) {
        return actor.getFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.INVENTORY);
    }

    static setInventory(actor, inventory) {
        return actor.setFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.INVENTORY, inventory);
    }

    static getVersion(actor) {
        return actor.getFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.VERSION);
    }

    static setVersion(actor, version) {
        return actor.setFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.VERSION, version);
    }
}