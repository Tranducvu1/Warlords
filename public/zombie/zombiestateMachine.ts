// ZombieStateMachine.ts
import * as pc from 'playcanvas';
import { stateMachine } from '../Utils/StateMachine';

export function createZombieStateMachine(EnemyEntity: pc.Entity, assets: Record<string, pc.Asset>): stateMachine {
    const zombieStateMachine = new stateMachine("zombieidle");

    zombieStateMachine.addState("zombieidle", () => {
        EnemyEntity.animation?.play(assets.zombieIdle.name, 0.2);
    });

    zombieStateMachine.addState("zombierunning", () => {
        EnemyEntity.animation?.play(assets.zombierunning.name, 0.2);
    });

    zombieStateMachine.addState("zombieattack", () => {
        EnemyEntity.animation?.play(assets.zombieattack.name, 0.2);  
    });

    
    zombieStateMachine.addState("zombiedeath", () => {
        EnemyEntity.animation?.play(assets.zombiedeath.name, 0.2);
    });

    
    return zombieStateMachine;
}
