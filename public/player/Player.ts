import * as pc from 'playcanvas';
import { stateMachine } from './StateMachine';
import { createWeapon } from './Weapon';
import { handleMovement } from './Movement';



declare module 'playcanvas' {
    interface Entity {
        health?: number,
      //  collision?: pc.CollisionComponent;
    }
}
// Create player
export function createPlayer(app, assets, cameraEntity: pc.Entity) {
    const characterEntity = new pc.Entity("character");
    app.root.addChild(characterEntity);
    
    characterEntity.addComponent("model", {
        type: "asset",
        asset: assets.man
    });
    const scale = 0.01;
    characterEntity.setLocalPosition(scale, scale, scale);
    
    characterEntity.addComponent("rigidbody", {
        type: 'dynamic'
    });

    characterEntity.addComponent("collision", {
        type: 'box',
        halfExtents: new pc.Vec3(0.5, 1, 0.5)
    });
    const collisionComponent = characterEntity.collision;
    if (collisionComponent) {
        collisionComponent.on('triggerenter', function (other) {
            console.log('Nhân vật va chạm với:', other.name);
        });
    } else {
        console.warn('Component collision chưa được thêm vào characterEntity');
    }
  //  createAim(characterEntity,assets)
     // Get the skinInstance from the character model
    const characterModel = characterEntity.model;
    if (characterModel && characterModel.meshInstances[0].skinInstance) {
        const skinInstance = characterModel.meshInstances[0].skinInstance;
        const bones = skinInstance.bones;
        // Find the right hand bone (RightHand)
        const rightHandBone = bones.find(bone => bone.name === 'mixamorig:RightHand');
        if (rightHandBone) {
        const weaponHelper = createWeapon(characterEntity, assets, rightHandBone);
        // Create muzzle flash entity
        const muzzlesEntity = new pc.Entity("muzzleFlash");
        muzzlesEntity.addComponent("animation_muzle", {
            assets: [assets.muzzle_flash]
        });
        app.on('update', () => {
            // get location bone 
            const handPosition = rightHandBone.getPosition();
            const handRotation = rightHandBone.getRotation();
            weaponHelper.setLocalScale(0.4,0.4,0.4)
            weaponHelper.setPosition(handPosition);
            weaponHelper.setRotation(handRotation);
        });
    } else {
        console.log("Không tìm thấy xương 'mixamorig:RightHand'.");
    }
}
 // Add animation component
 characterEntity.addComponent("animation", {
    assets: [assets.idle, assets.running, assets.shooting, assets.rifleaim]
});
    let currentAnim = assets.idle.name;
            // create machine for charracter
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
    
    // Set up character keyboard
    const charMovement = new pc.Vec3();
    const keyboard = new pc.Keyboard(document.body); 
    // Variables for mouse movement
    let isDragging = false;
    let cameraYaw = 0;
    let cameraPitch = 15;  // Pitch camera slightly down
    let lastMouseX = 0;
    let lastMouseY = 0;
    const sensitivity = 0.2;
    let isShooting = false; // Variable to track shooting state
    let isPointerLocked  = false
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
        //When clicking the mouse, play the shooting animation if in idle or rifleaim
        if ((playerStateMachine.getCurrentState() === "idle" || playerStateMachine.getCurrentState() === "rifleaim" || playerStateMachine.getCurrentState() === "shooting" ) && !isShooting) {
            playerStateMachine.changeState("shooting");
            console.log(playerStateMachine.getCurrentState() )
          //  currentAnim = assets.shooting.name;
            isShooting = true;     
            const from = cameraEntity.getPosition();
            const to = new pc.Vec3();
            cameraEntity.camera?.screenToWorld(event.x, event.y, 1000, to);
                
            const result = app.systems.rigidbody?.raycastFirst(from, to);
            if (result) {
                if (result.entity.tags.has('enemy')) {
                    console.log('Hit enemy!');
                } else {
                    console.log('Hit something else.');
                }
            } else {
                console.log('No raycast hit');
            }
        }

        if (cameraEntity && cameraEntity.camera) {
            const from = cameraEntity.getPosition(); 
            const forward = cameraEntity.forward.clone(); 
            const distance = 100; // distance raycast
            const to = new pc.Vec3().add2(from, forward.mulScalar(distance));

            if (app.systems.rigidbody) {
               
                const result = app.systems.rigidbody.raycastFirst(from, to);

                if (result?.entity.health !== undefined) {
                    result.entity.health -= 10;
                    console.log(`Enemy health: ${result.entity.health}`);
                
                    if (result.entity.health <= 0) {
                        console.log('Enemy defeated!');
                        result.entity.destroy();
                    }
                } else {
                    console.warn('Enemy entity does not have a health property');
                }
            // flash
            const flash = new pc.Entity('muzzle_flash');
            flash.addComponent('model', {
                type: 'asset',
                asset: assets.muzzle_flash
            });
            flash.setPosition(to);
            app.root.addChild(flash);
            setTimeout(() => {
                flash.destroy();
            }, 100);
        }
    }
    });
    // Mouse up event to stop shooting
    app.mouse.on(pc.EVENT_MOUSEUP, () => {
        if (isShooting) {
            if (playerStateMachine.getCurrentState() === "shooting") {
                const newState = currentAnim ===   playerStateMachine.getCurrentState() ? "rifleaim":"idle"
              //  const newState = currentAnim === assets.rifleaim.name ? "rifleaim" : "idle";
                playerStateMachine.changeState(newState);   
            }
            isShooting = false;
            console.log("Mouse up: Stopped shooting");
        }
    });

    // Mouse move event to rotate the camera when dragging
    app.mouse.on(pc.EVENT_MOUSEMOVE, (event) => {
        if (isPointerLocked) {
            console.log(`Mouse dx: ${event.dx}, dy: ${event.dy}`);
            const dx = event.dx ;
            const dy = event.dy ;
    
            // Cập nhật yaw (xoay ngang) và pitch (xoay dọc) của camera
            cameraYaw -= dx * sensitivity;
            cameraPitch -= dy * sensitivity;
    
            // Giới hạn pitch để tránh lật ngược
            cameraPitch = pc.math.clamp(cameraPitch, -45, 45);
    
            // Chỉ cập nhật camera mà không tác động đến nhân vật
            updateCameraRotation(cameraYaw, cameraPitch);
        }
    });
}    

