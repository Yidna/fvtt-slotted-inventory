export class QuickItemCreateDialog {
    static async show(callback) {
        const entity = game.i18n.localize('DOCUMENT.Item');
        const title = game.i18n.format('ENTITY.Create', {entity});
        const types = game.system.entityTypes['Item'];
        const content = await renderTemplate('templates/sidebar/entity-create.html', {
            name: game.i18n.format('ENTITY.New', {entity}),
            type: types[0],
            types: types.reduce((types, type) => {
                types[type] = game.i18n.localize(CONFIG['Item'].typeLabels[type]);
                return types;
            }, {}),
            hasTypes: types.length > 1
        });

        return Dialog.prompt({
            title,
            content,
            label: title,
            callback: html => {
                callback(new FormDataExtended(html[0].querySelector('form')).toObject())
            },
            rejectClose: false
        });
    }
}
