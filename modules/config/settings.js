//import { dune2d20 } from "./config.js";

export const registerSystemSettings = function() {
    
    game.settings.register("dune2d20","momentumPool", {
        config: false,
        scope: "world",
        name: "duned20.setting.momentumPool",
        hint: "",
        type: Object,
        default: {max: 6, value: 0},
        onChange: value => { game.dune2d20.DuneResourcesTrackerV2.refresh(null); }
    });

    game.settings.register("dune2d20","threatPool", {
        config: false,
        scope: "world",
        name: "duned20.setting.threatPool",
        hint: "",
        type: Object,
        default: {max: 99, value: 0},
        onChange: value => { game.dune2d20.DuneResourcesTrackerV2.refresh(null); }
    });
}