export async function roll({type = null, actor = null, drive = null, skill= null, focuses = null} = {}) {
    // Roll Drive options
    let focusesList
    if (focuses) {
        focusesList = focuses && focuses.length > 0 ? [{id: "none", name: "", nameWithSkl: ""}] : null;

        focuses.forEach(foc => {
            const skill = game.i18n.localize(CONFIG.dune2d20.skills[foc.system.skill]);
            let result = foc.name.concat(" (");
            if (skill.length > 3) { result = result.concat(skill.slice(0, 3), ")") };
            focusesList.push({id: foc._id, name: foc.name, nameWithSkl: result});
        });
    }
    else {
        focusesList = null;
    }
    
    let dialogOptions = await getRollOptions({cfgData: CONFIG.dune2d20, type: type, actor: actor, drive: drive, skill: skill, focuses: focusesList});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions == "cancel" || dialogOptions == null) {
        return null;
    }

    // Can reroll
    const canReroll = true;

    // Drive and Skill selection
    if(type == "drive" || type == "driveHouse") {
        skill = dialogOptions.skill;
    }
    else if (type == "skill" || type == "skillHouse") {
        if(actor.system.category == "minor") {
            drive = "genDrive";
        }
        else {
            drive = dialogOptions.drive;
        }
    }

    let skillValue;
    if(type == "skillHouse" || type == "driveHouse") {
        skillValue = fromUuidSync(actor.system.house).system.skills[skill].value;
    }
    else {
        skillValue = actor.system.skills[skill].value;
    }

    let driveValue;
    if(drive == "genDrive") {
        driveValue = actor.system.genDrive.value;
    }
    else {
        driveValue = actor.system.drives[drive].value;
    }

    // Focus
    let focus = dialogOptions.focusId != null && dialogOptions.focusId != "none" ? actor.items.get(dialogOptions.focusId) : null;
    if(focus != null && focus.system.skill != skill) {
        focus = null;
        ui.notifications.warn(game.i18n.localize("dune2d20.notification.focusSkillMismatch"));
    }

    // Difficulty
    let difficulty = dialogOptions.difficulty;
    if (difficulty > 5) { difficulty = 5};
    if (difficulty < 1) { difficulty = 1};

    let dicePoolSize = dialogOptions.dicePoolSize;
    let useDetermination = dialogOptions.useDetermination;   

    // Roll formula
    let rollFormula = `${dicePoolSize}d20cs<=${skillValue + driveValue}`;
    let rollResult = await new Roll(rollFormula, null).evaluate();

    // Change greater dice value to 1 if determination used
    if(useDetermination) {
        const greaterDiceValue = Math.max(...rollResult.dice[0].results.map(res => res.result));
        const index = rollResult.dice[0].results.findIndex(res => res.result == greaterDiceValue);

        rollResult.dice[0].results[index].count = 1;
        rollResult.dice[0].results[index].result = 1;
        rollResult.dice[0].results[index].success = true;
        rollResult.dice[0].results[index].determination = true;

        actor.update({"system.resources.determination.value": actor.system.resources.determination.value - 1});
    }

    let complication = false;
    rollResult.dice[0].results.forEach(res => {
        if (focus != null && res.result <= skillValue) {
            res.count += 1;
            res.critSuccess = true;
        }
        else if (res.result == 1) {
            res.count += 1;
            res.critSuccess = true;
        }

        if(res.result >= 20) {
            complication = true;
            res.complication = true;
        }
    });
    
    // Test passed
    const successfulTest = rollResult.result >= difficulty;

    // Generated momentum
    const momentum = rollResult.result > difficulty ? rollResult.result - difficulty : 0;

    //console.log(type == "skillHouse" || type == "driveHouse");

    let rollStats = {
        actor: actor,
        houseRoll: type == "skillHouse" || type == "driveHouse",
        skillName: game.i18n.localize(CONFIG.dune2d20.skills[skill]),
        skillValue: skillValue,
        driveName: drive == "genDrive" ? game.i18n.localize("dune2d20.actor.drive") : game.i18n.localize(CONFIG.dune2d20.drives[drive]),
        driveValue: driveValue,
        focus: focus,
        difficulty: difficulty,
        useDetermination: useDetermination,
        nbSuccesses: rollResult.result,
        successfulTest: successfulTest,
        momentum: momentum,
        complication: complication,
        dices: rollResult.dice[0].results,
        canReroll: canReroll
    };

    // Chat message
    const messageTemplate = "systems/dune2d20/templates/rolls/chat/roll-chat-message.html";

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        roll: rollResult,
        content: await foundry.applications.handlebars.renderTemplate(messageTemplate, rollStats),
        sound: CONFIG.sounds.dice
    }

    await ChatMessage.create(chatData);
}

