import * as pc from 'playcanvas';

export function moveZombie(enemyEntity) {
    const position = enemyEntity.getLocalPosition();
    const maxPositionX = 15;  
    const minPositionX = -15;

    if (enemyEntity.rigidbody) {
       
        let currentRotation = enemyEntity.direction === 1 ? 90 : 270; 
      
        if (position.x > maxPositionX && enemyEntity.direction === 1) {
            enemyEntity.direction = -1;
            currentRotation = 270; 
        } else if (position.x < minPositionX && enemyEntity.direction === -1) {
            enemyEntity.direction = 1;
            currentRotation = 90;
        }

        enemyEntity.setLocalEulerAngles(0, currentRotation, 0)
        const moveDirection = currentRotation === 90 ? 1 : -1;
        
        if (enemyEntity.stateMachine && enemyEntity.stateMachine.getCurrentState() !== "zombieattack") {
            enemyEntity.rigidbody.linearVelocity = new pc.Vec3(
                moveDirection * enemyEntity.zombieSpeed, 
                enemyEntity.rigidbody.linearVelocity.y,
                0  
            );
        }
    }
}