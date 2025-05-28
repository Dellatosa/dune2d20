export async function roll({type = null, actor = null, drive = null, skill= null, focuses = null} = {}) {
    // Roll Drive options
    let dialogOptions = await getRollOptions({cfgData: CONFIG.dune2d20, type: type, actor: actor, drive: drive, skill: skill, focuses: focuses});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions.cancel) {
        return null;
    }

    // Drive and Skill selection
    if(type == "drive") {
        skill = dialogOptions.skill;
    }
    else if (type == "skill") {
        drive = dialogOptions.drive;
    }
    let skillValue = actor.system.skills[skill].value;
    let driveValue = actor.system.drives[drive].value;

    // Focus
    let focus = dialogOptions.focusNum != null && dialogOptions.focusNum != "none" ? focuses[dialogOptions.focusNum] : null;
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
    let rollResult = await new Roll(rollFormula, null).roll({async: true});

    // Change greater dice value to 1 if determination used
    if(useDetermination) {
        const greaterDiceValue = Math.max(...rollResult.dice[0].results.map(res => res.result));
        const index = rollResult.dice[0].results.findIndex(res => res.result == greaterDiceValue);

        console.log(greaterDiceValue, index);

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

    let rollStats = {
        actor: actor,
        skillName: game.i18n.localize(CONFIG.dune2d20.skills[skill]),
        skillValue: skillValue,
        driveName:game.i18n.localize(CONFIG.dune2d20.drives[drive]),
        driveValue: driveValue,
        focus: focus,
        difficulty: difficulty,
        useDetermination: useDetermination,
        nbSuccesses: rollResult.result,
        successfulTest: successfulTest,
        momentum: momentum,
        complication: complication,
        dices: rollResult.dice[0].results
    };

    console.log(rollResult);
    console.log(rollStats);

    // Chat message
    const messageTemplate = "systems/dune2d20/templates/rolls/chat/roll-chat-message.html";

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        roll: rollResult,
        content: await renderTemplate(messageTemplate, rollStats),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    }

    await ChatMessage.create(chatData);
}

async function getRollOptions({cfgData = null, type = null, actor = null, drive = null, skill = null, focuses = null}) {

    let nbDice = 2;
    let difficulty = 1;

    // Template
    let template = null;
    let title = null;

    switch(type) {
        case "drive":
            template = "systems/dune2d20/templates/rolls/dialog/drive-roll-dialog.html";
            title = "dune2d20.dialog.driveRoll";
            break;
        case "skill":
            template = "systems/dune2d20/templates/rolls/dialog/skill-roll-dialog.html";
            title = "dune2d20.dialog.driveSkill"
            break;
    }
    
    const html = await renderTemplate(template, {data: cfgData, actor: actor, drive: drive, skill: skill, focuses: focuses, difficulty: difficulty, nbDice: nbDice, useDetermination: false});

    return new Promise( resolve => {
        const data = {
            title: game.i18n.localize(title),
            content: html,
            buttons: {
                roll: { // Roll dices button
                    icon: '<i class="fa-solid fa-dice-d20"></i>',
                    label: game.i18n.localize("dune2d20.dialog.roll"),
                    callback: html => resolve(_processRollOptions(html[0].querySelector("form")))
                },
                cancel: { // Cancel button 
                    label: game.i18n.localize("dune2d20.dialog.cancel"),
                    callback: html => resolve({cancel: true})
                }
            },
            default: "roll",
            close: () => resolve({cancel: true})
        }

        // Show dialog
        new Dialog(data, null).render(true);
    });
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
        focusNum: focus,
        difficulty: parseInt(form.difficulty.value),
        useDetermination : useDetermination,
        dicePoolSize: parseInt(form.dicePoolSize.value)
    }
}

export async function rollSkill({actor = null, skill = null, focuses = null} = {}) {
    // Roll Skill options
    let dialogOptions = await getRollSkillOptions({cfgData: CONFIG.dune2d20, actor: actor, skill: skill});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions.cancel) {
        return null;
    }
}

function _processRollOptionstemplate(form) {
    let chkDataOpt = false;
    if(form.checkboxOptField) {
        chkDataOpt = form.checkboxOptField.checked;
    }

    return {
        data1: form.field1.value,
        intData1: parseInt(form.numField.value),
        chkData1 : form.checkboxField1.checked,
        chkDataOpt2: chkDataOpt
    }
}