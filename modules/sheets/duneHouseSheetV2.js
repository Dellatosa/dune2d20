const { HandlebarsApplicationMixin } = foundry.applications.api
const { ActorSheetV2 } = foundry.applications.sheets


export default class DuneHouseSheetV2 extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["dune2d20", "sheet", "house"],
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
            editImage: DuneHouseSheetV2.editImageHandler,
            changeLock: DuneHouseSheetV2.changeLockHandler,
      		hide: DuneHouseSheetV2.hideHandler,
			show: DuneHouseSheetV2.showHandler,
            /*rollDrive: DuneActorSheetV2.rollDriveHandler,
            rollSkill: DuneActorSheetV2.rollSkillHandler,*/
            editItem: DuneHouseSheetV2.editItemHandler,
            removeItem: DuneHouseSheetV2.removeItemHandler
    	}
    };

    static PARTS = {
  		header: {
    		template: "systems/dune2d20/templates/sheets/actors/house-sheet-v2-header-hm.hbs",
  		},
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        roles: {
            template: "systems/dune2d20/templates/sheets/actors/house-sheet-v2-roles.hbs",
            scrollable: [""]
        },
        domains: {
            template: "systems/dune2d20/templates/sheets/actors/house-sheet-v2-domains.hbs",
            scrollable: [""]
        },
        statistics: {
            template: "systems/dune2d20/templates/sheets/actors/house-sheet-v2-statistics.hbs",
            scrollable: [""]
        },
        management: {
            template: "systems/dune2d20/templates/sheets/actors/house-sheet-v2-management.hbs",
            scrollable: [""]
        }
	};

    static TABS = {
        primary: {
            tabs: [{ id: "roles" }, { id: "domains" }, { id: "statistics" }, { id: "management" }],
            labelPrefix: "dune2d20.actor", 
            initial: "roles"
        }
    };

    async _preparePartContext(partId, context) {
        switch (partId) {
            case 'header':
                context.traits = this.actor.items.filter(function (item) { return item.type == "Trait"});
                break;
            case 'domains':
                context.domains = this.actor.items.filter(function (item) { return item.type == "Domain"});
                context.enemies = this.actor.items.filter(function (item) { return item.type == "Enemy"});
                context.tab = context.tabs[partId];
                break;
            case 'statistics':
                context.tab = context.tabs[partId];
                context.compVentures = this.actor.items.filter(function (item) { return item.type == "Venture" && item.system.completed == true }); 
                break;
            case 'roles':
                context.tab = context.tabs[partId];
                break;
            case 'management':
                context.traits = this.actor.items.filter(function (item) { return item.type == "Trait"});
                context.ventures = this.actor.items.filter(function (item) { return item.type == "Venture" && item.system.completed == false }); 
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
        context.name = this.actor.name;
        context.img = this.actor.img;
        context.system = this.actor.system;

        //console.log(context);
        return context;
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

    // Delete item
    static async removeItemHandler(event, target) {
		event.preventDefault();

        const itemId = target.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const itemType = target.closest(".item").dataset.itemType;

        let removeItemloc = "";
        let removeItemConfloc = "";
        switch(itemType) {
            case "domain": 
                removeItemloc = "dune2d20.dialog.removeDomain";
                removeItemConfloc = "dune2d20.dialog.removeDomainConfirm";
                break;
            case "enemy":
                removeItemloc = "dune2d20.dialog.removeEnemy";
                removeItemConfloc = "dune2d20.dialog.removeEnemyConfirm";
                break;
            case "trait":
                removeItemloc = "dune2d20.dialog.removeTrait";
                removeItemConfloc = "dune2d20.dialog.removeTraitConfirm";
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
}