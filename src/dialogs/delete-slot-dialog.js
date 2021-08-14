import { InventoryTransaction } from '../inventory-transaction.js';

export class DeleteSlotDialog {
    static async show(actor, section, slot) {
        const title = 'Delete Slot';
        const content = '<p>Are you sure you want to delete this slot?</p>';
        return Dialog.confirm({
            title,
            content,
            yes: () => {
                const inventoryTransaction = new InventoryTransaction(actor);
                inventoryTransaction.deleteSlot(section, slot);
                inventoryTransaction.commit();
            },
            defaultYes: false
        })
    }
}
