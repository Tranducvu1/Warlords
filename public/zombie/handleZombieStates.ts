// handleZombieStates.js
import * as pc from 'playcanvas';
import { createZombieStateMachine } from './zombiestateMachine';
import { moveZombie } from './moveZombie';

export function handleZombieStates(assets, characterEntity, enemyEntity) {
    // Initialize zombie properties if not already set
    if (!enemyEntity.stateMachine) {
        enemyEntity.stateMachine = createZombieStateMachine(enemyEntity, assets);
        enemyEntity.direction = 1;  
        enemyEntity.zombieSpeed = 2;
        enemyEntity.chaseRange = 15;
        enemyEntity.attackRange = 4;
     //   enemyEntity.setLocalEulerAngles(0, 0, 0); 
    }

    const zombieStateMachine = enemyEntity.stateMachine;


    // Get positions and calculate distance
    const position = enemyEntity.getLocalPosition();
    const characterPosition = characterEntity.getLocalPosition();
    const distance = position.distance(characterPosition);

    // Handle attack state
    if (distance < enemyEntity.attackRange) {
        if (zombieStateMachine.getCurrentState() !== "zombieattack") {
            zombieStateMachine.changeState("zombieattack");
            enemyEntity.zombieSpeed = 0;
        }
    } else {
        if (zombieStateMachine.getCurrentState() !== "zombierunning") {
            zombieStateMachine.changeState("zombierunning");
            enemyEntity.zombieSpeed = 2;
        }
        // Move zombie when not attacking
        moveZombie(enemyEntity);
    }

    // Handle map collisions
    if (enemyEntity.rigidbody && enemyEntity.rigidbody.collision) {
        enemyEntity.rigidbody.collision.on('collisionstart', (event) => {
            event.contacts.forEach(contact => {
                if (contact.other.tags && contact.other.tags.has('map')) {
                    // Reverse direction on map collision
                    enemyEntity.direction *= -1;
                    const newRotation = enemyEntity.direction === 1 ? 0 : 180;
                    enemyEntity.setLocalEulerAngles(0, newRotation, 0);
                }
            });
        });
    }
}