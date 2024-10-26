import * as pc from "playcanvas";

/**
 * Sets up raycasting to detect shooting interactions in the game.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {stateMachine} playerStateMachine - The state machine managing the player's animations.
 * @param {pc.Entity} cameraEntity - The camera entity used for raycasting direction.
 * @param {pc.Entity} crosshairEntity - The crosshair entity to assist with aiming.
 * @param {Record<string, pc.Asset>} assets - The assets used in the game.
 */
export function setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets) {
    let isShooting = false; // Flag to prevent multiple shooting actions

    // Event listener for mouse down event
    app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
        // Check if the player is in a shooting state and not already shooting
        if ((playerStateMachine.getCurrentState() === "runningshooting" || playerStateMachine.getCurrentState() === "rifleaim") && !isShooting) {
            // Change to shooting state
            playerStateMachine.changeState("shooting");
            
            // Get the camera's position to determine the ray's starting point
            const from = cameraEntity.getPosition();
            const forward = cameraEntity.forward.clone(); // Get the camera's forward direction
            const distance = 100; // Set the distance for the raycast
            const to = new pc.Vec3().add2(from, forward.mulScalar(distance)); // Calculate the ray's endpoint
            
            // Perform a raycast to check for collisions
            const result = app.systems.rigidbody.raycastFirst(from, to);

            // Check if the raycast hit an entity
            if (result?.entity) {
                // Check if the hit entity has the "enemy" tag
                if (result.entity.tags.has("enemy")) {
                    // Check if the entity has a health property
                    if (result.entity.health !== undefined) {
                        result.entity.health -= 10; // Reduce health by 10
                        console.log(`Enemy hit! Remaining health: ${result.entity.health}`);
                        
                        // Destroy the enemy if health is zero or less
                        if (result.entity.health <= 0) {
                            result.entity.destroy();
                            console.log("Enemy destroyed!");
                        }
                        showHitEffect(result.entity); // Show hit effect on the enemy
                    }
                } else {
                    console.log("Hit something that is not an enemy."); // Log if hit non-enemy entity
                }
            }
        }
    });
}

// Function to show visual effects when hitting an enemy
function showHitEffect(enemyEntity) {
    // Here, you can create visual effects or notifications
    console.log(`Hit effect shown for: ${enemyEntity.name}`);
}
