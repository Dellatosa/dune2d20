export default class DuneItemSheet extends ItemSheet {
     
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 738,
            height: 300,
            classes: ["dune2d20", "sheet", "item"] /*,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
            */
        });
    }

    get template() {
        console.log(`Dune2d20 | loading template systems/dune2d20/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html template`);
        return `systems/dune2d20/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html`
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dune2d20;
        const myItemData = data.data.system;

        console.log(data);

        return data;
    }
}