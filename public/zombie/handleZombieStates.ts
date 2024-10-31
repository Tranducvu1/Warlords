import * as pc from 'playcanvas';
import { moveZombie } from './moveZombie';
import { createZombieStateMachine } from './zombiestateMachine';

/**
 * Manages the zombie's state transitions and behavior based on proximity to the player.
 *
 * @param {Object} assets - Game assets related to zombie animations and models.
 * @param {pc.Entity} characterEntity - The player character entity the zombie interacts with.
 * @param {pc.Entity} enemyEntity - The zombie enemy entity to control.
 */
export function handleZombieStates(assets, characterEntity, enemyEntity) {
    // Initialize zombie state machine and necessary properties if not already set
    if (!enemyEntity.stateMachine) {
        enemyEntity.stateMachine = createZombieStateMachine(enemyEntity, assets);

        // Set basic properties for zombie movement, detection, and attack
        enemyEntity.direction = 1;
        enemyEntity.zombieSpeed = 2;
        enemyEntity.speedattack = 8;
        enemyEntity.chaseRange = 40;
        enemyEntity.attackRange = 2;
        enemyEntity.damage = 10;
        enemyEntity.attackCooldown = 3; // seconds between attacks
        enemyEntity.lastAttackTime = 0; // tracking last attack timestamp
        enemyEntity.rotationSpeed = 5; // speed of rotation to face player
    }

    // Define current states and positions for zombie and player
    const zombieStateMachine = enemyEntity.stateMachine;
    const position = enemyEntity.getLocalPosition();
    const characterPosition = characterEntity.getLocalPosition();
    const distance = position.distance(characterPosition); // distance between zombie and player
    const currentTime = Date.now() / 1000;

    // Helper function to calculate shortest rotation angle
    function calculateShortestRotation(current, target) {
        let diff = (target - current) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        return diff;
    }

    // Proceed only if player is active and within range
    if (characterEntity.tags?.has('player') && characterEntity.health > 0) {
        // Determine direction to player and target angle for zombie to face player
        const directionToCharacter = characterPosition.clone().sub(position);
        const targetAngle = Math.atan2(directionToCharacter.x, directionToCharacter.z) * (180 / Math.PI);
        const currentRotation = enemyEntity.getLocalEulerAngles();

        // If within attack range, switch to attack state and handle facing player
        if (distance < enemyEntity.attackRange) {
            if (zombieStateMachine.getCurrentState() !== "zombieattack") {
                zombieStateMachine.changeState("zombieattack");
                enemyEntity.zombieSpeed = 0; // Stop moving forward during attack
            }
            // Rotate to face player within rotation speed limits
            const rotationDiff = calculateShortestRotation(currentRotation.y, targetAngle);
            const rotationStep = Math.sign(rotationDiff) * Math.min(Math.abs(rotationDiff), enemyEntity.rotationSpeed);
            enemyEntity.setLocalEulerAngles(0, currentRotation.y + rotationStep, 0);

            // Attack if cooldown period has passed since last attack
            if (currentTime - enemyEntity.lastAttackTime >= enemyEntity.attackCooldown) {
                enemyEntity.lastAttackTime = currentTime;
                characterEntity.takeDamage(enemyEntity.damage); // Inflict damage to player
            }
        } else {
            // Outside attack range: switch to running state and approach player
            if (zombieStateMachine.getCurrentState() !== "zombierunning") {
                zombieStateMachine.changeState("zombierunning");
                enemyEntity.zombieSpeed = 2; // Restore movement speed for chasing
            }
            // Rotate towards player as zombie moves closer
            const rotationDiff = calculateShortestRotation(currentRotation.y, targetAngle);
            const rotationStep = Math.sign(rotationDiff) * Math.min(Math.abs(rotationDiff), enemyEntity.rotationSpeed);
            enemyEntity.setLocalEulerAngles(0, currentRotation.y + rotationStep, 0);
            
            // Move zombie towards player using external movement function
            moveZombie(enemyEntity, characterEntity);
        }
    }
}
