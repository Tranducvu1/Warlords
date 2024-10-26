import * as pc from 'playcanvas';
import { MovementState, MOVEMENT_CONFIG } from './CharacterMovementSetup';
import { EnemyEntity } from '../zombie/EnemyEntity';

/**
 * Sets up events related to character control,
 * including handling mouse and keyboard inputs, as well as conditions
 * related to the character and camera states.
 *
 * @param {pc.Application} app - The current PlayCanvas application object.
 * @param {MovementState} state - The movement state of the character.
 * @param {pc.Entity} cameraEntity - The camera entity in the game.
 * @param {pc.Entity} characterEntity - The character entity in the game.
 * @param {pc.Keyboard} keyboard - The keyboard object to track key presses.
 * @param {any} playerStateMachine - The state machine managing the character's states.
 * @param {pc.Entity} crosshairEntity - The entity displaying the crosshair.
 * @returns {Function} - A cleanup function for the events when no longer needed.
 */
export function setupEventListeners(
    app: pc.Application,
    state: MovementState,
    cameraEntity: pc.Entity,
    characterEntity: pc.Entity,
    keyboard: pc.Keyboard,
    playerStateMachine: any,
    crosshairEntity: pc.Entity
) {
    let isMouseDown = false; // Variable to check mouse state

    // Function to handle changes in pointer lock state
    const handlePointerLockChange = () => {
        state.isPointerLocked = document.pointerLockElement === app.graphicsDevice.canvas;
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange, false);

    // Adjust camera position to be closer and lower
    const adjustCameraPosition = () => {
        const cameraPos = cameraEntity.getLocalPosition();

        // Adjust camera height and distance
        cameraPos.y = 2.5; // Lower height
        cameraPos.z = -4.5; // Bring camera closer to the character

        cameraEntity.setLocalPosition(cameraPos); // Set the new position for the camera
    };

    // Apply camera position adjustment
    adjustCameraPosition();

    // Calculate shooting direction from the crosshair
    const calculateShootingDirection = () => {
        const crosshairPosition = crosshairEntity.getPosition();
        const cameraPosition = cameraEntity.getPosition();

        // Create a direction vector from the camera to the crosshair
        const direction = new pc.Vec3();
        direction.sub2(crosshairPosition, cameraPosition); // Calculate the direction vector
        direction.normalize(); // Normalize the direction vector

        return direction; // Return the direction vector
    };

    // Handle mouse down events
    const handleMouseDown = (event: any) => {
        if (isMouseDown) return; // Do nothing if the mouse is already down
        isMouseDown = true; // Mark that the mouse is down
        console.log('Mouse down');

        // Check pointer lock status and request it if necessary
        if (!state.isPointerLocked) {
            app.graphicsDevice.canvas.requestPointerLock();
            return;
        }

        // Check conditions to perform shooting action
        if (state.isAiming && !state.isShooting && !state.hasDealtDamage) {
            const currentTime = Date.now();
            if (currentTime - state.lastShotTime < state.shootingCooldown) {
                return; // If cooldown time remains, do not shoot
            }

            state.isShooting = true; // Mark shooting state
            state.lastShotTime = currentTime; // Update shot time
            playerStateMachine.changeState("shooting"); // Change state to "shooting"

            // Use the crosshair position as the starting point for the raycast
            const from = crosshairEntity.getPosition();
            const shootingDirection = calculateShootingDirection();
            const to = new pc.Vec3().add2(
                from, 
                shootingDirection.mulScalar(MOVEMENT_CONFIG.RAYCAST_DISTANCE) // Calculate raycast endpoint
            );

            // Perform raycast
            const result = app.systems.rigidbody?.raycastFirst(from, to);

            // Check if it collided with any object
            if (result && result.entity) {
                if (result.entity.tags.has("enemy")) { // Check if the object is an enemy
                    console.log("Hit enemy from crosshair");
                    if (result.entity instanceof EnemyEntity) {
                        result.entity.takeDamage(10); // Call function to deal damage to the enemy
                        state.hasDealtDamage = true; // Mark that damage has been dealt

                        // Optional: Add visual feedback for hitting
                        // Particle effects or hit markers can be added here
                    }
                }
            }

            // Optional: Add visual feedback for shooting
            // Fire effects or bullet trails can be added here
        }

        // Mark that the mouse is dragging
        state.isDragging = true;
        state.lastMouseX = event.x; // Update current mouse x coordinate
        state.lastMouseY = event.y; // Update current mouse y coordinate
    };

    // Handle mouse up events
    const handleMouseUp = () => {
        console.log('Mouse up');
        isMouseDown = false; // Mark that the mouse is no longer down

        if (state.isShooting) {
            state.isShooting = false; // End shooting state
            state.hasDealtDamage = false; // Mark that no damage has been dealt

            // Change state based on whether aiming or not
            if (state.isAiming) {
                playerStateMachine.changeState("rifleaim");
            } else {
                playerStateMachine.changeState("idle");
            }
        }

        state.isDragging = false; // Mark that dragging is no longer happening
    };

    // Handle mouse movement events
    const handleMouseMove = (event: any) => {
        if (state.isPointerLocked) { // Check if the pointer is locked
            const dx = event.dx; // Calculate change in x coordinate
            const dy = event.dy; // Calculate change in y coordinate
            if (dx !== 0 || dy !== 0) { // If there's a change
                MOVEMENT_CONFIG.cameraYaw += dx * MOVEMENT_CONFIG.CAMERA_SENSITIVITY; // Update camera yaw
                state.cameraPitch = pc.math.clamp( // Update camera pitch with clamping
                    state.cameraPitch + dy * MOVEMENT_CONFIG.CAMERA_SENSITIVITY,
                    -MOVEMENT_CONFIG.MAX_CAMERA_PITCH,
                    MOVEMENT_CONFIG.MAX_CAMERA_PITCH
                );
                characterEntity.setEulerAngles(0, MOVEMENT_CONFIG.cameraYaw, 0); // Update rotation angle for character
            }
        }
    };

    // Handle key down events
    const handleKeyDown = (event: any) => {
        if (event.key === pc.KEY_Q) {
            state.isAiming = true; // Mark aiming state
            const currentState = playerStateMachine.getCurrentState();
            // Change state based on current state
            playerStateMachine.changeState(
                currentState === "running" ? "runningshooting" : "rifleaim"
            );
        }
    };

    // Handle key up events
    const handleKeyUp = (event: any) => {
        if (event.key === pc.KEY_Q) {
            state.isAiming = false; // Mark not aiming
            const currentState = playerStateMachine.getCurrentState();
            // Change state based on current state
            playerStateMachine.changeState(
                currentState === "runningshooting" ? "running" : "idle"
            );
        }
    };

    // Register mouse events
    if (app.mouse) {
        app.mouse.on(pc.EVENT_MOUSEDOWN, handleMouseDown);
        app.mouse.on(pc.EVENT_MOUSEUP, handleMouseUp);
        app.mouse.on(pc.EVENT_MOUSEMOVE, handleMouseMove);
    }

    // Register keyboard events
    keyboard.on(pc.EVENT_KEYDOWN, handleKeyDown);
    keyboard.on(pc.EVENT_KEYUP, handleKeyUp);

    // Return a cleanup function when no longer needed
    return () => {
        document.removeEventListener('pointerlockchange', handlePointerLockChange);
        if (app.mouse) {
            app.mouse.off(pc.EVENT_MOUSEDOWN, handleMouseDown);
            app.mouse.off(pc.EVENT_MOUSEUP, handleMouseUp);
            app.mouse.off(pc.EVENT_MOUSEMOVE, handleMouseMove);
        }
        keyboard.off(pc.EVENT_KEYDOWN, handleKeyDown);
        keyboard.off(pc.EVENT_KEYUP, handleKeyUp);
    };
}
