import { InventoryTransaction } from '../inventory-transaction.js';

export class EditSlotDialog {
    static async show(actor, section, slot, slotLabel, slotSize) {
        const title = 'Edit Slot';
        const label = 'Save Changes';
        const sizes = {
            none: '',
            trinket: 'T',
            small: 'S',
            medium: 'M',
            large: 'L',
            extraLarge: 'XL'
        };
        const content = await renderTemplate('modules/fvtt-slotted-inventory/src/templates/dialogs/edit-slot-dialog.html', {
            slotLabel,
            slotSize: Object.keys(sizes).find(key => sizes[key] === slotSize),
            sizes
        });
        return Dialog.prompt({
            title,
            content,
            label,
            callback: html => {
                const { label, size } = new FormDataExtended(html[0].querySelector('form')).toObject();
                const inventoryTransaction = new InventoryTransaction(actor);
                inventoryTransaction.editSlot(section, slot, label, sizes[size]);
                inventoryTransaction.commit();
            },
            rejectClose: false
        })
    }
}
