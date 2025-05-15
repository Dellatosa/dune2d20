export default class DuneItemSheet extends ItemSheet {
     
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            width: 738,
            height: 400,
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

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Tout ce qui suit nécessite que la feuille soit éditable
        if (!this.options.editable) return;

        html.find('.chk-talent').click(this._onCheckTalentStat.bind(this));

        html.find('.chk-asset').click(this._onCheckItem.bind(this));

        html.find('.chk-trait').click(this._onCheckItem.bind(this));
        
    }

    async _onCheckTalentStat(event) {
        event.preventDefault();
        const element = event.currentTarget;

        const field = element.dataset.field;
        const stat = element.dataset.stat;
        let dtField = field.split(".");
        let val = !this.item.system[dtField[1]];

        if(!val) {
            this.item.update({ [stat]: null});    
        }
        this.item.update({ [field]: val});
    }

    async _onCheckItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        const field = element.dataset.field;
        let dtField = field.split(".");
        let val = !this.item.system[dtField[1]];

        this.item.update({ [field]: val});
    }
}