async function getRollOptions({cfgData = null, type = null, actor = null, drive = null, skill = null, focuses = null}) {

    let nbDice = 2;
    let difficulty = 1;
    let useDetermination = false;

    // Template
    let template = null;
    let title = null;

    //console.log(type);
    switch(type) {
        case "drive":
        case "driveHouse":
            template = "systems/dune2d20/templates/rolls/dialog/drive-roll-dialog-v2.hbs";
            title = "dune2d20.dialog.driveRoll";
            break;
        case "skill":
        case "skillHouse":
            //template = "systems/dune2d20/templates/rolls/dialog/skill-roll-dialog.html";
            template = "systems/dune2d20/templates/rolls/dialog/skill-roll-dialog-v2.hbs";
            title = "dune2d20.dialog.skillRoll"
            break;
    }
    
    let dialogContext = {
        cfgData,
        type,
        actor,
        drive,
        skill,
        focuses,
        difficulty,
        nbDice,
        useDetermination
    }

    const html = await foundry.applications.handlebars.renderTemplate(template, dialogContext);

    const rollOptions = await foundry.applications.api.DialogV2.wait({
      window: { title },
      classes: ["dune2d20", "roll-dialog"],
      position: { width: 430 },
      content: html,
      rejectClose: false, 
      buttons: [
        {
            action: "roll",
            label: "dune2d20.dialog.roll",
            icon: "fa-solid fa-dice-d20",
            callback: (event, button, dialog) => {
                return _processRollOptions(button.form);
            }
        },
        {
            action: "cancel",
            label: "dune2d20.dialog.cancel",
        }
      ]});

    return rollOptions;
}

function _processRollOptions(form) {
    let drive = null;
    if(form.drive) {
        drive = form.drive.value;
    }

    let skill = null;
    if(form.skill) {
        skill = form.skill.value;
    }

    let focus = null;
    if(form.focus) {
        focus = form.focus.value;
    }

    let useDetermination = false;
    if(form.useDetermination) {
        useDetermination = form.useDetermination.checked;
    }

    return {
        drive: drive,
        skill: skill,
        focusId: focus,
        difficulty: parseInt(form.difficulty.value),
        useDetermination : useDetermination,
        dicePoolSize: parseInt(form.dicePoolSize.value)
    }
}

export async function reroll(actor, houseRoll, driveName, driveValue, skillName, skillValue, dicesSel, focus, difficulty) {  
    // Can't reroll more than once
    const canReroll = false;

    // Focus
    const intialFocus = focus != "" ? {name: focus} : null;

    // Roll formula
    const rerollPoolSize = dicesSel.filter(die => die.select == true).length;
    let rollFormula = `${rerollPoolSize}d20cs<=${skillValue + driveValue}`;
    let rollResult = await new Roll(rollFormula, null).evaluate(); //.roll({async: true});
    
    // Reconstruct roll result
    let dicePoolResult = rollResult.dice[0].results.map((x) => x);
    dicesSel.filter(die => die.select == false).reverse().forEach(die => {
        //console.log(die);
        const success = die.result <= (skillValue + driveValue);
        dicePoolResult.splice(0, 0, {active: true, count: success ? 1 : 0, result: die.result, success: success, determination: die.determination});
    });

    let complication = false;
    dicePoolResult.forEach(res => {
        if (intialFocus != null && res.result <= skillValue) {
            res.count += 1;
            res.critSuccess = true;
        }
        else if (res.result == 1) {
            res.count += 1;
            res.critSuccess = true;
        }

        if(res.result >= 20) {
            complication = true;
            res.complication = true;
        }
    });

    // Number of Successes
    const initialValue = 0;
    const nbSuccesses = dicePoolResult.reduce((accumulator, die) => accumulator + die.count, initialValue);

    // Test passed
    const successfulTest = nbSuccesses >= difficulty;

    // Generated momentum
    const momentum = nbSuccesses > difficulty ? nbSuccesses - difficulty : 0;

    //console.log(houseRoll);

    let rollStats = {
        actor: actor,
        houseRoll: houseRoll,
        skillName: skillName,
        skillValue: skillValue,
        driveName: driveName,
        driveValue: driveValue,
        focus: intialFocus,
        difficulty: difficulty,
        nbSuccesses: nbSuccesses, 
        successfulTest: successfulTest,
        momentum: momentum,
        complication: complication,
        dices: dicePoolResult,
        canReroll: canReroll
    };

    // Chat message
    const messageTemplate = "systems/dune2d20/templates/rolls/chat/roll-chat-message.html";

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        roll: rollResult,
        content: await foundry.applications.handlebars.renderTemplate(messageTemplate, rollStats),
        sound: CONFIG.sounds.dice
    }

    await ChatMessage.create(chatData);
}
