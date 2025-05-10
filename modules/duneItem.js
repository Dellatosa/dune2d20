export default class DuneItem extends Item {

    /*
    chatTemplate = {
        "xxx": "systems/dune2d20/templates/partials/chat/xxx.hbs",
        "yyy": "systems/agone/templates/partials/chat/yyy.hbs"
    }
    */

    prepareData() {
        super.prepareData();
        let data = this.system;

        
    }

}

Hooks.on("createItem", (item, render, id) => onCreateItem(item));

function onCreateItem(item) {
    if (item.img == "icons/svg/item-bag.svg") {
        let image = CONFIG.dune2d20.itemDefIcon[item.type] ? CONFIG.dune2d20.itemDefIcon[item.type] : "icons/svg/mystery-man-black.svg";
        //let image = "systems/dune2d20/images/sheet/item-icon-2.png";
        item.img = image;
    }
}