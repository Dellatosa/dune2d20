export default class DuneActor extends Actor {

    prepareData() {
        super.prepareData();

        // Set min and max values for Skills

        // BATTLE
        if(this.system.skills.battle.value < this.system.skills.battle.min) this.system.skills.battle.value = this.system.skills.battle.min;
        if(this.system.skills.battle.value > this.system.skills.battle.max) this.system.skills.battle.value = this.system.skills.battle.max;
        // COMMUNICATE
        if(this.system.skills.communicate.value < this.system.skills.communicate.min) this.system.skills.communicate.value = this.system.skills.communicate.min;
        if(this.system.skills.communicate.value > this.system.skills.communicate.max) this.system.skills.communicate.value = this.system.skills.communicate.max;
        // DISCIPLINE
        if(this.system.skills.discipline.value < this.system.skills.discipline.min) this.system.skills.discipline.value = this.system.skills.discipline.min;
        if(this.system.skills.discipline.value > this.system.skills.discipline.max) this.system.skills.discipline.value = this.system.skills.discipline.max;
        // MOVE
        if(this.system.skills.move.value < this.system.skills.move.min) this.system.skills.move.value = this.system.skills.move.min;
        if(this.system.skills.move.value > this.system.skills.move.max) this.system.skills.move.value = this.system.skills.move.max;
        // UNDERSTAND
        if(this.system.skills.understand.value < this.system.skills.understand.min) this.system.skills.understand.value = this.system.skills.understand.min;
        if(this.system.skills.understand.value > this.system.skills.understand.max) this.system.skills.understand.value = this.system.skills.understand.max;

        if(this.type != "House") {
            
            // Set min and max values for Drives

            // DUTY
            if(this.system.drives.duty.value < this.system.drives.duty.min) this.system.drives.duty.value = this.system.drives.duty.min;
            if(this.system.drives.duty.value > this.system.drives.duty.max) this.system.drives.duty.value = this.system.drives.duty.max;
            // FAITH
            if(this.system.drives.faith.value < this.system.drives.faith.min) this.system.drives.faith.value = this.system.drives.faith.min;
            if(this.system.drives.faith.value > this.system.drives.faith.max) this.system.drives.faith.value = this.system.drives.faith.max;
            // JUSTICE
            if(this.system.drives.justice.value < this.system.drives.justice.min) this.system.drives.justice.value = this.system.drives.justice.min;
            if(this.system.drives.justice.value > this.system.drives.justice.max) this.system.drives.justice.value = this.system.drives.justice.max;
            // POWER
            if(this.system.drives.power.value < this.system.drives.faith.min) this.system.drives.faith.value = this.system.drives.faith.min;
            if(this.system.drives.faith.value > this.system.drives.faith.max) this.system.drives.faith.value = this.system.drives.faith.max;
            // TRUTH
            if(this.system.drives.truth.value < this.system.drives.truth.min) this.system.drives.truth.value = this.system.drives.truth.min;
            if(this.system.drives.truth.value > this.system.drives.truth.max) this.system.drives.truth.value = this.system.drives.truth.max;

            if(this.type == "PC") {
                // ADVANCEMENT
                if(this.system.resources.advancementPoints.value < this.system.resources.advancementPoints.min) this.system.resources.advancementPoints.value = this.system.resources.advancementPoints.min;

                // DETERMINATION
                if(this.system.resources.determination.value < this.system.resources.determination.min) this.system.resources.determination.value = this.system.resources.determination.min;
                if(this.system.resources.determination.value > this.system.resources.determination.max) this.system.resources.determination.value = this.system.resources.determination.max;
            }
        }
        
        if(this.type == "House") {
            // Calculate Upkeep and modifier

            // Military Power
            if(this.system.militaryPower != null) {
                this.system.militaryPowerUpkeep = CONFIG.dune2d20.militaryPowerLevel[this.system.militaryPower].wealthUpkeep;
                this.system.militaryPowerDifficulty = CONFIG.dune2d20.militaryPowerLevel[this.system.militaryPower].difficulty;
            }

            // Population Loyalty
            if(this.system.populationLoyalty != null) {
                this.system.populationLoyaltyUpkeep = CONFIG.dune2d20.populationLoyaltyLevel[this.system.populationLoyalty].wealthUpkeep;
                this.system.populationLoyaltyModifier = CONFIG.dune2d20.populationLoyaltyLevel[this.system.populationLoyalty].modifier;
            }

            // Lifestyle
            if(this.system.lifestyle != null) {
                this.system.lifestyleUpkeep = CONFIG.dune2d20.lifestyleLevel[this.system.lifestyle].wealthUpkeep;
                this.system.lifestyleTrait = CONFIG.dune2d20.lifestyleLevel[this.system.lifestyle].trait;
            }

            // Skills Upkeep
            this.system.skillsUpkeep = this.calculateSkillsUpkeep();

            // Additional Roles
            if(this.system.houseType != "none") {
                this.system.additionalRoles = CONFIG.dune2d20.houseType[this.system.houseType].additionalRoles;
            }

            // Total Upkeep
            this.system.totalUpkeep = this.system.rolesUpkeep + this.system.skillsUpkeep + this.system.militaryPowerUpkeep
                + this.system.populationLoyaltyUpkeep + this.system.lifestyleUpkeep;

            // Status level
            this.system.statusLevel = this.calculateStatusLevel();
        }
    }

    get isUnlocked() {
        if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
        return false;
    }

    calculateSkillsUpkeep() {
        let skillsUpkeep = 0;

        for (const [key, skill] of Object.entries(this.system.skills)) {
            switch (skill.value) {
                case 10:
                    skillsUpkeep += 24;
                    break;
                case 9:
                    skillsUpkeep += 12;
                    break;
                case 8:
                    skillsUpkeep += 8;
                    break;
                case 7:
                    skillsUpkeep += 4;
                    break;
                case 6:
                case 5:
                    skillsUpkeep += 2;
                    break;
            }
        };

        return skillsUpkeep;
    }

    calculateStatusLevel() {
        for(const [key, status] of Object.entries(CONFIG.dune2d20.status).reverse()) {
            if (this.system.status.value >= status[this.system.houseType]) {
                return key;
            }
        }
    }
}


Hooks.on("createActor", (actor, render, id) => onCreateActor(actor));

function onCreateActor(actor) {
    if (actor.img == "icons/svg/mystery-man.svg") {
        let image = null;
        if(actor.type != "House") {
            image = "systems/dune2d20/images/sheet/mystery-man-dune.svg";
        }
        else {
            image = "systems/dune2d20/images/sheet/combat-dune.svg";
        }

        actor.img = image;
        actor.update({ "img": image});
    }
} 