import * as pc from 'playcanvas';

/**
 * Moves the zombie enemy towards the character or along a defined path.
 * 
 * @param enemyEntity - The zombie entity to move.
 * @param characterEntity - The player character that the zombie interacts with.
 */
export function moveZombie(enemyEntity, characterEntity) {
    const position = enemyEntity.getLocalPosition();
    const maxPositionX = 15;  
    const minPositionX = -15;

    if (enemyEntity.rigidbody) {
        const characterPosition = characterEntity.getLocalPosition();
        const distance = position.distance(characterPosition);
        
        // If within attack range, switch to attack state
        if (distance < enemyEntity.attackRange) {
            if (enemyEntity.stateMachine && enemyEntity.stateMachine.getCurrentState() !== "zombieattack") {
                enemyEntity.stateMachine.changeState("zombieattack");
                enemyEntity.zombieSpeed = 0;  // Stop the zombie's movement
            }

            // Calculate direction to the character and set rotation
            const direction = characterPosition.clone().sub(position).normalize();
            const angle = Math.atan2(direction.z, direction.x) * (180 / Math.PI);
            enemyEntity.setLocalEulerAngles(0, angle, 0);
        
        } else if (distance < enemyEntity.chaseRange) {
            // If within chase range, move towards the character
            const direction = characterPosition.clone().sub(position).normalize();
            const desiredVelocity = direction.scale(enemyEntity.zombieSpeed);
            enemyEntity.rigidbody.linearVelocity = new pc.Vec3(desiredVelocity.x, enemyEntity.rigidbody.linearVelocity.y, desiredVelocity.z);

            // Set rotation towards the character
            const angle = Math.atan2(direction.z, direction.x) * (180 / Math.PI);
            enemyEntity.setLocalEulerAngles(0, angle, 0);
        
        } else {
            // Patrol logic if outside of chase range
            let currentRotation = enemyEntity.direction === 1 ? 90 : 270; 
            
            // Reverse direction if out of patrol bounds
            if (position.x > maxPositionX && enemyEntity.direction === 1) {
                enemyEntity.direction = -1;
                currentRotation = 270; 
            } else if (position.x < minPositionX && enemyEntity.direction === -1) {
                enemyEntity.direction = 1;
                currentRotation = 90;
            }

            enemyEntity.setLocalEulerAngles(0, currentRotation, 0);
            const moveDirection = currentRotation === 90 ? 1 : -1;
            
            // Apply movement speed when not in attack state
            if (enemyEntity.stateMachine && enemyEntity.stateMachine.getCurrentState() !== "zombieattack") {
                enemyEntity.rigidbody.linearVelocity = new pc.Vec3(
                    moveDirection * enemyEntity.zombieSpeed, 
                    enemyEntity.rigidbody.linearVelocity.y,
                    0  
                );
            } 
        }
    }
}
