import * as pc from 'playcanvas';
import { stateMachine } from '../Utils/StateMachine';

/**
 * Creates a player state machine to manage character animations.
 * 
 * @param {pc.Entity} characterEntity - The character entity to apply animations to.
 * @param {Record<string, pc.Asset>} assets - The assets containing the animation clips.
 * @returns {stateMachine} The created player state machine.
 */
export function createplayerstateMachine(characterEntity: pc.Entity, assets: Record<string, pc.Asset>) {
    // Initialize the player state machine with the default state "idle"
    const playerStateMachine = new stateMachine("idle");

    // Add the "idle" state to the state machine
    playerStateMachine.addState("idle", () => {
        // Play the idle animation at a speed of 0.2
        characterEntity.animation?.play(assets.idle.name, 0.2);
    });

    // Add the "running" state to the state machine
    playerStateMachine.addState("running", () => {
        // Play the running animation at a speed of 0.2
        characterEntity.animation?.play(assets.running.name, 0.2);
    });

    // Add the "shooting" state to the state machine
    playerStateMachine.addState("shooting", () => {
        // Play the shooting animation at a speed of 0.2
        characterEntity.animation?.play(assets.shooting.name, 0.2);
    });

    // Add the "rifleaim" state to the state machine
    playerStateMachine.addState("rifleaim", () => {
        // Play the rifle aim animation at a speed of 0.2
        characterEntity.animation?.play(assets.rifleaim.name, 0.2);
    });

    // Add the "runningshooting" state to the state machine
    playerStateMachine.addState("runningshooting", () => {
        // Play the running and shooting animation at a speed of 0.2
        characterEntity.animation?.play(assets.runningshooting.name, 0.2);
    });

    //add the "reload" state to the state machine
    playerStateMachine.addState("reloading", () => {
        // Play the reload animation at a speed of 0.2
        console.log("đang reloading");
        characterEntity.animation?.play(assets.reloading.name, 0.2);
    });

    // Return the constructed player state machine for use
    return playerStateMachine;
}
