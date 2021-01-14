import { controls } from '../../constants/controls';

let firstFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  CriticalHitCombinationAvaible: false,
  fighterInfo: null
};

let secondFighterState = {
  fighterId: '',
  isProtected: false,
  criticalHitChance: 0,
  dodgeChance: 0,
  CriticalHitCombinationAvaible: false,
  fighterInfo: null
};


export async function fight(firstFighter, secondFighter) {
  firstFighterState = {...firstFighterState, fighterInfo: firstFighter, fighterId: firstFighter._id};
  secondFighterState = {...secondFighterState, fighterInfo: secondFighter, fighterId: secondFighter._id};

  registerHitPower();
  registerBlockPower();

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

function hasBlock(fighterId) {
  const states = [firstFighterState, secondFighterState];
  const fighterState = states.find(f => f.fighterId === fighterId);
  return fighterState.isProtected;
}

function calcChance() {
  return Math.random() + 1;
}

function registerHitPower() {
  window.addEventListener('keydown', (event) => {

    switch(event.code){
      case controls.PlayerOneAttack:
        let damage = getDamage(firstFighterState.fighterInfo, secondFighterState.fighterInfo);
        console.log(damage);
        secondFighterState.fighterInfo.health -= damage;
        console.log(secondFighterState.fighterInfo.health);       
        break;

      case controls.PlayerTwoAttack:
        getDamage(secondFighterState.fighterInfo, firstFighterState.fighterInfo);
        // if (!secondFighterState.isProtected) {
        //   secondFighterState.isProtected = true;
        //   console.log('secondFighterState: BLOCK');
        // }  
        break;
    }
  });
}

function registerBlockPower() {

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