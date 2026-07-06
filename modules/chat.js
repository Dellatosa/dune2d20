//import DuneRerollFormApplication from "./apps/duneRerollApp.js";
import DuneRerollAppV2 from "./apps/duneRerollAppV2.js";
import * as Roll from "./roll.js";

/*
export function addChatListeners(html) {
    console.log("dune2d20 - CHATLOG");
    //html.querySelector('a.reroll').addEventListener('click', onReroll);
    let sel = html.querySelectorAll('a.reroll'); 
    sel.forEach(element => {
        element.addEventListener('click', onReroll);
    });
}
*/

export function addChatMessageListeners(html) {
    const query = html.querySelector('a.reroll');
    if(query) { query.addEventListener('click', onReroll); }
}

async function onReroll(event) {
    //console.log(event);

    const dataset = event.currentTarget.dataset;
    const actor = game.actors.get(dataset.actorId);

    let dices = [{ result: parseInt(dataset.dice0), determination: (dataset.dice0Det), select: false}];
    if (dataset.dice1) { dices.push({ result:parseInt(dataset.dice1), determination: (dataset.dice1Det), select: false }) };
    if (dataset.dice2) { dices.push({ result:parseInt(dataset.dice2), determination: (dataset.dice2Det), select: false }) };
    if (dataset.dice3) { dices.push({ result:parseInt(dataset.dice3), determination: (dataset.dice3Det), select: false }) };
    if (dataset.dice4) { dices.push({ result:parseInt(dataset.dice4), determination: (dataset.dice4Det), select: false }) };

    //const dicesSel = await DuneRerollFormApplication.open(actor, dices);
    const dicesSel = await DuneRerollAppV2.open(actor, dices);

    if(dicesSel) {
        Roll.reroll(actor, dataset.houseRoll, dataset.driveName, parseInt(dataset.driveValue), dataset.skillName, parseInt(dataset.skillValue), dicesSel, dataset.focus, dataset.difficulty);
    }
}