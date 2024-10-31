import * as pc from 'playcanvas';
import { MOVEMENT_CONFIG, createInitialState, initializeComponents } from './CharacterMovementSetup';
import { setupEventListeners } from './CharacterEventHandlers';
/**
 * Creates a movement handler for the character in the game.
 *
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {pc.Entity} cameraEntity - The camera entity to follow the character.
 * @param {pc.Entity} characterEntity - The character entity controlled by the player.
 * @param {pc.Keyboard} keyboard - The keyboard input for controlling the character.
 * @param {any} assets - The assets required for animations.
 * @param {pc.Entity} crosshairEntity - The entity representing the crosshair.
 * @param {any} playerStateMachine - The state machine managing the player's states.
 * @returns {Object} An object containing the update function and cleanup function.
 */
export function createMovementHandler(
    app: pc.Application,
    cameraEntity: pc.Entity,
    characterEntity: pc.Entity,
    keyboard: pc.Keyboard,
    assets: any,
    crosshairEntity: pc.Entity,
    playerStateMachine: any,
) {
    const state = createInitialState(); // Initialize character state
    const charMovement = new pc.Vec3(); // Vector for character movement
    

    // Initialize components for the character
    initializeComponents(characterEntity, assets);

    // Setup event listeners for handling input and events
    const cleanup = setupEventListeners(
        app,
        state,
        cameraEntity,
        characterEntity,
        keyboard,
        playerStateMachine,
        crosshairEntity,
        
    );
    /**
     * Handles keyboard input to control character movement and states.
     *
     * @param {number} dt - The delta time for frame updates.
     */
    /**
 * Handles keyboard input to control character movement and states.
 *
 * @param {number} dt - The delta time for frame updates.
 */
function handleKeyboardInput(dt) {
    let isMoving = false; // Flag to check if the character is moving
    charMovement.set(0, 0, 0); // Reset movement vector

    // Variables for directional movement
    let forward = 0;
    let right = 0;

    // Check for movement input from WASD
    if (keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_UP)) {
        forward += 1; // Move forward
    }
    if (keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_DOWN)) {
        forward -= 1; // Move backward
    }
    if (keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_LEFT)) {
        right += 1; // Move left
    }
    if (keyboard.isPressed(pc.KEY_D) || keyboard.isPressed(pc.KEY_RIGHT)) {
        right -= 1; // Move right
    }

    // Normalize diagonal movement
    if (forward !== 0 || right !== 0) {
        let magnitude = Math.sqrt(forward * forward + right * right);
        forward /= magnitude;
        right /= magnitude;
    }

    // Update character movement based on direction
    charMovement.x += right * MOVEMENT_CONFIG.CHAR_SPEED * dt; // Update x direction
    charMovement.z += forward * MOVEMENT_CONFIG.CHAR_SPEED * dt; // Update z direction

    // Update character rotation based on movement direction
    if (forward !== 0 || right !== 0) {
        let angle = Math.atan2(right, forward) * (180 / Math.PI); // Calculate angle in degrees
        updateCharacterRotation(angle); // Update rotation based on direction
        isMoving = true; // Set moving flag
    } else {
        // If not moving, keep character facing the current camera yaw
        updateCharacterRotation(MOVEMENT_CONFIG.cameraYaw);
    }

    // Change character state based on movement and aiming
    if (isMoving) {
        if (playerStateMachine.getCurrentState() === "idle") {
            characterEntity.animation?.play(assets.running.name, 0.2); // Play running animation
            playerStateMachine.changeState("running"); // Change state to running
        }
    } else {
        if (playerStateMachine.getCurrentState() === "running") {
            characterEntity.animation?.play(assets.idle.name, 0.2); // Play idle animation
            playerStateMachine.changeState("idle"); // Change state to idle
        }
    }

    // Update state if the character is aiming
    if (state.isAiming) {
        if (isMoving) {
            playerStateMachine.changeState("runningshooting"); // Change state to running and shooting
        } else {
            playerStateMachine.changeState("rifleaim"); // Change state to rifle aiming
        }
    }
}

    /**
     * Updates the character's rotation based on the given angle.
     *
     * @param {number} angle - The angle to set the character's rotation.
     */
    function updateCharacterRotation(angle) {
        const finalAngle = (state.isAiming || playerStateMachine.getCurrentState() === "idle") 
            ? angle 
            : angle + MOVEMENT_CONFIG.cameraYaw; // Adjust angle based on aiming state
        characterEntity.setEulerAngles(0, finalAngle, 0); // Set character rotation
    }

    /**
     * Updates the camera position based on the character's position.
     */
    function updateCameraPosition() {
        const charPosition = characterEntity.getPosition(); // Get character position
        const cameraOffset = new pc.Vec3().copy(MOVEMENT_CONFIG.CAMERA_OFFSET); // Get camera offset
        const cameraQuat = new pc.Quat().setFromEulerAngles(MOVEMENT_CONFIG.cameraPitch, MOVEMENT_CONFIG.cameraYaw, 0); // Get camera rotation
        cameraQuat.transformVector(cameraOffset, cameraOffset); // Apply rotation to offset
        const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset); // Calculate camera position
        cameraEntity.setPosition(cameraPosition); // Set camera position
        const lookAtPoint = new pc.Vec3().add2(charPosition, new pc.Vec3(0, 1.7, 0)); // Point camera at character
        cameraEntity.lookAt(lookAtPoint); // Make camera look at character
    }

    /**
     * Updates the crosshair position based on the character's orientation.
     */
    function updateCrosshairPosition() {
        const characterForward = characterEntity.forward; // Get forward direction
        const characterRight = characterEntity.right; // Get right direction
        const characterUp = characterEntity.up; // Get up direction
        const forwardOffset = new pc.Vec3().copy(characterForward).mulScalar(MOVEMENT_CONFIG.CROSSHAIR_DISTANCE); // Calculate forward offset
        const sideOffset = new pc.Vec3().copy(characterRight).mulScalar(-0.5); // Calculate side offset
        const upOffset = new pc.Vec3().copy(characterUp).mulScalar(1.5); // Calculate upward offset
        const crosshairPosition = new pc.Vec3()
            .add2(characterEntity.getPosition(), forwardOffset) // Set crosshair position
            .add(sideOffset)
            .add(upOffset);
        crosshairEntity.setPosition(crosshairPosition); // Update crosshair entity position
        crosshairEntity.lookAt(cameraEntity.getPosition()); // Make crosshair look at camera
        crosshairEntity.rotateLocal(90, 0, 90); // Adjust crosshair rotation
    }

    /**
     * Applies movement to the character based on input.
     */
    function applyMovement() {
        if (charMovement.lengthSq() > 0) { // Check if there's movement input
            const movementQuat = new pc.Quat().setFromEulerAngles(0, MOVEMENT_CONFIG.cameraYaw, 0); // Get movement rotation
            const adjustedMovement = movementQuat.transformVector(charMovement, new pc.Vec3()); // Adjust movement based on rotation
            characterEntity.rigidbody?.applyImpulse(
                adjustedMovement.mulScalar(characterEntity.rigidbody.mass) // Apply impulse to the character
            );
        }
    }

    return {
        update: function(dt) {
            handleKeyboardInput(dt); // Handle input every frame
            updateCameraPosition(); // Update camera position
            applyMovement(); // Apply movement based on input
            updateCrosshairPosition(); // Update crosshair position
        },
        cleanup // Return cleanup function for event listeners
    };
}