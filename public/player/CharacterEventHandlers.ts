// CharacterEventHandlers.ts
import * as pc from 'playcanvas';
import { MovementState, MOVEMENT_CONFIG } from './CharacterMovementSetup';
import { EnemyEntity } from '../zombie/EnemyEntity';


export function setupEventListeners(
    app: pc.Application,
    state: MovementState,
    cameraEntity: pc.Entity,
    characterEntity: pc.Entity,
    keyboard: pc.Keyboard,
    playerStateMachine: any,
    crosshairEntity: pc.Entity
) {
    let isMouseDown = false;

    // Pointer lock handler
    const handlePointerLockChange = () => {
        state.isPointerLocked = document.pointerLockElement === app.graphicsDevice.canvas;
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange, false);

    // Calculate shooting direction from crosshair
    const calculateShootingDirection = () => {
        const crosshairPosition = crosshairEntity.getPosition();
        const cameraPosition = cameraEntity.getPosition();
        
        // Create direction vector from camera to crosshair
        const direction = new pc.Vec3();
        direction.sub2(crosshairPosition, cameraPosition);
        direction.normalize();
        
        return direction;
    };

    // Mouse handlers
    const handleMouseDown = (event: any) => {
        if (isMouseDown) return;
        isMouseDown = true;
        console.log('Mouse down');

        if (!state.isPointerLocked) {
            app.graphicsDevice.canvas.requestPointerLock();
            return;
        }

        if (state.isAiming && !state.isShooting && !state.hasDealtDamage) {
            const currentTime = Date.now();
            if (currentTime - state.lastShotTime < state.shootingCooldown) {
                return;
            }

            state.isShooting = true;
            state.lastShotTime = currentTime;
            playerStateMachine.changeState("shooting");

            // Use crosshair position as starting point for raycast
            const from = crosshairEntity.getPosition();
            const shootingDirection = calculateShootingDirection();
            const to = new pc.Vec3().add2(
                from, 
                shootingDirection.mulScalar(MOVEMENT_CONFIG.RAYCAST_DISTANCE)
            );

            // Perform raycast
            const result = app.systems.rigidbody?.raycastFirst(from, to);

            if (result && result.entity) {
                if (result.entity.tags.has("enemy")) {
                    console.log("Hit enemy from crosshair");
                    if (result.entity instanceof EnemyEntity) {
                        result.entity.takeDamage(10);
                        state.hasDealtDamage = true;

                        // Optional: Add visual feedback for hit
                        // You can add particle effects or hit markers here
                    }
                }
            }

            // Optional: Add visual feedback for shooting
            // You can add muzzle flash or bullet trail effects here
        }

        state.isDragging = true;
        state.lastMouseX = event.x;
        state.lastMouseY = event.y;
    };

    const handleMouseUp = () => {
        console.log('Mouse up');
        isMouseDown = false;
        
        if (state.isShooting) {
            state.isShooting = false;
            state.hasDealtDamage = false;
            
            if (state.isAiming) {
                playerStateMachine.changeState("rifleaim");
            } else {
                playerStateMachine.changeState("idle");
            }
        }
        
        state.isDragging = false;
    };

    const handleMouseMove = (event: any) => {
        if (state.isPointerLocked) {
            const dx = event.dx;
            const dy = event.dy;
            if (dx !== 0 || dy !== 0) {
                MOVEMENT_CONFIG.cameraYaw += dx * MOVEMENT_CONFIG.CAMERA_SENSITIVITY;
                state.cameraPitch = pc.math.clamp(
                    state.cameraPitch + dy * MOVEMENT_CONFIG.CAMERA_SENSITIVITY,
                    -MOVEMENT_CONFIG.MAX_CAMERA_PITCH,
                    MOVEMENT_CONFIG.MAX_CAMERA_PITCH
                );
                characterEntity.setEulerAngles(0, MOVEMENT_CONFIG.cameraYaw, 0);
            }
        }
    };

    // Keyboard handlers
    const handleKeyDown = (event: any) => {
        if (event.key === pc.KEY_Q) {
            state.isAiming = true;
            const currentState = playerStateMachine.getCurrentState();
            playerStateMachine.changeState(
                currentState === "running" ? "runningshooting" : "rifleaim"
            );
        }
    };

    const handleKeyUp = (event: any) => {
        if (event.key === pc.KEY_Q) {
            state.isAiming = false;
            const currentState = playerStateMachine.getCurrentState();
            playerStateMachine.changeState(
                currentState === "runningshooting" ? "running" : "idle"
            );
        }
    };

    // Register event listeners
    if (app.mouse) {
        app.mouse.on(pc.EVENT_MOUSEDOWN, handleMouseDown);
        app.mouse.on(pc.EVENT_MOUSEUP, handleMouseUp);
        app.mouse.on(pc.EVENT_MOUSEMOVE, handleMouseMove);
    }

    keyboard.on(pc.EVENT_KEYDOWN, handleKeyDown);
    keyboard.on(pc.EVENT_KEYUP, handleKeyUp);

    // Return cleanup function
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
