import { dune2d20 } from "../config/config.js";

export default function registerHandlebarsHelpers() {

    Handlebars.registerHelper("times", function (n, block) {
        var accum = "";
        for (var i = 1; i <= n; ++i) {
          block.data.index = i;
          block.data.first = i === 0;
          block.data.last = i === n - 1;
          accum += block.fn(this);
        }
        return accum;
    });

    Handlebars.registerHelper("configLocalize", function(liste, val) {
        return game.i18n.localize(dune2d20[liste][val]);
    });

    /* Handlebars.registerHelper('eachSorted', function(context, options) {
        var ret = ""
        Object.keys(context).sort().forEach(function(key) {
            ret = ret + options.fn({key: key, value: context[key]})
        })
        return ret
    }); */ 
}