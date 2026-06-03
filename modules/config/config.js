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
    none: {
        label: ""
    },
    nascentHouse: {
        label: "dune2d20.config.nascentHouse",
        additionalRoles: 2,
        startingStatus: 15 
    },
    houseMinor: {
        label: "dune2d20.config.houseMinor",
        additionalRoles: 4,
        startingStatus: 25
    },
    houseMajor: {
        label: "dune2d20.config.houseMajor",
        additionalRoles: 6,
        startingStatus: 45
    },
    greatHouse: {
        label: "dune2d20.config.greatHouse",
        additionalRoles: 8,
        startingStatus: 65
    }
}

dune2d20.hatred = {
    none: "",
    dislike: "dune2d20.config.dislike",
    rival: "dune2d20.config.rival",
    loathing: "dune2d20.config.loathing",
    kanly: "dune2d20.config.kanly"
}

dune2d20.areaOfExpertise = {
    none: {
        label: "",
        resourcesP: null,
        resourcesS: null,
        wealthP: null,
        wealthS: null
    },
    artistic: {
        label: "dune2d20.config.artistic",
        resourcesP: -3,
        resourcesS: -1,
        wealthP: 8,
        wealthS: 4
    },
    espionage: {
        label: "dune2d20.config.espionage",
        resourcesP: -3,
        resourcesS: -1,
        wealthP: 8,
        wealthS: 4
    },
    farming: {
        label: "dune2d20.config.farming",
        resourcesP: 3,
        resourcesS: 1,
        wealthP: -6,
        wealthS: -4
    },
    industrial: {
        label: "dune2d20.config.industrial",
        resourcesP: 3,
        resourcesS: 1,
        wealthP: -6,
        wealthS: -4
    },
    kanly: {
        label: "dune2d20.config.kanly",
        resourcesP: 3,
        resourcesS: 1,
        wealthP: -6,
        wealthS: -4
    },
    military: {
        label: "dune2d20.config.military",
        resourcesP: 3,
        resourcesS: 1,
        wealthP: -6,
        wealthS: -4
    },
    political: {
        label: "dune2d20.config.political",
        resourcesP: -3,
        resourcesS: -1,
        wealthP: 8,
        wealthS: 4
    },
    religious: {
        label: "dune2d20.config.religious",
        resourcesP: -3,
        resourcesS: -1,
        wealthP: 8,
        wealthS: 4
    },
    scientific: {
        label: "dune2d20.config.scientific",
        resourcesP: 3,
        resourcesS: 1,
        wealthP: -6,
        wealthS: -4
    }
}

dune2d20.sections = {
    none: {
        label: "",
        resourcesP: null,
        resourcesS: null,
        wealthP: null,
        wealthS: null
    },
    machinery: {
        label: "dune2d20.config.machinery",
        resourcesP: 12,
        resourcesS: 6,
        wealthP: 32,
        wealthS: 16
    },
    produce: {
        label: "dune2d20.config.produce",
        resourcesP: 10,
        resourcesS: 5,
        wealthP: 30,
        wealthS: 18
    },
    expertise: {
        label: "dune2d20.config.expertise",
        resourcesP: 6,
        resourcesS: 3,
        wealthP: 44,
        wealthS: 22
    },
    workers: {
        label: "dune2d20.config.workers",
        resourcesP: 8,
        resourcesS: 4,
        wealthP: 40,
        wealthS: 20
    },
    understanding: {
        label: "dune2d20.config.understanding",
        resourcesP: 6,
        resourcesS: 3,
        wealthP: 42,
        wealthS: 22
    }
}

dune2d20.militaryPowerLevel = {
    empty:{
        label: "",
        difficulty: null,
        wealthUpkeep: null 
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
        label: "",
        modifier: null,
        wealthUpkeep: null
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
        modifier: 0,
        wealthUpkeep: 10 
    },
    appreciation: {
        label: "dune2d20.config.appreciation",
        modifier: 1,
        wealthUpkeep: 20 
    },
    love: {
        label: "dune2d20.config.love",
        modifier: 2,
        wealthUpkeep: 40 
    }
}

dune2d20.lifestyleLevel = {
    empty:{
        label: "",
        trait: null,
        wealthUpkeep: null
    },
    ofThePeople: {
        label: "dune2d20.config.ofThePeople",
        trait: "dune2d20.config.commoners",
        wealthUpkeep: 0 
    },
    poor: {
        label: "dune2d20.config.poor",
        trait: "dune2d20.config.poor",
        wealthUpkeep: 5 
    },
    noble: {
        label: "dune2d20.config.noble",
        trait: "",
        wealthUpkeep: 10 
    },
    wealthy: {
        label: "dune2d20.config.wealthy",
        trait: "dune2d20.config.impressive",
        wealthUpkeep: 30 
    },
    imperial: {
        label: "dune2d20.config.imperial",
        trait: "dune2d20.config.envied",
        wealthUpkeep: 60 
    }
}

dune2d20.status = {
    feeble: { 
        label: "dune2d20.config.feeble",
        nascentHouse: 0,
        houseMinor: 0,
        houseMajor: 0,
        greatHouse: 0
    },
    weak: {
        label: "dune2d20.config.weak",
        nascentHouse: 11,
        houseMinor: 11,
        houseMajor: 21,
        greatHouse: 41
    },
    respected: {
        label: "dune2d20.config.respected",
        nascentHouse: 21,
        houseMinor: 21,
        houseMajor: 41,
        greatHouse: 61
    },
    strong: {
        label: "dune2d20.config.strong",
        nascentHouse: 41,
        houseMinor: 41,
        houseMajor: 61,
        great: 71
    },
    problematic: {
        label: "dune2d20.config.problematic",
        nascentHouse: 51,
        houseMinor: 51,
        houseMajor: 71,
        greatHouse: 81
    },
    dangerous: {
        label: "dune2d20.config.dangerous",
        nascentHouse: 71,
        houseMinor: 71,
        houseMajor: 81,
        greatHouse: 91
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