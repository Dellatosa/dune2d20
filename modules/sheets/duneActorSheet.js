import * as Dice from "../dice.js";

export default class DuneActorSheet extends ActorSheet {
     
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            width: 748,
            height: 999,
            classes: ["dune2d20", "sheet", "actor"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "statistics" }]
        });
    }

    get template() {
        console.log(`Dune2D20 | type : ${this.actor.type} | loading template systems/dune2d20/templates/sheets/actors/character-sheet.html`);
        return `systems/dune2d20/templates/sheets/actors/character-sheet.html`
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dune2d20;
        const actorData = data.data.system;

        // Sheet lock state
        data.unlocked = this.actor.isUnlocked;

        data.house = actorData.house != null ? fromUuidSync(actorData.house) : null;

        data.traits = data.items.filter(function (item) { return item.type == "Trait"});
        data.talents = data.items.filter(function (item) { return item.type == "Talent"});
        data.assets = data.items.filter(function (item) { return item.type == "Asset"});
        data.focuses = data.items.filter(function (item) { return item.type == "Focus"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Lock / unlock sheet
            html.find(".sheet-change-lock").click(this._onSheetChangelock.bind(this));

            // Delete House
            html.find('.remove-house').click(this._onRemoveHouse.bind(this));

            // Delete item
            html.find('.remove-item').click(this._onRemoveItem.bind(this));

            // Edit item
            html.find('.edit-item').click(this._onEditItem.bind(this));

            // Show / hide item description or ruletext
            html.find('.toogle-desc').click(this._onToogleDesc.bind(this));

            // Roll Drive check
            html.find('.roll-drive').click(this._onRollDrive.bind(this));

            // Roll Skill check
            html.find('.roll-skill').click(this._onRollSkill.bind(this));
        }
    }

    // Lock / unlock sheet
    async _onSheetChangelock(event) {
        event.preventDefault();
        
        let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
        if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
        else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
        this.actor.sheet.render(true);
    }

    async _onRemoveHouse(event) {
        event.preventDefault();
        const house = fromUuidSync(this.actor.system.house);

        let content = `<p>${game.i18n.localize("dune2d20.chat.removeHouse")} : ${house.name}<br>${game.i18n.localize("dune2d20.chat.removeHouseConfirm")}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.chat.confirmRemoval"),
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
                removeItemloc = "dune2d20.chat.removeTalent";
                removeItemConfloc = "dune2d20.chat.removeTalentConfirm";
                break;
            case "asset":
                removeItemloc = "dune2d20.chat.removeAsset";
                removeItemConfloc = "dune2d20.chat.removeAssetConfirm";
                break;
            case "trait":
                removeItemloc = "dune2d20.chat.removeTrait";
                removeItemConfloc = "dune2d20.chat.removeTraitConfirm";
                break;
            default:
                removeItemloc = "notDefined";
                removeItemConfloc = "notDefined";
        }
        
        let content = `<p>${game.i18n.localize(removeItemloc)} : ${item.name}<br>${game.i18n.localize(removeItemConfloc)}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.chat.confirmRemoval"),
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

    async _onToogleDesc(event) {
        event.preventDefault();
        const element = event.currentTarget;

        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        const action = element.dataset.action;

        if(action == "show") {
            return item.update({["system.descVisible"] : true});
        }
        else if (action == "hide") {
            return item.update({["system.descVisible"] : false});
        }
    }

    _onRollDrive(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

        Dice.rollDrive({ actor: this.actor, drive: dataset.drive });
    }

    _onRollSkill(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

        Dice.rollSkill({ actor: this.actor, skill: dataset.skill });
    }
}