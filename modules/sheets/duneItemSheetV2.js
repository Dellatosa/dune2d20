const { HandlebarsApplicationMixin } = foundry.applications.api
const { ItemSheetV2 } = foundry.applications.sheets

export default class DuneItemSheetV2 extends HandlebarsApplicationMixin(ItemSheetV2) {
     
    static DEFAULT_OPTIONS = {
        classes: ["dune2d20", "sheet", "item"],
		position:{
			width: 738,
			height: "auto"
		},
        window: {
            resizable: false
        },
        tag: 'form',
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        actions: {
            editImage: DuneItemSheetV2.editImageHandler
        }
    };

    static PARTS = {
        main: {
    		template: `systems/dune2d20/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html`
  		}
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.config = CONFIG.dune2d20;
        context.name = this.item.name;
        context.img = this.item.img;
        context.system = this.item.system;

        return context;
    }

    // Image
    static editImageHandler(event, target) {
        const field = target.dataset.field || "img"
        const current = foundry.utils.getProperty(this.document, field)

        const fp = new foundry.applications.apps.FilePicker({
            type: "image",
            current: current,
            callback: (path) => this.document.update({ [field]: path })
        })

        fp.render(true)
    }

    /*
    get template() {
        console.log(`Dune2d20 | loading template systems/dune2d20/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html template`);
        return `systems/dune2d20/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html`
    }
    */

    /*
    getData() {
        const data = super.getData();
        data.config = CONFIG.dune2d20;
        const myItemData = data.data.system;

        return data;
    }
    */

    activateListeners(html) {
        super.activateListeners(html);

        // Tout ce qui suit nécessite que la feuille soit éditable
        if (!this.options.editable) return;

        html.find('.chk-talent').click(this._onCheckTalentStat.bind(this));

        html.find('.chk-item').click(this._onCheckItem.bind(this));
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