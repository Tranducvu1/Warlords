    import * as pc from 'playcanvas';
    import { MovementState, MOVEMENT_CONFIG, AMMO_CONFIG } from './CharacterMovementSetup';
    import { EnemyEntity } from '../zombie/EnemyEntity';
    import { CharacterEntity } from './characterEntity.ts';
    import { leftnumbervalue as initialLeftNumberValue, leftnumberelement } from '../cowndown.ts';
    /**
     * Sets up event listeners for handling game interactions such as shooting, aiming, reloading, and camera movement.
     * This function handles player input and game state transitions.
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
        let zombiesShotCount = 0; // Tracks the number of zombies shot by the player
        let isMouseDown = false; // Tracks mouse button state to prevent unintended multiple shots.
        let leftnumbervalue = initialLeftNumberValue; // Local copy of the imported valu

        // Initialize shooting sound effect with properties like volume and preload.
        const shootingSound = new Audio('../music/boom.mp3');
        shootingSound.volume = 1.0;
        shootingSound.preload = 'auto';

        // Error handling for audio loading issues.
        shootingSound.addEventListener('error', function(e) {
            console.error('Error loading shooting sound:', e);
        });

        // Pointer lock change handler to manage locked pointer states for immersive controls.
        const handlePointerLockChange = () => {
            state.isPointerLocked = document.pointerLockElement === app.graphicsDevice.canvas;
        };
        document.addEventListener('pointerlockchange', handlePointerLockChange, false);

        // Adjust camera position to maintain a consistent viewpoint relative to the player.
        const adjustCameraPosition = () => {
            const cameraPos = cameraEntity.getLocalPosition();
            cameraPos.y = 2.5;
            cameraPos.z = -4.5;
            cameraEntity.setLocalPosition(cameraPos);
        };
        adjustCameraPosition();

        function showWinScreen() {
            const winOverlay = document.getElementById('winOverlay'); // Get the win overlay element
            if (winOverlay) {
                winOverlay.style.display = 'flex'; // Make the overlay visible on game over
            }
        }

        // Calculates the direction in which the player is shooting, based on crosshair and camera positions.
        const calculateShootingDirection = () => {
            const crosshairPosition = crosshairEntity.getPosition();
            const cameraPosition = cameraEntity.getPosition();
            const direction = new pc.Vec3();
            direction.sub2(crosshairPosition, cameraPosition);
            direction.normalize();
            return direction;
        };

        // Handles ammo reloading, sets a timeout based on reload time, and manages state transitions.
        const reloadAmmo = () => {
            if (state.isReloading) return;

            console.log("Reloading... cannot shoot.");
            state.isReloading = true;
            playerStateMachine.changeState("reloading");

            setTimeout(() => {
                state.currentAmmo = AMMO_CONFIG.MAX_AMMO;
                state.isReloading = false; // Reset reloading state after completion
                console.log("Reload complete!");
                //set bullet after reload 
                leftnumbervalue = 30; // Reset value
                if(leftnumberelement){
                    leftnumberelement.textContent = leftnumbervalue.toString(); // Update display
                }
                // Transition to appropriate idle or aiming state once reload is complete
                if (state.isAiming) {
                    playerStateMachine.changeState("rifleaim");
                } else {
                    playerStateMachine.changeState("idle");
                }
            }, AMMO_CONFIG.RELOAD_TIME);
        };
        // Handles shooting mechanics when the mouse is pressed.
        const handleMouseDown = (event) => {
            if (isMouseDown || state.isReloading) return; // Prevent shooting during reload
            isMouseDown = true;
            // If pointer is not locked, request lock to start aiming.
            if (!state.isPointerLocked) {
                app.graphicsDevice.canvas.requestPointerLock();
                return;
            }
            // Check conditions for shooting: aiming, not currently shooting, ammo available, etc.
            if (state.isAiming && !state.isShooting && !state.hasDealtDamage && state.currentAmmo > 0) {
                const currentTime = Date.now();
                if (currentTime - state.lastShotTime < state.shootingCooldown) return;
                shootingSound.currentTime = 0; // Reset sound to play from start
                shootingSound.play().catch(error => console.error('Error playing sound:', error));
                state.isShooting = true;
                state.lastShotTime = currentTime;
                state.currentAmmo -= 1;
                if (leftnumbervalue > 0) {
                    leftnumbervalue--; // Decrease ammo count
                }
        
                // update bullet
                if (leftnumberelement) {
                    leftnumberelement.textContent = leftnumbervalue.toString(); // Cập nhật hiển thị
                }
                // Trigger reload if out of ammo
                if (state.currentAmmo <= 0) {
                    reloadAmmo(); 
                    return;
                }

                playerStateMachine.changeState("shooting");
                console.log("Shooting...");

                const from = crosshairEntity.getPosition();
                const shootingDirection = calculateShootingDirection();
                const to = new pc.Vec3().add2(from, shootingDirection.mulScalar(MOVEMENT_CONFIG.RAYCAST_DISTANCE));

                // Perform raycasting to detect hit objects, specifically looking for enemies.
                const result = app.systems.rigidbody?.raycastFirst(from, to);
                    ///take damage if tag is enemy
                if (result && result.entity && result.entity.tags.has("enemy")) {
                    console.log("Hit enemy from crosshair");
                    if (result.entity instanceof EnemyEntity) {
                        result.entity.takeDamage(10);
                        state.hasDealtDamage = true;
                        if (result.entity.getHealth() === 0) {
                            const char = characterEntity as CharacterEntity;
                            const newExp = char.getExperience(10);
                            console.log(`Experience gained! New total: ${newExp}`);
                            result.entity.die();
                            if(zombiesShotCount == 6){
                                showWinScreen();
                            }
                        }
                    }
                }
            }

            state.isDragging = true;
            state.lastMouseX = event.x;
            state.lastMouseY = event.y;
        };

        // Handles mouse release to reset shooting and aiming states.
        const handleMouseUp = () => {
            isMouseDown = false;
            if (state.isShooting) {
                state.isShooting = false;
                state.hasDealtDamage = false;

                // Transition to idle or aiming state if not reloading.
                if (!state.isReloading) {
                    playerStateMachine.changeState(state.isAiming ? "rifleaim" : "idle");
                }
            }
            state.isDragging = false;
        };

        // Handles mouse movement for controlling camera angles based on pointer lock.
        const handleMouseMove = (event) => {
            if (state.isReloading) return;  // Skip if reloading
            if (state.isPointerLocked) {
                const dx = event.dx;
                const dy = event.dy;
                
                if (dx !== 0 || dy !== 0) {
                    MOVEMENT_CONFIG.cameraYaw += dx * MOVEMENT_CONFIG.CAMERA_SENSITIVITY;
                    // state.cameraPitch = pc.math.clamp(
                    //     state.cameraPitch + dy * MOVEMENT_CONFIG.CAMERA_SENSITIVITY,
                    //     -MOVEMENT_CONFIG.MAX_CAMERA_PITCH,
                    //     MOVEMENT_CONFIG.MAX_CAMERA_PITCH
                    // );
                    MOVEMENT_CONFIG.cameraPitch = pc.math.clamp(

                        MOVEMENT_CONFIG.cameraPitch + dy * MOVEMENT_CONFIG.CAMERA_SENSITIVITY,
                        -MOVEMENT_CONFIG.MAX_CAMERA_PITCH,
                        MOVEMENT_CONFIG.MAX_CAMERA_PITCH
                    );
                    cameraEntity.setLocalEulerAngles(MOVEMENT_CONFIG.cameraPitch, MOVEMENT_CONFIG.cameraYaw, 0);
                  //  characterEntity.setEulerAngles(0, MOVEMENT_CONFIG.cameraYaw, 0);
                 // characterEntity.setLocalEulerAngles(MOVEMENT_CONFIG.cameraPitch, MOVEMENT_CONFIG.cameraYaw, 0);
                }
            }
        };

        // Handles keyboard down events for toggling aiming and preventing actions during reloading.
        const handleKeyDown = (event) => {
            if (state.isReloading) {
                console.log("Cannot aim while reloading.");
                playerStateMachine.changeState("reloading");
                return; 
            }

            if (event.key === pc.KEY_Q) {
                state.isAiming = true;
                playerStateMachine.changeState(
                    playerStateMachine.getCurrentState() === "shooting" ? "runningshooting" : "rifleaim"
                );
                console.log("Aiming...");
            }
        };

        // Handles keyboard release to reset aiming state and transition to idle.
        const handleKeyUp = (event) => {
            if (event.key === pc.KEY_Q) {
                state.isAiming = false;

                // Only switch to idle if not reloading.
                if (!state.isReloading) {
                    playerStateMachine.changeState("idle");
                    console.log("Stopped aiming...");
                }
            }
        };

        // Attach event listeners for mouse and keyboard interactions.
        if (app.mouse) {
            app.mouse.on(pc.EVENT_MOUSEDOWN, handleMouseDown);
            app.mouse.on(pc.EVENT_MOUSEUP, handleMouseUp);
            app.mouse.on(pc.EVENT_MOUSEMOVE, handleMouseMove);
        }

        keyboard.on(pc.EVENT_KEYDOWN, handleKeyDown);
        keyboard.on(pc.EVENT_KEYUP, handleKeyUp);

        // Returns a function to remove all event listeners, useful for cleanup on exit.
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
