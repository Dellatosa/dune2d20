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

        data.traits = data.items.filter(function (item) { return item.type == "Trait"});
        data.house = actorData.house != null ? fromUuidSync(actorData.house) : null;
        data.talents = data.items.filter(function (item) { return item.type == "Talent"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Vérouiller / dévérouiller la fiche
            html.find(".sheet-change-lock").click(this._onSheetChangelock.bind(this));

            // Delete House
            html.find('.remove-house').click(this._onRemoveHouse.bind(this));

            // Delete Trait item
            html.find('.remove-trait').click(this._onRemoveTrait.bind(this));

            // Delete Talent item
            html.find('.remove-talent').click(this._onRemoveTalent.bind(this));
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

    async _onRemoveTrait(event) {
        event.preventDefault();
        const element = event.currentTarget;

        let itemId = element.closest(".trait").dataset.itemId;
        let item = this.actor.items.get(itemId);
        
        let content = `<p>${game.i18n.localize("dune2d20.chat.removeTrait")} : ${item.name}<br>${game.i18n.localize("dune2d20.chat.removeTraitConfirm")}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.chat.confirmRemoval"),
            content: content,
            yes: () => item.delete(),
            //no: () =>, Do nothing
            defaultYes: false
        });
    }

    async _onRemoveTalent(event) {
        event.preventDefault();
        const element = event.currentTarget;

        let itemId = element.closest(".talent-row").dataset.itemId;
        let item = this.actor.items.get(itemId);
        
        let content = `<p>${game.i18n.localize("dune2d20.chat.removeTalent")} : ${item.name}<br>${game.i18n.localize("dune2d20.chat.removeTalentConfirm")}<p>`
        let dlg = Dialog.confirm({
            title: game.i18n.localize("dune2d20.chat.confirmRemoval"),
            content: content,
            yes: () => item.delete(),
            //no: () =>, Do nothing
            defaultYes: false
        });
    }
}