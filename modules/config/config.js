export const dune2d20 = {};

dune2d20.drives = {
    none: "",
    duty: "dune2d20.actor.duty",
    faith: "dune2d20.actor.faith",
    justice: "dune2d20.actor.justice",
    power: "dune2d20.actor.power",
    truth: "dune2d20.actor.truth"
}

dune2d20.drivesMdt = {
    duty: "dune2d20.actor.duty",
    faith: "dune2d20.actor.faith",
    justice: "dune2d20.actor.justice",
    power: "dune2d20.actor.power",
    truth: "dune2d20.actor.truth"
}

dune2d20.skills = {
    none: "",
    battle: "dune2d20.actor.battle",
    communicate: "dune2d20.actor.communicate",
    discipline: "dune2d20.actor.discipline",
    move: "dune2d20.actor.move",
    understand: "dune2d20.actor.understand"
}

dune2d20.skillsMdt = {
    battle: "dune2d20.actor.battle",
    communicate: "dune2d20.actor.communicate",
    discipline: "dune2d20.actor.discipline",
    move: "dune2d20.actor.move",
    understand: "dune2d20.actor.understand"
}

dune2d20.factions = {
    none: "",
    beneGesserit: "dune2d20.config.beneGesserit",
    fremen: "dune2d20.config.fremen",
    mentat: "dune2d20.config.mentat",
    spacingGuild: "dune2d20.config.spacingGuild",
    sukDoctor: "dune2d20.config.sukDoctor"
}

dune2d20.houseType = {
    none: "",
    nascentHouse: "dune2d20.config.nascentHouse",
    houseMinor: "dune2d20.config.houseMinor",
    houseMajor: "dune2d20.config.houseMajor",
    greatHouse: "dune2d20.config.greatHouse"
}

dune2d20.hatred = {
    none: "",
    dislike: "dune2d20.config.dislike",
    rival: "dune2d20.config.rival",
    loathing: "dune2d20.config.loathing",
    kanly: "dune2d20.config.kanly"
}

dune2d20.militaryPowerLevel = {
    empty:{
        label: ""
    },
    none: {
        label: "dune2d20.config.none",
        difficulty: 0,
        wealthUpkeep: 0 
    },
    militia: {
        label: "dune2d20.config.militia",
        difficulty: 1,
        wealthUpkeep: 5 
    },
    groundDefense: {
        label: "dune2d20.config.groundDefense",
        difficulty: 2,
        wealthUpkeep: 10 
    },
    planetaryDefense: {
        label: "dune2d20.config.planetaryDefense",
        difficulty: 3,
        wealthUpkeep: 20 
    },
    assaultForce: {
        label: "dune2d20.config.assaultForce",
        difficulty: 4,
        wealthUpkeep: 30 
    },
    invasionFleet: {
        label: "dune2d20.config.invasionFleet",
        difficulty: 5,
        wealthUpkeep: 50 
    }
}

dune2d20.populationLoyaltyLevel = {
    empty:{
        label: ""
    },
    hatred: {
        label: "dune2d20.config.hatred",
        modifier: 2,
        wealthUpkeep: 0 
    },
    loathing: {
        label: "dune2d20.config.loathingPL",
        modifier: 1,
        wealthUpkeep: 5 
    },
    acceptance: {
        label: "dune2d20.config.acceptance",
        difficulty: 0,
        wealthUpkeep: 10 
    },
    appreciation: {
        label: "dune2d20.config.appreciation",
        difficulty: 1,
        wealthUpkeep: 20 
    },
    love: {
        label: "dune2d20.config.love",
        difficulty: 2,
        wealthUpkeep: 40 
    }
}

dune2d20.lifestyleLevel = {
    empty:{
        label: ""
    },
    ofThePeople: {
        label: "dune2d20.config.ofThePeople",
        trait: "commoners",
        wealthUpkeep: 0 
    },
    poor: {
        label: "dune2d20.config.poor",
        trait: "poor",
        wealthUpkeep: 5 
    },
    noble: {
        label: "dune2d20.config.noble",
        trait: "",
        wealthUpkeep: 10 
    },
    wealthy: {
        label: "dune2d20.config.wealthy",
        trait: "impressive",
        wealthUpkeep: 30 
    },
    imperial: {
        label: "dune2d20.config.imperial",
        trait: "envied",
        wealthUpkeep: 60 
    }
}

dune2d20.itemDefIcon = {
    Asset: "systems/dune2d20/images/sheet/item-icon-2.png",
    Domain: "systems/dune2d20/images/sheet/item-icon-1.png",
    Trait: "systems/dune2d20/images/sheet/item-icon-1.png",
    Talent: "systems/dune2d20/images/sheet/item-icon-2.png",
    Enemy: "systems/dune2d20/images/sheet/combat-dune-dark.svg",
    Focus: "systems/dune2d20/images/sheet/item-icon-1.png",
}

dune2d20.resourcesTrackerPos = {xPos: "840px", yPos: "3px"};

dune2d20.resourcesTrackerV2Pos = {left: 215, top: 819, height:180, width: 282, scale:1, zIndex: 101};