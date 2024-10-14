import * as pc from 'playcanvas';
import { stateMachine } from './StateMachine';



declare module 'playcanvas' {
    interface Entity {
        health?: number;
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
     // Get the skinInstance from the character model
    const characterModel = characterEntity.model;
    if (characterModel && characterModel.meshInstances[0].skinInstance) {
        const skinInstance = characterModel.meshInstances[0].skinInstance;
        const bones = skinInstance.bones;

        // Find the right hand bone (RightHand)
        const rightHandBone = bones.find(bone => bone.name === 'mixamorig:RightHand');

        if (rightHandBone) {
        console.log("Tìm thấy xương tay phải:", rightHandBone.name);

    
        const weaponHelper = new pc.Entity('weaponHelper');

       
        characterEntity.addChild(weaponHelper);
            
        // muzzlesEntity.addComponent("animation_muzzle", {
        //     assets: [assets.muzzle_flash]
        // });
        const weaponModel = new pc.Entity('weaponModel');
        weaponModel.addComponent('model', {
            type: 'asset',
            asset: assets.weapon
        });
        //set up location and roate
        weaponModel.setLocalPosition(-0.58, 0.7, 0.1); 
        weaponModel.setLocalEulerAngles(90, 90, 0); 
        // Create muzzle flash entity
        const muzzlesEntity = new pc.Entity("muzzleFlash");
        muzzlesEntity.addComponent("animation_muzle", {
            assets: [assets.muzzle_flash]
        });
        weaponModel.setLocalPosition(-0.68, 0.7, 0);
        
        weaponHelper.addChild(weaponModel);

       
        app.on('update', () => {
            // Lấy vị trí và hướng của xương tay phải
            const handPosition = rightHandBone.getPosition();
            const handRotation = rightHandBone.getRotation();
            weaponHelper.setLocalScale(0.4,0.4,0.4)
            // Cập nhật vị trí và hướng của helper để súng luôn gắn với tay
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

// Add state machine
playerStateMachine.addState("idle", () => {
    characterEntity.animation?.play(assets.idle.name, 0.2);
    console.log("Switched to idle state");
});

playerStateMachine.addState("running", () => {
    characterEntity.animation?.play(assets.running.name, 0.2);
    console.log("Switched to running state");
});

playerStateMachine.addState("shooting", () => {
    characterEntity.animation?.play(assets.shooting.name, 0.2);
    console.log("Switched to shooting state");
});

playerStateMachine.addState("rifleaim", () => {
    characterEntity.animation?.play(assets.rifleaim.name, 0.2);
    console.log("Switched to rifleaim state");
});
// Set up character keyboard
const charMovement = new pc.Vec3();
const charSpeed = 5;
const keyboard = new pc.Keyboard(document.body); 
// Variables for mouse movement
let isDragging = false;
let cameraYaw = 0;
let cameraPitch = 15;  // Pitch camera slightly down
let lastMouseX = 0;
let lastMouseY = 0;
const sensitivity = 0.2;
let isShooting = false; // Variable to track shooting state
// Mouse down event to start shooting
if (app.mouse) {
    app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
        //When clicking the mouse, play the shooting animation if in idle or rifleaim
        if ((currentAnim === assets.idle.name || currentAnim === assets.rifleaim.name) && !isShooting) {
            characterEntity.animation?.play(assets.shooting.name, 0.2);
            currentAnim = assets.shooting.name;
            isShooting = true;     
        //     const from = cameraEntity.getPosition();
        //     const to = new pc.Vec3();
        //     cameraEntity.camera?.screenToWorld(event.x, event.y, 1000, to);
                
        //     const result = app.systems.rigidbody?.raycastFirst(from, to);
        //     if (result) {
        //         if (result.entity.tags.has('enemy')) {
        //             console.log('Hit enemy!');
        //         } else {
        //             console.log('Hit something else.');
        //         }
        //     } else {
        //         console.log('No raycast hit');
        //     }
        // }

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
            }

            // Thêm hiệu ứng flash
            const flash = new pc.Entity('flash');
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
            if (currentAnim === assets.shooting.name) {
                // muzzlesEntity.animation?.play(assets.muzzle_flash.name, 0);
                // if( muzzlesEntity.animation?.play){
                //     console.log("muzzle play")
                // }
                characterEntity.animation?.play(currentAnim === assets.rifleaim.name ? assets.rifleaim.name : assets.idle.name, 0.2);
                currentAnim = currentAnim === assets.rifleaim.name ? assets.rifleaim.name : assets.idle.name;
            }
            isShooting = false;
            console.log("Mouse up: Stopped shooting");
        }
    });

    // Mouse move event to rotate the camera when dragging
    app.mouse.on(pc.EVENT_MOUSEMOVE, (event) => {
        if (isDragging) {
            const dx = event.x - lastMouseX;
            const dy = event.y - lastMouseY;

            // Update yaw (horizontal rotation) and pitch (vertical rotation)
            cameraYaw -= dx * sensitivity;
            cameraPitch -= dy * sensitivity;

            // Clamp the pitch to prevent flipping over
            cameraPitch = pc.math.clamp(cameraPitch, -45, 45);

            lastMouseX = event.x;
            lastMouseY = event.y;
        }
    });
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
        characterEntity.animation?.play(assets.rifleaim.name, 0.1);
        currentAnim = assets.rifleaim.name;
        console.log("Key Q pressed: Aiming with rifle");
    }
});

keyboard.on(pc.EVENT_KEYUP, (event) => {
    if (event.key === pc.KEY_Q) {
        if (currentAnim === assets.rifleaim.name) {
            characterEntity.animation?.play(assets.idle.name, 0.1);
            currentAnim = assets.idle.name;
            console.log("Key Q released: Back to idle");
        }
    }
});

app.on("update", (dt) => {
    characterEntity.animation?.play(assets.muzzle_flash.name, 0.1);
    
    // Handle character movement
    if (keyboard.isPressed(pc.KEY_W)) {
        charMovement.z = +charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_S)) {
        charMovement.z = -charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_A)) {
        charMovement.x = +charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_D)) {
        charMovement.x = -charSpeed * dt;
    }

    // Rotate movement direction based on camera yaw
    const movementQuat = new pc.Quat().setFromEulerAngles(0, cameraYaw, 0);
    movementQuat.transformVector(charMovement, charMovement);
    characterEntity.translate(charMovement);
    // Rotate the character to face the direction of movement, if it is moving
    if (charMovement.length() > 0) {
        const angle = Math.atan2(charMovement.x, charMovement.z);
        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
    }
    charMovement.set(0, 0, 0);
    // Update the animation for movement
    const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
    if (moved && currentAnim === assets.idle.name) {
        characterEntity.animation?.play(assets.running.name, 0.1);
        currentAnim = assets.running.name;
    } else if (!moved && currentAnim === assets.running.name) {
        characterEntity.animation?.play(assets.idle.name, 0.1);
        currentAnim = assets.idle.name;
    }             

//  Update camera position to follow the character
const charPosition = characterEntity.getPosition();
const cameraOffset = new pc.Vec3(-0.1, 1.6, 0.5); 
const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset);
cameraEntity.setPosition(cameraPosition);


const forwardVector = new pc.Vec3(0, 0, -1);
const cameraDirection = new pc.Vec3().add2(cameraPosition, forwardVector);


cameraEntity.setEulerAngles(0, Math.atan2(cameraDirection.x - cameraPosition.x, cameraDirection.z - cameraPosition.z) * (180 / Math.PI), 0);

});
};

