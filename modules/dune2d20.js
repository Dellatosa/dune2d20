import { dune2d20 } from "./config/config.js";
import { registerSystemSettings } from "./config/settings.js";
import registerHandlebarsHelpers from "./common/helpers.js"
import DuneItem from "./duneItem.js";
import DuneActor from "./duneActor.js";
import { DuneResourcesTracker } from "./apps/duneResourcesTracker.js";
import * as Chat from "./chat.js";
import DuneItemSheet from "./sheets/duneItemSheet.js";
import DuneActorSheet from "./sheets/duneActorSheet.js";
import DuneHouseSheet from "./sheets/duneHouseSheet.js";

Hooks.once("init", function(){
    console.log("Dune2D20 | Initializing the Dune 2d20 Game System");

    game.dune2d20 = {
        DuneActor,
        DuneItem,
        DuneResourcesTracker
    };

    game.dune2d20.DuneResourcesTracker = new DuneResourcesTracker({
        popOut: false,
        minimizable: false,
        resizable: false
    });
    
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

Hooks.on("dropActorSheetData", function(actor, actorSheet, dropped) {
    if(dropped.type == "Actor") {
        const actorDocument = fromUuidSync(dropped.uuid);

        console.log(fromUuidSync(actor.system.house));

        if(actorDocument.type == "House") {
            if(actor.system.house == null || fromUuidSync(actor.system.house) == null) {
                actor.update({"system.house": dropped.uuid});
            }
            else {
               return ui.notifications.warn(game.i18n.localize("dune2d20.notification.houseAlreadyExists"));
            }
        }
    }
});

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

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
        "systems/dune2d20/templates/partials/actors/character-assets-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-background-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-background-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-domaines-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-domaines-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-roles-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-roles-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-enemies-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-enemies-unlocked.hbs"
    ];

    return loadTemplates(templatePaths);
};

Hooks.once("ready", async function() {
    // Tracker Handling
    console.log(game);
    // Identify if User already has ageTrackerPos flag set
    const userTrackerFlag = await game.user.getFlag("dune2d20", "resourcesTrackerPos");
    const useTracker = true;
    if (!userTrackerFlag) await game.user.setFlag("dune2d20", "resourcesTrackerPos", dune2d20.resourcesTrackerPos);
    if (useTracker) game.dune2d20.DuneResourcesTracker.refresh();
});