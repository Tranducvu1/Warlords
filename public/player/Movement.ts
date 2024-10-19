import * as pc from 'playcanvas';
import { stateMachine } from '../Utils/StateMachine';

const playerStateMachine = new stateMachine("idle");

export function handleMovement(characterEntity, keyboard, cameraYaw, dt) {
    const charMovement = new pc.Vec3();
    const charSpeed = 10;

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

    if (charMovement.lengthSq() > 0) {
        characterEntity.translate(charMovement);

        // Rotate the character to face the direction of movement
        const angle = Math.atan2(charMovement.x, charMovement.z);
        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);

        if (playerStateMachine.getCurrentState() !== "running") {
              console.log(charMovement);
            playerStateMachine.changeState("running");
        }
    } else {
        
        if (playerStateMachine.getCurrentState() !== "idle") {
            playerStateMachine.changeState("idle");
        }
    }

      // Đăng ký sự kiện va chạm
      characterEntity.rigidbody.on('collisionstart', (event) => {
        console.log("Collision start");

        // Duyệt qua tất cả các đối tượng va chạm
        event.contacts.forEach(contact => {
            const otherEntity = contact.other; // Đối tượng va chạm
            console.log("Va chạm với:", otherEntity.name);
        });
    });
    
  
    return charMovement;
}
