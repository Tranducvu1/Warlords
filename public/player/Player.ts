import * as pc from 'playcanvas';
import { handleWeapon } from '../Weapon/Weapon';
import { handleMovement } from './Movement';
import { createplayerstateMachine } from './playerstateMachine';
import { initializeCharacterEntity } from './EntityInitializer';
import { setupRaycasting } from './raycasting';
import { initializeCrosshairEntity } from './crosshair';

// Create player
export function createPlayer(app, assets, cameraEntity: pc.Entity) {
    const characterEntity = initializeCharacterEntity(app, assets);
    const crosshairEntity = initializeCrosshairEntity(app, assets);
    // Get the skinInstance from the character model
    handleWeapon(characterEntity, assets, app);

    // Add animation component
    characterEntity.addComponent("animation", {
        assets: [assets.idle, assets.running, assets.shooting, assets.rifleaim]
    });
    let currentAnim = assets.idle.name;
    // Create state machine for character
    const playerStateMachine = createplayerstateMachine(characterEntity, assets);
    // Set up character keyboard
    const charMovement = new pc.Vec3();
    const keyboard = new pc.Keyboard(document.body);
    // Variables for mouse movement
    let isDragging = false;
    let cameraYaw = 0;
    let cameraPitch = 15; // Pitch camera slightly down
    let lastMouseX = 0;
    let lastMouseY = 0;
    const sensitivity = 0.2;
    let isShooting = false; // Track shooting state
    let isPointerLocked = false;
    let isAiming = false;

    // Pointer lock change event
    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === app.graphicsDevice.canvas;
    }, false);

    // Mouse down event to request pointer lock
    app.mouse.on(pc.EVENT_MOUSEDOWN, () => {
        if (!isPointerLocked) {
            app.graphicsDevice.canvas.requestPointerLock();
        }
    });

    // Mouse down event to start shooting
    if (app.mouse) {
        app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
            if (!isPointerLocked) {
                app.graphicsDevice.canvas.requestPointerLock();
            }

            if (["idle", "rifleaim", "shooting"].includes(playerStateMachine.getCurrentState()) && !isShooting) {
                playerStateMachine.changeState("shooting");
                isShooting = true;

                const crosshairPosition = crosshairEntity.getPosition();
                const crosshairForward = crosshairEntity.forward.clone();
                const distance = 100; // Raycast length
                const rayEnd = new pc.Vec3().add2(crosshairPosition, crosshairForward.mulScalar(distance));

                if (characterEntity.rigidbody) {
                    console.log("Rigidbody system is available.");
                    return;
                }
                if (characterEntity.collision) {
                    console.log("Collision system is available.");
                    return;
                }

                // Activate raycast
                const result = app.systems.rigidbody.raycastFirst(crosshairPosition, rayEnd);
                console.log(result.entity.tags.list);

                // Check raycast for enemy tag
                setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets);
            }
        });


      

        // Mouse up event to stop shooting
        app.mouse.on(pc.EVENT_MOUSEUP, () => {
            if (isShooting && playerStateMachine.getCurrentState() === "shooting") {
                const newState = currentAnim === playerStateMachine.getCurrentState() ? "rifleaim" : "idle";
                playerStateMachine.changeState(newState);
                isShooting = false;
            }
        });

       

        
        // Mouse move event to rotate the camera when dragging
        app.mouse.on(pc.EVENT_MOUSEMOVE, (event) => {
            if (isPointerLocked) {
                const dx = event.dx;
                const dy = event.dy;

                // Update yaw and pitch for camera
                cameraYaw -= dx * sensitivity;
                cameraPitch -= dy * sensitivity;

                // Clamp pitch
                cameraPitch = pc.math.clamp(cameraPitch, -45, 45);

                // Update camera
                updateCameraRotation(cameraYaw, cameraPitch);
            }
        });
    }

    function updateCameraRotation(yaw: number, pitch: number) {
        cameraEntity.setEulerAngles(pitch, yaw, 0);
    }

    // Mouse down event to start dragging
    app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
        isDragging = true;
        lastMouseX = event.x;
        lastMouseY = event.y;
    });

    // Mouse up event to stop dragging
    app.mouse?.on(pc.EVENT_MOUSEUP, () => {
        isDragging = false;
    });

    // Keyboard event for aiming
    keyboard.on(pc.EVENT_KEYDOWN, (event) => {
        if (event.key === pc.KEY_Q) {
            playerStateMachine.changeState("rifleaim");
           
        }
    });

    keyboard.on(pc.EVENT_KEYUP, (event) => {
        if (event.key === pc.KEY_Q && playerStateMachine.getCurrentState() === "rifleaim") {
            playerStateMachine.changeState("idle");
          
        }
    });

    

    app.on("update", (dt) => {
       // Đăng ký sự kiện va chạm
    characterEntity.rigidbody?.on('collisionstart', (event) => {
        console.log("Collision start");

        // Duyệt qua tất cả các đối tượng va chạm
        event.contacts.forEach(contact => {
            const otherEntity = contact.other; // Đối tượng va chạm
            if (otherEntity && otherEntity.name) { // Kiểm tra nếu đối tượng không phải là undefined và có thuộc tính name
                console.log("Va chạm với:", otherEntity.name);
            } else {
                console.warn("Đối tượng không hợp lệ:", otherEntity);
            }
        });
    });

        
        // Call movement
        handleMovement(characterEntity, keyboard, cameraYaw, dt);
        const charPosition = characterEntity.getPosition();

        // Set up camera position
        let cameraOffset = new pc.Vec3(0, 2, -3);
        const cameraQuat = new pc.Quat().setFromEulerAngles(0, cameraYaw, 0);
        cameraQuat.transformVector(cameraOffset, cameraOffset);

        const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset);
        cameraEntity.setPosition(cameraPosition);

        const lookAtPoint = new pc.Vec3().add2(charPosition, new pc.Vec3(0, 1.7, 0));
        cameraEntity.lookAt(lookAtPoint);

        if (charMovement.length() > 0) {
            const angle = Math.atan2(charMovement.x, charMovement.z);
            characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
        }

        // Update animation state
        const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
        if (moved && playerStateMachine.getCurrentState() === "idle") {
            playerStateMachine.changeState("running");
        } else if (!moved && playerStateMachine.getCurrentState() === "running") {
            playerStateMachine.changeState("idle");
        }

        // Crosshair positioning
        const characterForward = characterEntity.forward;
        const characterRight = characterEntity.right;
        const characterUp = characterEntity.up;
        const crosshairDistance = -2;

        const forwardOffset = new pc.Vec3().copy(characterForward).mulScalar(crosshairDistance);
        const sideOffset = new pc.Vec3().copy(characterRight).mulScalar(-0.5);
        const upOffset = new pc.Vec3().copy(characterUp).mulScalar(1.5);

        const crosshairPosition = new pc.Vec3()
            .add2(characterEntity.getPosition(), forwardOffset)
            .add(sideOffset)
            .add(upOffset);
        crosshairEntity.setPosition(crosshairPosition);

        // Make the crosshair face the camera
        crosshairEntity.lookAt(cameraEntity.getPosition());
        crosshairEntity.rotateLocal(90, 0, 90);
    });
    console.log('Character Entity:', characterEntity); 
    return characterEntity;
}
