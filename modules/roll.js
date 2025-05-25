export async function roll({type = null, actor = null, drive = null, skill= null, focuses = null} = {}) {
    // Roll Drive options
    let dialogOptions = await getRollOptions({cfgData: CONFIG.dune2d20, type: type, actor: actor, drive: drive, skill: skill, focuses: focuses});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions.cancel) {
        return null;
    }

    //console.log(dialogOptions);
    
    if(type == "drive") {
        skill = dialogOptions.skill;
    }
    if(type == "skill") {
        drive = dialogOptions.drive;
    }
    let skillValue = actor.system.skills[skill].value;
    let driveValue = actor.system.drives[drive].value;
    let focus = dialogOptions.focusNum != null && dialogOptions.focusNum != "none" ? focuses[dialogOptions.focusNum] : null;
    let difficulty = dialogOptions.difficulty;
    let dicePoolSize = dialogOptions.dicePoolSize;
    let useDetermination = dialogOptions.useDetermination;   
    
    console.log("focus", focus);

    let rollFormula = `${dicePoolSize}d20cs<=${skillValue + driveValue}`;
    console.log(rollFormula);

    let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
}

async function getRollOptions({cfgData = null, type = null, actor = null, drive = null, skill = null, focuses = null}) {

    let nbDice = 2;
    let difficulty = 1;

    // Template
    let template = null;
    let title = null;

    switch(type) {
        case "drive":
            template = "systems/dune2d20/templates/rolls/drive-roll-dialog.html";
            title = "dune2d20.dialog.driveRoll";
            break;
        case "skill":
            template = "systems/dune2d20/templates/rolls/skill-roll-dialog.html";
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