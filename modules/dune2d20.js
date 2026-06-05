import { dune2d20 } from "./config/config.js";
import { registerSystemSettings } from "./config/settings.js";
import registerHandlebarsHelpers from "./common/helpers.js"
import DuneItem from "./duneItem.js";
import DuneActor from "./duneActor.js";
import { DuneResourcesTracker } from "./apps/duneResourcesTracker.js";
import { DuneResourcesTrackerV2 } from "./apps/duneResourcesTrackerV2.js";
import * as Chat from "./chat.js";
import DuneItemSheet from "./sheets/duneItemSheet.js";
import DuneItemSheetV2 from "./sheets/duneItemSheetV2.js";
import DuneActorSheet from "./sheets/duneActorSheet.js";
import DuneActorSheetV2 from "./sheets/duneActorSheetV2.js";
import DuneHouseSheet from "./sheets/duneHouseSheet.js";
import DuneHouseSheetV2 from "./sheets/duneHouseSheetV2.js";

Hooks.once("init", function(){
    console.log("Dune2D20 | Initializing the Dune 2d20 Game System");

    game.dune2d20 = {
        DuneActor,
        DuneItem,
        DuneResourcesTracker,
        DuneResourcesTrackerV2
    };
    
    game.dune2d20.DuneResourcesTrackerV2 = new DuneResourcesTrackerV2();

    /*
    game.dune2d20.DuneResourcesTracker = new DuneResourcesTracker({
        popOut: false,
        minimizable: false,
        resizable: false
    });
    */
    
    //CONFIG.debug.hooks = true;

    CONFIG.dune2d20 = dune2d20;
    CONFIG.Item.documentClass = DuneItem;
    CONFIG.Actor.documentClass = DuneActor;

    foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
    foundry.documents.collections.Actors.registerSheet("dune2d20", DuneActorSheet, {types: ["PC", "SC", "NPC"]}); 
    foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, "dune2d20", DuneActorSheetV2, {label: "dune2d20.DuneActorSheetV2.label", types: ["PC", "SC", "NPC"], makeDefault: true}); //, makeDefault: true
    foundry.documents.collections.Actors.registerSheet("dune2d20", DuneHouseSheet, {types: ["House"]});
    foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, "dune2d20", DuneHouseSheetV2, {label: "dune2d20.DuneHouseSheetV2.label", types: ["House"], makeDefault: true});

    foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
    foundry.documents.collections.Items.registerSheet("dune2d20", DuneItemSheet);
    foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "dune2d20", DuneItemSheetV2, {label: "dune2d20.DuneItemSheetV2.label", makeDefault: true});

    registerSystemSettings();

    preloadHandlebarsTemplates();

    // Register custom Handlebars Helpers
	registerHandlebarsHelpers();
});

Hooks.on("dropActorSheetData", function(actor, actorSheet, dropped) {
    if(dropped.type == "Actor") {
        const actorDocument = fromUuidSync(dropped.uuid);

        //console.log(fromUuidSync(actor.system.house));

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

Hooks.on("renderChatMessageHTML", (message, html, context) => Chat.addChatMessageListeners(html));

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        // Sheet V1
        "systems/dune2d20/templates/partials/actors/character-background-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-background-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-background-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-background-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-roles-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-roles-unlocked.hbs",

        // Sheet V1 & Sheet V2
        "systems/dune2d20/templates/partials/actors/character-talents-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-talents-unlocked.hbs",
        "systems/dune2d20/templates/partials/actors/character-assets-locked.hbs",
        "systems/dune2d20/templates/partials/actors/character-assets-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-domaines-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-domaines-unlocked.hbs",
        "systems/dune2d20/templates/partials/house/house-enemies-locked.hbs",
        "systems/dune2d20/templates/partials/house/house-enemies-unlocked.hbs",

        // Sheet V2
        "systems/dune2d20/templates/partials/actors/character-background-unlocked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-background-locked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-locked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-drives-unlocked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-locked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-skills-unlocked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-locked-v2.hbs",
        "systems/dune2d20/templates/partials/actors/character-pools-unlocked-v2.hbs",
        "systems/dune2d20/templates/partials/house/house-overview-locked-v2.hbs",
        "systems/dune2d20/templates/partials/house/house-overview-unlocked-v2.hbs"
    ];

    return foundry.applications.handlebars.loadTemplates(templatePaths);
};

Hooks.once("ready", async function() {
    
    // Tracker Handling
    //console.log(game);

    /* //Tracker v1
    // Identify if User already has ageTrackerPos flag set
    const useTracker = false;
    const userTrackerFlag = await game.user.getFlag("dune2d20", "resourcesTrackerPos");
    if (!userTrackerFlag) await game.user.setFlag("dune2d20", "resourcesTrackerPos", dune2d20.resourcesTrackerPos);
    if (useTracker) game.dune2d20.DuneResourcesTracker.refresh(); */
    
    //Tracker v2
    // Identify if User already has ageTrackerV2Pos flag set
    const useTrackerV2 = true;
    const userTrackerV2Flag = await game.user.getFlag("dune2d20", "resourcesTrackerV2Pos");
    if (!userTrackerV2Flag) await game.user.setFlag("dune2d20", "resourcesTrackerV2Pos", dune2d20.resourcesTrackerV2Pos);
    if (useTrackerV2) game.dune2d20.DuneResourcesTrackerV2.refresh(userTrackerV2Flag);
});