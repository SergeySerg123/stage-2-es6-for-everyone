import { controls } from '../../constants/controls';

let firstFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  fullHealthVal: 0,
  CriticalHitCombinationAvaible: true,
  fighterInfo: null,
  position: 'left'
};

let secondFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  fullHealthVal: 0,
  CriticalHitCombinationAvaible: true,
  fighterInfo: null,
  position: 'right'
};


export async function fight(firstFighter, secondFighter) {
  firstFighterState = {...firstFighterState, fighterInfo: firstFighter, fighterId: firstFighter._id, fullHealthVal: firstFighter.health};
  secondFighterState = {...secondFighterState, fighterInfo: secondFighter, fighterId: secondFighter._id, fullHealthVal: secondFighter.health};

  registerHitsPowerListeners();
  registerBlocksPowerListeners();
  registerPlayerOneCriticalHitCombinationsListeners();
  registerPlayerTwoCriticalHitCombinationsListeners();

  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  let damage = getHitPower(attacker) - getBlockPower(defender);
  return damage < 0 ? 0 : damage;
}

export function getHitPower(fighter) {
  let criticalHitChance = calcChance();
  let hitPower = fighter.attack * criticalHitChance;
  return hitPower;
}

export function getBlockPower(fighter) {
  const isBlock = hasBlock(fighter._id);
  let dodgeChance = calcChance();
  let blockPower = fighter.defense * dodgeChance;
  return isBlock ? blockPower : 0;
}

function getCriticalDamage(attacker) {
  let damage = 2 * getHitPower(attacker);
  return damage;
}

function hasBlock(fighterId) {
  const states = [firstFighterState, secondFighterState];
  const fighterState = states.find(f => f.fighterId === fighterId);
  return fighterState.isProtected;
}

function calcChance() {
  return Math.random() + 1;
}

function registerHitsPowerListeners() {
  window.addEventListener('keydown', (event) => {
  let damage = 0;
    switch(event.code){
      case controls.PlayerOneAttack:
        damage = getDamage(firstFighterState.fighterInfo, secondFighterState.fighterInfo);
        secondFighterState.fighterInfo.health -= damage;  
        updateHealthBar(secondFighterState);    
        break;

      case controls.PlayerTwoAttack:
        damage = getDamage(secondFighterState.fighterInfo, firstFighterState.fighterInfo);
        firstFighterState.fighterInfo.health -= damage;
        updateHealthBar(firstFighterState);  
        break;
    }
  });
}

function registerBlocksPowerListeners() {

  window.addEventListener('keydown', (event) => {

    switch(event.code){

      case controls.PlayerOneBlock:
        if (!firstFighterState.isProtected) {
          firstFighterState.isProtected = true;
        }        
        break;

      case controls.PlayerTwoBlock:
        if (!secondFighterState.isProtected) {
          secondFighterState.isProtected = true;
        }  
        break;
    }
  });

  window.addEventListener('keyup', (event) => {

    switch(event.code){

      case controls.PlayerOneBlock:
        if(firstFighterState.isProtected) {
          firstFighterState.isProtected = false;
          console.log('firstFighterState: NON-BLOCK');
        }
        break;

      case controls.PlayerTwoBlock:
        if(secondFighterState.isProtected) {
          secondFighterState.isProtected = false;
          console.log('secondFighterState: NON-BLOCK');
        }
        secondFighterState.isProtected = false;
        break;
    }
  });
}

function registerPlayerOneCriticalHitCombinationsListeners() {
  let [KeyQ, KeyW, KeyE] = controls.PlayerOneCriticalHitCombination;

  let criticalCombination = new Set();
  let damage = 0;

  window.addEventListener('keydown', (event) => {   
    switch (event.code) {
      case KeyQ:
        if (firstFighterState.CriticalHitCombinationAvaible)
          criticalCombination.add(KeyQ);
        break;
      case KeyW:
        if (firstFighterState.CriticalHitCombinationAvaible)  
          criticalCombination.add(KeyW);
        break;
      case KeyE:
        if (firstFighterState.CriticalHitCombinationAvaible)
          criticalCombination.add(KeyE);
        break;
    }
    
    if (criticalCombination.size === controls.PlayerOneCriticalHitCombination.length) {
      damage = getCriticalDamage(firstFighterState.fighterInfo);
      secondFighterState.fighterInfo.health -= damage; 
      updateHealthBar(secondFighterState);
      disableCriticalHitCombination(firstFighterState);
      criticalCombination.clear();
    } 
  });

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case KeyQ:
        criticalCombination.delete(KeyQ);
        break;
      case KeyW:
        criticalCombination.delete(KeyW);
        break;
      case KeyE:
        criticalCombination.delete(KeyE);
        break;
    } 
  });
}

function registerPlayerTwoCriticalHitCombinationsListeners() {
  let [KeyU, KeyI, KeyO] = controls.PlayerTwoCriticalHitCombination;

  let criticalCombination = new Set();
  let damage = 0;

  window.addEventListener('keydown', (event) => {   
    switch (event.code) {
      case KeyU:
        if (secondFighterState.CriticalHitCombinationAvaible)
          criticalCombination.add(KeyU);
        break;
      case KeyI:
        if (secondFighterState.CriticalHitCombinationAvaible)  
          criticalCombination.add(KeyI);
        break;
      case KeyO:
        if (secondFighterState.CriticalHitCombinationAvaible)
          criticalCombination.add(KeyO);
        break;
    }
    
    if (criticalCombination.size === controls.PlayerTwoCriticalHitCombination.length) {
      damage = getCriticalDamage(secondFighterState.fighterInfo);
      firstFighterState.fighterInfo.health -= damage; 
      updateHealthBar(firstFighterState);
      disableCriticalHitCombination(secondFighterState);
      criticalCombination.clear();
    } 
  });

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case KeyU:
        criticalCombination.delete(KeyU);
        break;
      case KeyI:
        criticalCombination.delete(KeyI);
        break;
      case KeyO:
        criticalCombination.delete(KeyO);
        break;
    } 
  });
}

function updateHealthBar(fighterState) {
  let {position} = fighterState;
  let healthBar = document.getElementById(`${position}-fighter-indicator`);

  let fullHealthVal = fighterState.fullHealthVal;
  let restHealth = fighterState.fighterInfo.health;

  let result = (100 * restHealth) / fullHealthVal;

  healthBar.style.width = result <= 0 ? '0%' : `${result}%`;
}

function disableCriticalHitCombination(fighterState) {
  fighterState.CriticalHitCombinationAvaible = false;
  setTimeout(() => {
    fighterState.CriticalHitCombinationAvaible = true;
  }, 10000);
}