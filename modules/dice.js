export async function rollDrive({actor = null, drive = null} = {}) {
    // Roll Drive options
    let dialogOptions = await getRollSkillOptions({cfgData: CONFIG.dune2d20, actor: actor, drive: drive});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions.annule) {
        return null;
    }
}

export async function rollSkill({actor = null, skill = null} = {}) {
    // Roll Skill options
    let dialogOptions = await getRollSkillOptions({cfgData: CONFIG.dune2d20, actor: actor, skill: skill});

    // Cancel roll if 'Cancel' or 'Close' button used
    if(dialogOptions.annule) {
        return null;
    }
}