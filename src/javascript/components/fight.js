import { controls } from '../../constants/controls';

let firstFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  CriticalHitCombinationAvaible: true,
  fighterInfo: null
};

let secondFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  CriticalHitCombinationAvaible: true,
  fighterInfo: null
};


export async function fight(firstFighter, secondFighter) {
  firstFighterState = {...firstFighterState, fighterInfo: firstFighter, fighterId: firstFighter._id};
  secondFighterState = {...secondFighterState, fighterInfo: secondFighter, fighterId: secondFighter._id};

  registerHitsPower();
  registerBlocksPower();
  registerPlayerOneCriticalHitCombinations();
  registerPlayerTwoCriticalHitCombinations();

  console.log(firstFighterState, secondFighterState);
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

function registerHitsPower() {
  window.addEventListener('keydown', (event) => {
  let damage = 0;
    switch(event.code){
      case controls.PlayerOneAttack:
        damage = getDamage(firstFighterState.fighterInfo, secondFighterState.fighterInfo);
        secondFighterState.fighterInfo.health -= damage;      
        break;

      case controls.PlayerTwoAttack:
        damage = getDamage(secondFighterState.fighterInfo, firstFighterState.fighterInfo);
        firstFighterState.fighterInfo.health -= damage;  
        break;
    }
  });
}

function registerBlocksPower() {

  window.addEventListener('keydown', (event) => {

    switch(event.code){

      case controls.PlayerOneBlock:
        if (!firstFighterState.isProtected) {
          firstFighterState.isProtected = true;
          console.log('firstFighterState: BLOCK');
        }        
        break;

      case controls.PlayerTwoBlock:
        if (!secondFighterState.isProtected) {
          secondFighterState.isProtected = true;
          console.log('secondFighterState: BLOCK');
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

function registerPlayerOneCriticalHitCombinations() {
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

function registerPlayerTwoCriticalHitCombinations() {
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

function disableCriticalHitCombination(fighterState) {
  fighterState.CriticalHitCombinationAvaible = false;
  setTimeout(() => {
    fighterState.CriticalHitCombinationAvaible = true;
  }, 10000);
}