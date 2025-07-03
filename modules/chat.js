import DuneRerollFormApplication from "./apps/duneRerollApp.js";
import * as Roll from "./roll.js";

export function addChatListeners(html) {
    html.on('click', 'a.reroll', onReroll)
}

async function onReroll(event) {
    const dataset = event.currentTarget.dataset;
    const actor = game.actors.get(dataset.actorId);

    //console.log(dataset);

    let dices = [{ result: parseInt(dataset.dice0), determination: (dataset.dice0Det), select: false}];
    if (dataset.dice1) { dices.push({ result:parseInt(dataset.dice1), determination: (dataset.dice1Det), select: false }) };
    if (dataset.dice2) { dices.push({ result:parseInt(dataset.dice2), determination: (dataset.dice2Det), select: false }) };
    if (dataset.dice3) { dices.push({ result:parseInt(dataset.dice3), determination: (dataset.dice3Det), select: false }) };
    if (dataset.dice4) { dices.push({ result:parseInt(dataset.dice4), determination: (dataset.dice4Det), select: false }) };

    const dicesSel = await DuneRerollFormApplication.open(actor, dices);
    if(dicesSel) {
        //console.log(dicesSel);
        Roll.reroll(actor, dataset.driveName, parseInt(dataset.driveValue), dataset.skillName, parseInt(dataset.skillValue), dicesSel, dataset.focus, dataset.difficulty);
    }
}