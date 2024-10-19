// ZombieStateMachine.ts
import * as pc from 'playcanvas';
import { stateMachine } from '../Utils/StateMachine';

export function createZombieStateMachine(EnemyEntity: pc.Entity, assets: Record<string, pc.Asset>): stateMachine {
    const zombieStateMachine = new stateMachine("idle");

    zombieStateMachine.addState("idle", () => {
        EnemyEntity.animation?.play(assets.zombieIdle.name, 0.2);
    });

    zombieStateMachine.addState("running", () => {
        EnemyEntity.animation?.play(assets.zombierunning.name, 0.2);
    });

    zombieStateMachine.addState("death", () => {
        EnemyEntity.animation?.play(assets.zombieDeath.name, 0.2);
    });

    return zombieStateMachine;
}
