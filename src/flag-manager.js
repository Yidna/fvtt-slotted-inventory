export class FlagManager {

    static FLAG_NAMESPACE = 'fvtt-slotted-inventory';
    static Flags = {
        VERSION: 'version',
        INVENTORY: 'inventory',
        EDITING: 'editing'
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

    static getEditing(actor) {
        return actor.getFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.EDITING);
    }

    static toggleEditing(actor) {
        return actor.setFlag(FlagManager.FLAG_NAMESPACE, FlagManager.Flags.EDITING, !this.getEditing(actor));
    }
}