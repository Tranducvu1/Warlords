import * as pc from 'playcanvas';
import { stateMachine } from '../Utils/StateMachine';

/**
 * Creates and initializes the zombie state machine for controlling zombie animations.
 * 
 * @param EnemyEntity - The zombie entity to which the state machine will be attached.
 * @param assets - A record of assets used for the zombie animations.
 * @returns A state machine for managing zombie states.
 */
export function createZombieStateMachine(EnemyEntity: pc.Entity, assets: Record<string, pc.Asset>): stateMachine {
    const zombieStateMachine = new stateMachine("zombieidle");

    // Idle state: plays the idle animation
    zombieStateMachine.addState("zombieidle", () => {
        EnemyEntity.animation?.play(assets.zombieIdle.name, 0.2);
    });

    // Running state: plays the running animation
    zombieStateMachine.addState("zombierunning", () => {
        EnemyEntity.animation?.play(assets.zombierunning.name, 0.2);
    });

    // Attack state: plays the attack animation
    zombieStateMachine.addState("zombieattack", () => {
        EnemyEntity.animation?.play(assets.zombieattack.name, 0.2);
    });

    // Damage state: plays the hit animation
    zombieStateMachine.addState("zombiedamage", () => {
        EnemyEntity.animation?.play(assets.zombiedamage.name, 0.2); // Animation khi bị trúng đòn
    });

    // Death state: plays the death animation
    zombieStateMachine.addState("zombiedeath", () => {
        EnemyEntity.animation?.play(assets.zombiedeath.name, 0.2);
    });

    return zombieStateMachine; // Return the initialized state machine
}
