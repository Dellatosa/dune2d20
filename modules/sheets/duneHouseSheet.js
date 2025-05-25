export default class DuneHouseSheet extends ActorSheet {
     
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            width: 748,
            height: 999,
            classes: ["dune2d20", "sheet", "house"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "statistics" }]
        });
    }

    get template() {
        console.log(`Dune2D20 | loading template systems/dune2d20/templates/sheets/actors/house-sheet.html`);
        return `systems/dune2d20/templates/sheets/actors/house-sheet.html`
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dune2d20;
        const actorData = data.data.system;

        // Sheet lock state
        data.unlocked = this.actor.isUnlocked;

        data.traits = data.items.filter(function (item) { return item.type == "Trait"});
        data.domains = data.items.filter(function (item) { return item.type == "Domain"});
        data.enemies = data.items.filter(function (item) { return item.type == "Enemy"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Lock / unlock sheet
            html.find(".sheet-change-lock").click(this._onSheetChangelock.bind(this));

            // Edit item
            html.find('.edit-item').click(this._onEditItem.bind(this));

            // Delete item
            html.find('.remove-item').click(this._onRemoveItem.bind(this));

            // Show / hide item description, details or notes
            html.find('.toogle-desc').click(this._onToogleDesc.bind(this));
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

    _onEditItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    async _onRemoveItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const itemType = element.closest(".item").dataset.itemType;

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
        
        let content = `<p>${game.i18n.localize(removeItemloc)} : ${item.name}<br>${game.i18n.localize(removeItemConfloc)}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.dialog.confirmRemoval"),
            content: content,
            yes: () => item.delete(),
            //no: () =>, Do nothing
            defaultYes: false
        });
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
}