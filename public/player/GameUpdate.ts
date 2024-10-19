import * as pc from 'playcanvas';
import { handleMovement } from './Movement';

export function updateGame(app, characterEntity, cameraEntity, playerStateMachine, crosshairEntity, dt) {
    handleMovement(characterEntity, app.keyboard, cameraEntity.getEulerAngles().y, dt);

    updateCamera(cameraEntity, characterEntity);

    updatePlayerState(playerStateMachine, app.keyboard);
}

function updatePlayerState(playerStateMachine, keyboard) {
    const isMoving = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
    
    if (isMoving && playerStateMachine.getCurrentState() === "idle") {
        playerStateMachine.changeState("running");
    } else if (!isMoving && playerStateMachine.getCurrentState() === "running") {
        playerStateMachine.changeState("idle");
    }
}

function updateCamera(cameraEntity, characterEntity) {
    const cameraOffset = new pc.Vec3(0, 2, -3);
    const cameraQuat = new pc.Quat().setFromEulerAngles(0, cameraEntity.getEulerAngles().y, 0);
    
    cameraQuat.transformVector(cameraOffset, cameraOffset);

    const cameraPosition = new pc.Vec3().add2(characterEntity.getPosition(), cameraOffset);
    cameraEntity.setPosition(cameraPosition);

    const lookAtPoint = new pc.Vec3().add2(characterEntity.getPosition(), new pc.Vec3(0, 1.7, 0));
    cameraEntity.lookAt(lookAtPoint);
}
