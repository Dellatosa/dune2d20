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

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if(this.actor.isOwner) {
            // Vérouiller / dévérouiller la fiche
            html.find(".sheet-change-lock").click(this._onSheetChangelock.bind(this));
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
}