import * as pc from 'playcanvas';

/**
 * Represents an enemy entity in the game.
 * Extends the base Entity class from PlayCanvas.
 */
export class EnemyEntity extends pc.Entity {
    health: number; // The health of the enemy entity.

    /**
     * Creates an instance of the EnemyEntity.
     * 
     * @param name - The name of the enemy entity.
     * @param health - The initial health value for the enemy.
     */
    constructor(name: string, health: number) {
        super(name); // Call the constructor of the parent Entity class with the name.
        this.health = health; // Set the health of the enemy.
        // this.state = stateMachine; // State machine can be initialized here if needed.
    }

    /**
     * Reduces the health of the enemy by a specified amount.
     * Logs the remaining health and checks for death.
     * 
     * @param amount - The amount of damage to apply to the enemy.
     */
    takeDamage(amount: number) {
        this.health -= amount; // Subtract the damage amount from health.
        console.log(`${this.name} takes ${amount} damage. Health remaining: ${this.health}`);
        if (this.health <= 0) {
            this.die(); // If health falls below or equals zero, call the die method.
        }
    }

    /**
     * Handles the death of the enemy.
     * Logs a message and destroys the entity.
     */
    die() {
        console.log(`${this.name} has died.`);
        
        this.destroy(); // Remove the entity from the scene.
    }
}
