//import { dune2d20 } from "./config.js";

export const registerSystemSettings = function() {
    
    // Suggestions des échecs ctitiques envoyées à l'EG
    game.settings.register("dune2d20","xxx", {
        config: true,
        scope: "world",
        name: "parameters.xxx.name",
        hint: "parameters.xx.label",
        type: Boolean,
        default: true
    });
}