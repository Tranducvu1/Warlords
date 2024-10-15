import * as pc from 'playcanvas';
import { stateMachine } from './StateMachine';

const playerStateMachine = new stateMachine("idle");

export function handleMovement(characterEntity, keyboard, cameraYaw, dt) {
    const charMovement = new pc.Vec3();
    const charSpeed = 5;

    // Handle character movement
    if (keyboard.isPressed(pc.KEY_W)) {
        charMovement.z += charSpeed * dt; 
    }
    if (keyboard.isPressed(pc.KEY_S)) {
        charMovement.z -= charSpeed * dt; 
    }
    if (keyboard.isPressed(pc.KEY_A)) {
        charMovement.x += charSpeed * dt; 
    }
    if (keyboard.isPressed(pc.KEY_D)) {
        charMovement.x -= charSpeed * dt; 
    }

    // Rotate movement direction based on camera yaw
    const movementQuat = new pc.Quat().setFromEulerAngles(0, cameraYaw, 0);
    movementQuat.transformVector(charMovement, charMovement);

    if (charMovement.length() > 0) {
        characterEntity.translate(charMovement);

        // Rotate the character to face the direction of movement
        const angle = Math.atan2(charMovement.x, charMovement.z);
        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);

        if (playerStateMachine.getCurrentState() !== "running") {
            playerStateMachine.changeState("running");
        }
    } else {
        
        if (playerStateMachine.getCurrentState() !== "idle") {
            playerStateMachine.changeState("idle");
        }
    }

    return charMovement;
}
