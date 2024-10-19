import * as pc from 'playcanvas'
import { stateMachine } from '../Utils/StateMachine';

export function createplayerstateMachine(characterEntity: pc.Entity, assets: Record<string, pc.Asset>) {
      const playerStateMachine = new stateMachine("idle");

        // Add state to state machine
        playerStateMachine.addState("idle", () => {
            characterEntity.animation?.play(assets.idle.name, 0.2);

        });

        playerStateMachine.addState("running", () => {
            characterEntity.animation?.play(assets.running.name, 0.2);
        });

        playerStateMachine.addState("shooting", () => {
            characterEntity.animation?.play(assets.shooting.name, 0.2);
        });

        playerStateMachine.addState("rifleaim", () => {
            characterEntity.animation?.play(assets.rifleaim.name, 0.2);
        });

        return playerStateMachine;

}