function updateCameraRotation(yaw: number, pitch: number) {
    cameraEntity.setEulerAngles(pitch, yaw, 0);
}


// Mouse down event to start dragging
    app.mouse?.on(pc.EVENT_MOUSEDOWN, (event) => {
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
      //  characterEntity.animation?.play(assets.rifleaim.name, 0.1);
      //playerStateMachine.changeState("");   
       // currentAnim = assets.rifleaim.name;
        console.log("Key Q pressed: Aiming with rifle");
    }
});

keyboard.on(pc.EVENT_KEYUP, (event) => {
    if (event.key === pc.KEY_Q) {
        if (playerStateMachine.getCurrentState() === "rifleaim") {
            playerStateMachine.changeState("idle");
            // characterEntity.animation?.play(assets.idle.name, 0.1);
            // currentAnim = assets.idle.name;
            console.log("Key Q released: Back to idle");
        }
    }
});

app.on("update", (dt) => {
    // call movement
    handleMovement(characterEntity, keyboard, cameraYaw, dt);


    const charPosition = characterEntity.getPosition();
    const charRotation = characterEntity.getRotation();

    // set up location camera
    let cameraOffset = new pc.Vec3(0, 2, -3); 

    // rotation in camera set up
    const cameraQuat = new pc.Quat().setFromEulerAngles(0, cameraYaw, 0);
    cameraQuat.transformVector(cameraOffset, cameraOffset);

    // update camera
    const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset);
    cameraEntity.setPosition(cameraPosition);

    // Camera look at point
    const lookAtPoint = new pc.Vec3().add2(charPosition, new pc.Vec3(0, 1.7, 0));  // Nhìn vào đầu nhân vật
    cameraEntity.lookAt(lookAtPoint);

    
    if (charMovement.length() > 0) {
        const angle = Math.atan2(charMovement.x, charMovement.z);
        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
    }

    // update animation
    const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
    if (moved && playerStateMachine.getCurrentState() === "idle") {
        playerStateMachine.changeState("running");
    } else if (!moved && playerStateMachine.getCurrentState() === "running") {
        playerStateMachine.changeState("idle");
    }

    
});
}

