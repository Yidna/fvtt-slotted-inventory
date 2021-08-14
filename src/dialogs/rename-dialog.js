import { InventoryTransaction } from '../inventory-transaction.js';

export class RenameDialog {
    static async show(actor, section, defaultValue) {
        const title = 'Rename';
        const label = 'Save Changes';
        const content = await renderTemplate('modules/fvtt-slotted-inventory/src/templates/dialogs/rename-dialog.html', {
            defaultValue
        });
        return Dialog.prompt({
            title,
            content,
            label,
            callback: html => {
                const { label } = new FormDataExtended(html[0].querySelector('form')).toObject();
                const inventoryTransaction = new InventoryTransaction(actor);
                inventoryTransaction.renameSection(section, label);
                inventoryTransaction.commit();
            },
            rejectClose: false
        })
    }
}
