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
            resizable: true
        },
        tag: 'form',
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        actions: {
            editImage: DuneItemSheetV2.editImageHandler,
            checkItem: DuneItemSheetV2.checkItemHandler,
            checkTalent: DuneItemSheetV2.checkTalentHandler
        }
    };

    static PARTS = {
        header: {
    		template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-header.hbs"
  		},
        asset: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-asset.hbs"
        },
        domain: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-domain.hbs"
        },
        enemy: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-enemy.hbs"
        },
        focus: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-focus.hbs"
        },
        talent: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-talent.hbs"
        },
        trait: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-trait.hbs"
        },
        venture: {
            template: "systems/dune2d20/templates/sheets/items/item-sheet-v2-venture.hbs"
        }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.config = CONFIG.dune2d20;
        context.name = this.item.name;
        context.img = this.item.img;
        context.system = this.item.system;

        context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        this.item.system.description,
        {
            secrets: this.document.isOwner,
            relativeTo: this.document
        });

        context.notesHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        this.item.system.notes,
        {
            secrets: this.document.isOwner,
            relativeTo: this.document
        });

        context.ruleTextHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        this.item.system.ruleText,
        {
            secrets: this.document.isOwner,
            relativeTo: this.document
        });

        return context;
    }

    _configureRenderOptions(options) {
        super._configureRenderOptions(options);

        options.parts = ['header']

        switch (this.document.type) {
            case 'Asset':
                options.parts.push('asset')
                break;
            case 'Domain':
                options.parts.push('domain')
                break;
            case 'Enemy':
                options.parts.push('enemy')
                break;
            case 'Focus':
                options.parts.push('focus')
                break;
            case 'Talent':
                options.parts.push('talent')
                break;
            case 'Trait':
                options.parts.push('trait')
                break;
            case 'Venture':
                options.parts.push('venture')
                break;
        }
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

    static checkItemHandler(event, target) {
        event.preventDefault();

        const field = target.dataset.field;
        let dtField = field.split(".");
        let val = !this.item.system[dtField[1]];

        this.item.update({ [field]: val});
    }

    static checkTalentHandler(event, target) {
        event.preventDefault();

        const field = target.dataset.field;
        const stat = target.dataset.stat;
        let dtField = field.split(".");
        let val = !this.item.system[dtField[1]];

        if(!val) {
            this.item.update({ [stat]: null});    
        }
        this.item.update({ [field]: val});
    }
}