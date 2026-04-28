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
		actions: {
            changeLock: DuneActorSheetV2.changeLockHandler,
      		hide: DuneActorSheetV2.hideHandler,
			show: DuneActorSheetV2.showHandler,
            rollDrive: DuneActorSheetV2.rollDriveHandler,
            rollSkill: DuneActorSheetV2.rollSkillHandler
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
    /*
    get template() {
        console.log(`Dune2D20 | type : ${this.actor.type} | loading template systems/dune2d20/templates/sheets/actors/character-sheet.html`);
        return `systems/dune2d20/templates/sheets/actors/character-sheet.html`
    }*/

    async _prepareContext(options) {
        /*
        const context = await super._prepareContext(options)
        console.log("Before", context);

        context.config = CONFIG.dune2d20;
        context.unlocked = this.actor.isUnlocked;
        context.house = this.actor.system.house != null ? fromUuidSync(this.actor.system.house) : null;
        context.name = this.actor.name;
        context.img = this.actor.img;
        context.system = this.actor.system;
        context.tabs = this._prepareTabs("primary");
        */
        
        
        const context = {
            tabs: this._prepareTabs("primary"),
            config: CONFIG.dune2d20,
            unlocked: this.actor.isUnlocked,
            house: this.actor.system.house != null ? fromUuidSync(this.actor.system.house) : null,
            name: this.actor.name,
            img: this.actor.img,
            system: this.actor.system
        };

        //console.log("After", context);

        return context;
    }

    /*
    getData() {
        const data = super.getData();
        data.config = CONFIG.dune2d20;
        const actorData = data.data.system;

        // Sheet lock state
        data.unlocked = this.actor.isUnlocked;

        data.house = actorData.house != null ? fromUuidSync(actorData.house) : null;

        //console.log(this.actor, data);

        return data;
    }*/

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Delete House
            html.find('.remove-house').click(this._onRemoveHouse.bind(this));

            // Delete item
            html.find('.remove-item').click(this._onRemoveItem.bind(this));

            // Edit item
            html.find('.edit-item').click(this._onEditItem.bind(this));
        }
    }

    // Lock / unlock sheet
    static async changeLockHandler(event, target) {
		event.preventDefault();

        let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
        if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
        else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
        this.actor.sheet.render(true);
    }

    async _onRemoveHouse(event) {
        event.preventDefault();
        const house = fromUuidSync(this.actor.system.house);

        let content = `<p>${game.i18n.localize("dune2d20.dialog.removeHouse")} : ${house.name}<br>${game.i18n.localize("dune2d20.dialog.removeHouseConfirm")}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.dialog.confirmRemoval"),
            content: content,
            yes: () => this.actor.update({"system.house": null}),
            //no: () =>, Do nothing
            defaultYes: false
        });
    }

    async _onRemoveItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const itemType = element.closest(".item").dataset.itemType;

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
            default:
                removeItemloc = "notDefined";
                removeItemConfloc = "notDefined";
        }
        
        let content = `<p>${game.i18n.localize(removeItemloc)} : ${item.name}<br>${game.i18n.localize(removeItemConfloc)}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.dialog.confirmRemoval"),
            content: content,
            yes: () => item.delete(),
            //no: () =>, Do nothing
            defaultYes: false
        });
    }

    _onEditItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    static hideHandler(event, target) {
		event.preventDefault();

 		const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

		return item.update({["system.descVisible"] : false});
	}

    static showHandler(event, target) {
		event.preventDefault();

 		const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

		return item.update({["system.descVisible"] : true});
	}

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