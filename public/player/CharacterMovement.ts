import * as pc from 'playcanvas';
import { MOVEMENT_CONFIG, createInitialState, initializeComponents } from './CharacterMovementSetup';
import { setupEventListeners } from './CharacterEventHandlers';

export function createMovementHandler(
    app: pc.Application,
    cameraEntity: pc.Entity,
    characterEntity: pc.Entity,
    keyboard: pc.Keyboard,
    assets: any,
    crosshairEntity: pc.Entity,
    playerStateMachine: any
) {
    const state = createInitialState();
    const charMovement = new pc.Vec3();

    // Initialize components
    initializeComponents(characterEntity, assets);

    // Setup event listeners
    const cleanup = setupEventListeners(
        app,
        state,
        cameraEntity,
        characterEntity,
        keyboard,
        playerStateMachine,
        crosshairEntity
    );

    function handleKeyboardInput(dt: number) {
        let isMoving = false;
        charMovement.set(0, 0, 0);

        if (keyboard.isPressed(pc.KEY_W)) {
            charMovement.z += MOVEMENT_CONFIG.CHAR_SPEED * dt;
            isMoving = true;
        }
        if (keyboard.isPressed(pc.KEY_S)) {
            charMovement.z -= MOVEMENT_CONFIG.CHAR_SPEED * dt;
            isMoving = true;
        }
        if (keyboard.isPressed(pc.KEY_A)) {
            charMovement.x += MOVEMENT_CONFIG.CHAR_SPEED * dt;
            isMoving = true;
        }
        if (keyboard.isPressed(pc.KEY_D)) {
            charMovement.x -= MOVEMENT_CONFIG.CHAR_SPEED * dt;
            isMoving = true;
        }

        if (isMoving) {
            if (playerStateMachine.getCurrentState() === "idle") {
                characterEntity.animation?.play(assets.running.name, 0.2);
                playerStateMachine.changeState("running");
            }
        } else {
            if (playerStateMachine.getCurrentState() === "running") {
                characterEntity.animation?.play(assets.idle.name, 0.2);
                playerStateMachine.changeState("idle");
            }
        }

        if (state.isAiming) {
            if (isMoving) {
                playerStateMachine.changeState("runningshooting");
            } else {
                playerStateMachine.changeState("rifleaim");
            }
        }
    }

    function updateCameraPosition() {
        const charPosition = characterEntity.getPosition();
        const cameraOffset = new pc.Vec3().copy(MOVEMENT_CONFIG.CAMERA_OFFSET);
        const cameraQuat = new pc.Quat().setFromEulerAngles(0, MOVEMENT_CONFIG.cameraYaw, 0);
        cameraQuat.transformVector(cameraOffset, cameraOffset);
        const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset);
        cameraEntity.setPosition(cameraPosition);
        const lookAtPoint = new pc.Vec3().add2(charPosition, new pc.Vec3(0, 1.7, 0));
        cameraEntity.lookAt(lookAtPoint);
    }

    function updateCrosshairPosition() {
        const characterForward = characterEntity.forward;
        const characterRight = characterEntity.right;
        const characterUp = characterEntity.up;
        const forwardOffset = new pc.Vec3().copy(characterForward).mulScalar(MOVEMENT_CONFIG.CROSSHAIR_DISTANCE);
        const sideOffset = new pc.Vec3().copy(characterRight).mulScalar(-0.5);
        const upOffset = new pc.Vec3().copy(characterUp).mulScalar(1.5);
        const crosshairPosition = new pc.Vec3()
            .add2(characterEntity.getPosition(), forwardOffset)
            .add(sideOffset)
            .add(upOffset);
        crosshairEntity.setPosition(crosshairPosition);
        crosshairEntity.lookAt(cameraEntity.getPosition());
        crosshairEntity.rotateLocal(90, 0, 90);
    }

    function applyMovementAndRotation() {
        if (charMovement.lengthSq() > 0) {
            characterEntity.rigidbody?.applyImpulse(
                charMovement.mulScalar(characterEntity.rigidbody.mass)
            );
            const angle = Math.atan2(charMovement.x, charMovement.z);
            characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
        }
    }

    return {
        update: function(dt: number) {
            handleKeyboardInput(dt);
            updateCameraPosition();
            applyMovementAndRotation();
            updateCrosshairPosition();
        },
        cleanup
    };
}