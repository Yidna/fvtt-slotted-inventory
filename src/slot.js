export class Slot {
    label;
    size;
    item;

    constructor(label = '', size = '', item = '') {
        this.label = label;
        this.size = size;
        this.item = item;
    }
}
