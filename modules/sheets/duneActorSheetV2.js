import * as Roll from "../roll.js";

const { HandlebarsApplicationMixin } = foundry.applications.api
const { ActorSheetV2 } = foundry.applications.sheets

export default class DuneActorSheetV2 extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["dune2d20", "sheet", "actor"],
		position:{
			width: 748,
			height: 999
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
            editImage: DuneActorSheetV2.editImageHandler,
            changeLock: DuneActorSheetV2.changeLockHandler,
      		hide: DuneActorSheetV2.hideHandler,
			show: DuneActorSheetV2.showHandler,
            rollDrive: DuneActorSheetV2.rollDriveHandler,
            rollSkill: DuneActorSheetV2.rollSkillHandler,
            removeHouse: DuneActorSheetV2.removeHouseHandler,
            editItem: DuneActorSheetV2.editItemHandler,
            removeItem: DuneActorSheetV2.removeItemHandler
    	}
    };

    static PARTS = {
  		header: {
    		template: "systems/dune2d20/templates/sheets/actors/character-sheet-v2-header.hbs"
  		},
        tabs: {
            template: "templates/generic/tab-navigation.hbs"
        },
        statistics: {
            template: "systems/dune2d20/templates/sheets/actors/character-sheet-v2-statistics.hbs",
            scrollable: ['']
        },
        biography: {
            template: "systems/dune2d20/templates/sheets/actors/character-sheet-v2-biography.hbs",
            scrollable: ['']
        }
	};

    static TABS = {
        primary: {
            tabs: [{ id: "statistics" }, { id: "biography" }],
            labelPrefix: "dune2d20.actor", 
            initial: "statistics"
        }
    };

    async _preparePartContext(partId, context) {
        switch (partId) {
            case 'header':
                context.traits = this.actor.items.filter(function (item) { return item.type == "Trait"});
                break;
            case 'statistics':
                context.talents = this.actor.items.filter(function (item) { return item.type == "Talent"});
                context.assets = this.actor.items.filter(function (item) { return item.type == "Asset"});
                context.focuses = this.actor.items.filter(function (item) { return item.type == "Focus"});
                context.tab = context.tabs[partId];
                break;
            case 'biography':
                context.tab = context.tabs[partId];
                break;
            default:
        }
        
        return context;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.config = CONFIG.dune2d20;
        context.unlocked = this.actor.isOwner ? this.actor.isUnlocked : false;
        context.house = this.actor.system.house != null ? fromUuidSync(this.actor.system.house) : null;
        context.name = this.actor.name;
        context.img = this.actor.img;
        context.system = this.actor.system;

        context.biographyHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        this.actor.system.biography,
        {
            secrets: this.document.isOwner,
            relativeTo: this.document
        });

        //console.log("OPTIONS : ", options);

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Delete item
            html.find('.remove-item').click(this._onRemoveItem.bind(this));
        }
    }

    // Portrait
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

    // Lock / unlock sheet
    static async changeLockHandler(event, target) {
		event.preventDefault();

        let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
        if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
        else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
        this.actor.sheet.render(true);
    }

    // Delete House
    static async removeHouseHandler(event, target) {
		event.preventDefault();
        const house = fromUuidSync(this.actor.system.house);

        const suppr = await foundry.applications.api.DialogV2.confirm({
            window: { title: game.i18n.localize("dune2d20.dialog.confirmRemoval") },
            content: `<p>${game.i18n.localize("dune2d20.dialog.removeHouse")} : ${house.name}<br>${game.i18n.localize("dune2d20.dialog.removeHouseConfirm")}<p>`
        });

        if(suppr) {
            this.actor.update({"system.house": null});
        }
    }

    // Delete item
    static async removeItemHandler(event, target) {
		event.preventDefault();

        const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const itemType = target.closest(".item").dataset.itemType;

        let removeItemloc = "";
        let removeItemConfloc = "";
        switch(itemType) {
            case "talent": 
                removeItemloc = "dune2d20.dialog.removeTalent";
                removeItemConfloc = "dune2d20.dialog.removeTalentConfirm";
                break;
            case "asset":
                removeItemloc = "dune2d20.dialog.removeAsset";
                removeItemConfloc = "dune2d20.dialog.removeAssetConfirm";
                break;
            case "trait":
                removeItemloc = "dune2d20.dialog.removeTrait";
                removeItemConfloc = "dune2d20.dialog.removeTraitConfirm";
                break;
            case "focus":
                removeItemloc = "dune2d20.dialog.removeFocus";
                removeItemConfloc = "dune2d20.dialog.removeFocusConfirm";
                break;
            default:
                removeItemloc = "notDefined";
                removeItemConfloc = "notDefined";
        }

        const suppr = await foundry.applications.api.DialogV2.confirm({
            window: { title: game.i18n.localize("dune2d20.dialog.confirmRemoval") },
            content: `<p>${game.i18n.localize(removeItemloc)} : ${item.name}<br>${game.i18n.localize(removeItemConfloc)}<p>`
        });

        if(suppr) {
            item.delete();
        }
    }

    // Edit item
    static editItemHandler(event, target) {
		event.preventDefault();

        const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    // Hide description
    static hideHandler(event, target) {
		event.preventDefault();

 		const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

		return item.update({["system.descVisible"] : false});
	}

    // Show description
    static showHandler(event, target) {
		event.preventDefault();

 		const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

		return item.update({["system.descVisible"] : true});
	}

    // Roll Drive check
    static rollDriveHandler(event, target) {
		event.preventDefault();
        const dataset = target.dataset;

        Roll.roll({ 
            type: "drive", 
            actor: this.actor, 
            drive: dataset.drive, 
            focuses: this.actor.items.filter(function (item) { return item.type == "Focus"})
        });
    }

    // Roll Skill check
    static rollSkillHandler(event, target) {
		event.preventDefault();
        const dataset = target.dataset;

        Roll.roll({ 
            type: "skill", 
            actor: this.actor, 
            skill: dataset.skill, 
            focuses: this.actor.items.filter(function (item) { return item.type == "Focus" && item.system.skill == dataset.skill})
        });
    }
}