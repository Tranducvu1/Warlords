import * as pc from 'playcanvas';

/**
 * Initializes essential zombie properties for movement, chase, and patrol states.
 * This function sets up defaults if properties are undefined.
 * @param {pc.Entity} enemyEntity - The zombie entity
 */
function initZombieProperties(enemyEntity) {
    enemyEntity.direction ??= 1; // Initial movement direction (1: right, -1: left)
    enemyEntity.zombieSpeed ??= 2; // Default movement speed
    enemyEntity.chaseRange ??= 30; // Detection range to start chasing the player
    enemyEntity.attackRange ??= 2; // Range within which zombie attacks
    enemyEntity.patrolState ??= { // Patrol behavior settings
        currentPoint: 0,
        waitTimer: 0,
        waitDuration: 2,
        isWaiting: false
    };
}

/**
 * Controls zombie movement based on its state: attack, chase, or patrol.
 * @param {pc.Entity} enemyEntity - The zombie entity
 * @param {pc.Entity} characterEntity - The player character to chase or attack
 * @param {Array} obstacles - Optional array of obstacles for potential collision checks
 */
export function moveZombie(enemyEntity, characterEntity, obstacles = []) {
    initZombieProperties(enemyEntity); // Initialize zombie properties if not set

    const position = enemyEntity.getLocalPosition();
    const maxPositionX = 30; // Right boundary for patrol
    const minPositionX = -30; // Left boundary for patrol

    // Movement only if Rigidbody is available
    if (enemyEntity.rigidbody) {
        const characterPosition = characterEntity.getLocalPosition();
        const distance = position.distance(characterPosition); // Distance to player

        // Handle state based on proximity to the player
        if (distance < enemyEntity.attackRange) {
            handleAttackState(enemyEntity, characterPosition); // Attack if in range
        } else if (distance < enemyEntity.chaseRange) {
            handleChaseState(enemyEntity, characterPosition); // Chase if within chase range
        } else {
            handlePatrolState(enemyEntity, minPositionX, maxPositionX, obstacles); // Patrol otherwise
        }
    }
}

/**
 * Executes zombie's attack behavior. Stops movement and rotates to face player.
 * @param {pc.Entity} enemyEntity - The zombie entity
 * @param {pc.Vec3} targetPos - The player's position
 */
function handleAttackState(enemyEntity, targetPos) {
    // Set zombie to attack state if not already attacking
    if (enemyEntity.stateMachine?.getCurrentState() !== "zombieattack") {
        enemyEntity.stateMachine.changeState("zombieattack");
        enemyEntity.rigidbody.linearVelocity = new pc.Vec3(0, enemyEntity.rigidbody.linearVelocity.y, 0); // Halt movement
    }
    // Rotate to face the target position
    const directionToTarget = targetPos.clone().sub(enemyEntity.getLocalPosition());
    const angle = Math.atan2(directionToTarget.x, directionToTarget.z) * (180 / Math.PI);
    enemyEntity.setLocalEulerAngles(0, angle, 0);
}

/**
 * Executes chase behavior. Rotates zombie towards player and applies forward velocity.
 * @param {pc.Entity} enemyEntity - The zombie entity
 * @param {pc.Vec3} targetPos - The player's position
 */
function handleChaseState(enemyEntity, targetPos) {
    // Calculate direction to player and adjust rotation
    const directionToTarget = targetPos.clone().sub(enemyEntity.getLocalPosition());
    const angle = Math.atan2(directionToTarget.x, directionToTarget.z) * (180 / Math.PI);
    enemyEntity.setLocalEulerAngles(0, angle, 0);

    // Apply forward velocity in the facing direction
    const rotation = enemyEntity.getRotation();
    const forward = new pc.Vec3();
    rotation.transformVector(new pc.Vec3(0, 0, 1), forward);
    const chaseSpeed = enemyEntity.zombieSpeed;
    enemyEntity.rigidbody.linearVelocity = forward.mulScalar(chaseSpeed);
}

/**
 * Executes patrol behavior. Moves zombie between specified x-boundaries and waits at each end.
 * Changes direction if zombie collides with a "map" object.
 * @param {pc.Entity} enemyEntity - The zombie entity
 * @param {number} minX - Left boundary for patrol
 * @param {number} maxX - Right boundary for patrol
 * @param {Array} obstacles - Array of obstacles for collision detection
 */
function handlePatrolState(enemyEntity, minX, maxX, obstacles) {
    const position = enemyEntity.getLocalPosition();
    const patrolState = enemyEntity.patrolState;

    // Check for collisions with "map" objects and change direction if collided
    const collidedWithMap = obstacles.some(obstacle => {
        return obstacle.tags?.has('map') && enemyEntity.collision.intersects(obstacle.collision);
    });

    if (collidedWithMap) {
        enemyEntity.direction *= -1;
    }

    // If waiting at the patrol boundary, track wait time and reset upon completion
    if (patrolState.isWaiting) {
        patrolState.waitTimer += 1 / 60; // Assume this function is called every frame
        if (patrolState.waitTimer >= patrolState.waitDuration) {
            patrolState.isWaiting = false;
            patrolState.waitTimer = 0;
            enemyEntity.direction *= -1; // Reverse direction after waiting
        }
        enemyEntity.rigidbody.linearVelocity = new pc.Vec3(0, enemyEntity.rigidbody.linearVelocity.y, 0); // Halt movement while waiting
        return;
    }

    // Check if zombie reached patrol boundary, trigger wait if so
    if ((position.x >= maxX && enemyEntity.direction === 1) || (position.x <= minX && enemyEntity.direction === -1)) {
        patrolState.isWaiting = true;
        return;
    }

    // Continue patrolling in current direction
    enemyEntity.setLocalEulerAngles(0, enemyEntity.direction === 1 ? 90 : 270, 0);
    enemyEntity.rigidbody.linearVelocity = new pc.Vec3(
        enemyEntity.zombieSpeed * 0.7 * enemyEntity.direction, // 70% speed while patrolling
        enemyEntity.rigidbody.linearVelocity.y,
        0
    );
}
