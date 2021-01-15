import { createElement } from '../helpers/domHelper';
import { renderArena } from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import {fighterService} from '../services/fightersService';

let selectedFighters = [];

export function createFightersSelector() {

  return async (event, fighterId) => {
    const fighter = await getFighterInfo(fighterId);
    console.log(selectedFighters);
    const [playerOne, playerTwo] = selectedFighters;
    const firstFighter = playerOne ?? fighter;
    const secondFighter = Boolean(playerOne) ? playerTwo ?? fighter : playerTwo;
    selectedFighters = [firstFighter, secondFighter];
    renderSelectedFighters(selectedFighters);
  };
}

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
  let fighter = fighterDetailsMap.get(fighterId);
  if (fighter === undefined) {
    fighter = await fighterService.getFighterDetails(fighterId);
    fighterDetailsMap.set(fighterId, fighter);
  }
  return fighter;
}

function renderSelectedFighters(selectedFighters) {
  if (!selectedFighters.includes(undefined)) {
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);
  
    fightersPreview.innerHTML = '';
    fightersPreview.append(healthIndicators, firstPreview, versusBlock, secondPreview);
  } 
}

function createVersusBlock(selectedFightersArr) {
  const canStartFight = selectedFightersArr.filter(Boolean).length === 2;
  const onClick = () => startFight(selectedFightersArr);
  const onCancel = () => {
    const fightersPreview = document.querySelector('.preview-container___root');
    while (fightersPreview.firstChild) {
      fightersPreview.removeChild(fightersPreview.firstChild);
    }
    selectedFighters = new Array();
    fighterDetailsMap.clear();
  };
  const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
  const image = createElement({
    tagName: 'img',
    className: 'preview-container___versus-img',
    attributes: { src: versusImg },
  });
  const disabledBtn = canStartFight ? '' : 'disabled';
  const fightBtn = createElement({
    tagName: 'button',
    className: `preview-container___fight-btn ${disabledBtn}`,
  });

  const cancelBtn = createElement({
    tagName: 'button',
    className: `preview-container___cancel-btn ${disabledBtn}`,
  });

  fightBtn.addEventListener('click', onClick, false);
  cancelBtn.addEventListener('click', onCancel, false);
  fightBtn.innerText = 'Fight';
  cancelBtn.innerText = 'Cancel';
  container.append(image, fightBtn, cancelBtn);

  return container;
}


function createHealthIndicators(leftFighter, rightFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'fighter-preview___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'fighter-preview___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createHealthIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'fighter-preview___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'fighter-preview___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'fighter-preview___health-indicator' });
  const bar = createElement({ tagName: 'div', className: 'fighter-preview___health-bar', attributes: { id: `${position}-fighter-indicator` }});

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}


function startFight(selectedFighters) {
  renderArena(selectedFighters);
}