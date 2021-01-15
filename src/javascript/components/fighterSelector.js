import { createElement } from '../helpers/domHelper';
import { renderArena } from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import {fighterService} from '../services/fightersService';

export function createFightersSelector() {
  let selectedFighters = [];

  return async (event, fighterId) => {
    const fighter = await getFighterInfo(fighterId);
    const [playerOne, playerTwo] = selectedFighters;
    const firstFighter = playerOne ?? fighter;
    const secondFighter = Boolean(playerOne) ? playerTwo ?? fighter : playerTwo;
    selectedFighters = [firstFighter, secondFighter];

    renderSelectedFighters(selectedFighters);
  };
}

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
  // get fighter info from fighterDetailsMap or from service and write it to fighterDetailsMap
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

function createVersusBlock(selectedFighters) {
  const canStartFight = selectedFighters.filter(Boolean).length === 2;
  const onClick = () => startFight(selectedFighters);
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

  fightBtn.addEventListener('click', onClick, false);
  fightBtn.innerText = 'Fight';
  container.append(image, fightBtn);

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