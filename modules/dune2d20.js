import { dune2d20 } from "./config/config.js";
import { registerSystemSettings } from "./config/settings.js";
import registerHandlebarsHelpers from "./common/helpers.js"
import DuneItem from "./duneItem.js";
import DuneActor from "./duneActor.js";
import DuneItemSheet from "./sheets/duneItemSheet.js";
import DuneActorSheet from "./sheets/duneActorSheet.js";
import DuneHouseSheet from "./sheets/duneHouseSheet.js";

Hooks.once("init", function(){
    console.log("Dune2D20 | Initializing the Dune 2d20 Game System");

    game.dune2d20 = {
        DuneActor,
        DuneItem
    };

    //CONFIG.debug.hooks = true;

    CONFIG.dune2d20 = dune2d20;
    CONFIG.Item.documentClass = DuneItem;
    CONFIG.Actor.documentClass = DuneActor;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dune2d20", DuneActorSheet, {types: ["PC", "SC", "NPC"], makeDefault: true});
    Actors.registerSheet("dune2d20", DuneHouseSheet, {types: ["House"], makeDefault: true});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dune2d20", DuneItemSheet, {makeDefault: true});

    registerSystemSettings();

    preloadHandlebarsTemplates();

    // Register custom Handlebars Helpers
	registerHandlebarsHelpers();
});

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/dune2d20/templates/partials/actors/character-background-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-background-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-talents-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-talents-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-assets-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-assets-unlocked.hbs"
    ];

    return loadTemplates(templatePaths);
};

Hooks.on("dropActorSheetData", function(actor, actorSheet, dropped) {
    if(dropped.type == "Actor") {
        const actorDocument = fromUuidSync(dropped.uuid);

        console.log(fromUuidSync(actor.system.house));

        if(actorDocument.type == "House") {
            if(actor.system.house == null || fromUuidSync(actor.system.house) == null) {
                actor.update({"system.house": dropped.uuid});
            }
            else {
               return ui.notifications.warn("Le personnage est déjà attaché à une Maison !");
            }
        }
    }
});

/* function localizeObj(toLocalize, sorted = true) {
    const localized = Object.entries(toLocalize).map(e => {
        return [e[0], game.i18n.localize(e[1])];
    });

    if (sorted) localized.sort((a, b) => a[1].localeCompare(b[1]));
    return localized.reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
    }, {});
} */