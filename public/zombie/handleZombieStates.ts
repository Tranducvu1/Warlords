import * as pc from 'playcanvas'; // Import PlayCanvas library
import { createZombieStateMachine } from './zombiestateMachine'; // Import function to create the zombie state machine
import { moveZombie } from './moveZombie'; // Import function to move the zombie

/**
 * Handles the states and behavior of the zombie enemy.
 * 
 * @param assets - The game assets needed for the zombie.
 * @param characterEntity - The player character that the zombie interacts with.
 * @param enemyEntity - The zombie entity to control.
 */
export function handleZombieStates(assets, characterEntity, enemyEntity) {
    // Initialize zombie properties if not already set
    if (!enemyEntity.stateMachine) {
        // Create the state machine for the zombie and assign it to enemyEntity
        enemyEntity.stateMachine = createZombieStateMachine(enemyEntity, assets);
        
        // Initialize necessary properties for the zombie
        enemyEntity.direction = 1; // Movement direction
        enemyEntity.zombieSpeed = 2; // Speed of the zombie
        enemyEntity.speedattack = 6; // Speed of the zombie while attacking
        enemyEntity.chaseRange = 15;  // Range to chase the target
        enemyEntity.attackRange = 4;   // Range to attack the target
        enemyEntity.setLocalEulerAngles(0, 90, 0); // Set initial rotation
    }

    // Get the zombie's state machine
    const zombieStateMachine = enemyEntity.stateMachine;
    // Get the current positions of the zombie and the character
    const position = enemyEntity.getLocalPosition();
    const characterPosition = characterEntity.getLocalPosition();
    // Calculate the distance between the zombie and the character
    const distance = position.distance(characterPosition);

    // Handle state based on the distance to the character
    if (distance < enemyEntity.attackRange) {
        // If within attack range
        if (zombieStateMachine.getCurrentState() !== "zombieattack") {
            // Change state to attack
            zombieStateMachine.changeState("zombieattack");
            enemyEntity.zombieSpeed = 0; // Stop moving when attacking
        }
    } else {
        // If not within attack range - either run or chase
        if (zombieStateMachine.getCurrentState() !== "zombierunning") {
            // Change state to running
            zombieStateMachine.changeState("zombierunning");
            enemyEntity.zombieSpeed = 2; // Restore movement speed
        }
        // Call the move function to move the zombie towards the character
        moveZombie(enemyEntity, characterEntity);
    }

    // Handle collisions with the map
    if (enemyEntity.rigidbody && enemyEntity.rigidbody.collision) {
        // Set up collision start event
        enemyEntity.rigidbody.collision.on('collisionstart', (event) => {
            // Iterate through the contacts
            event.contacts.forEach(contact => {
                // If colliding with the map
                if (contact.other.tags && contact.other.tags.has('map')) {
                    // Reverse the movement direction
                    enemyEntity.direction *= -1;
                    // Reset the rotation
                    enemyEntity.setLocalEulerAngles(0, 90, 0);
                }
            });
        });
    }
}
