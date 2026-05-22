export default class DuneItem extends Item {

    /*
    chatTemplate = {
        "xxx": "systems/dune2d20/templates/partials/chat/xxx.hbs",
        "yyy": "systems/agone/templates/partials/chat/yyy.hbs"
    }
    */

    prepareData() {
        super.prepareData();
        
        if(this.type == "Domain") {
            // Calculate Wealth and Resources income
            if(this.system.area != null && this.system.area != "none" && this.system.section != null && this.system.section != "none") {
                if(this.system.primary) {
                    this.system.wealthIncome = CONFIG.dune2d20.sections[this.system.section].wealthP + CONFIG.dune2d20.areaOfExpertise[this.system.area].wealthP;
                    this.system.resourcesIncome = CONFIG.dune2d20.sections[this.system.section].resourcesP + CONFIG.dune2d20.areaOfExpertise[this.system.area].resourcesP;
                }
                else {
                    this.system.wealthIncome = CONFIG.dune2d20.sections[this.system.section].wealthS + CONFIG.dune2d20.areaOfExpertise[this.system.area].wealthS;
                    this.system.resourcesIncome = CONFIG.dune2d20.sections[this.system.section].resourcesS + CONFIG.dune2d20.areaOfExpertise[this.system.area].resourcesS;
                }
            }
            else {
                this.system.wealthIncome = null;
                this.system.resourcesIncome = null;
            }
        }
    }

}

Hooks.on("createItem", (item, render, id) => onCreateItem(item));

function onCreateItem(item) {

    console.log(item);
    if (item.img == "icons/svg/item-bag.svg" && item.isOwner == true) {
        let image = CONFIG.dune2d20.itemDefIcon[item.type] ? CONFIG.dune2d20.itemDefIcon[item.type] : "icons/svg/mystery-man-black.svg";
        item.img = image;
        item.update({ "img": image});
    }
} 