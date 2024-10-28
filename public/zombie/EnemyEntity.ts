import * as pc from 'playcanvas';
import { HealthBar } from '../healthbar/healthbar';

/**
 * EnemyEntity - Represents an enemy entity within the game, equipped with health management and a health bar display.
 * Each enemy entity has health, max health, and an associated health bar that visually reflects its health status.
 */
export class EnemyEntity extends pc.Entity {
    private health: number;
    private maxHealth: number;
    private healthBar: HealthBar;

    /**
     * Constructor - Sets up the EnemyEntity with a name, initial health, app context, and assets.
     * @param name - The name identifier for the enemy.
     * @param initialHealth - The starting health value.
     * @param app - PlayCanvas application instance for context and rendering.
     * @param assets - References to assets, especially for health bar creation.
     */
    constructor(name: string, initialHealth: number, app: pc.Application, assets: any) {
        super(name);
        
        // Initialize health properties
        this.health = initialHealth;
        this.maxHealth = initialHealth;

        // Initialize and attach the health bar to the enemy entity
        this.healthBar = new HealthBar(app, assets);
        this.addChild(this.healthBar.entity);

        // Set the initial health value on the health bar
    }

   
    

    /**
     * takeDamage - Reduces the health by a given amount and updates the health bar.
     * If health reaches zero, triggers the death logic.
     * @param amount - The amount of health to reduce.
     */
    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount);
        console.log(`${this.name} takes ${amount} damage. Health remaining: ${this.health}`);
        
        // Update the health bar display
        this.healthBar.updateHealth(this.health, this.maxHealth);

        // Trigger die() if health reaches zero
        if (this.health <= 0) {
            this.die();
        }
    }

    /**
     * heal - Increases health by a specified amount, up to the maximum health value.
     * Updates the health bar to reflect new health status.
     * @param amount - The amount of health to restore.
     */
    heal(amount: number) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.healthBar.updateHealth(this.health, this.maxHealth);
    }

    /**
     * die - Handles the death of the enemy, including health bar cleanup and entity destruction.
     * This method can also include additional effects or animations, such as a death animation or score increase.
     */
    die() {
        console.log(`${this.name} has died.`);
        this.healthBar.destroy(); // Remove the health bar from the scene
        this.destroy();           // Remove the enemy entity from the scene
    }

    /**
     * getHealth - Provides the current health of the enemy.
     * @returns Current health value.
     */
    getHealth(): number {
        return this.health;
    }

    /**
     * getMaxHealth - Provides the maximum health value of the enemy.
     * @returns Maximum health value.
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }
}

/**
 * createEnemy - Factory function for creating and positioning an EnemyEntity in the scene.
 * Adds the enemy to the app root and sets its position.
 * @param app - The PlayCanvas application instance.
 * @param assets - Asset references needed for the enemy, like health bar assets.
 * @param name - Name identifier for the enemy entity.
 * @param health - Initial health value of the enemy.
 * @param position - Position vector to place the enemy in the scene.
 * @returns A fully initialized and positioned EnemyEntity.
 */
export function createEnemy(
    app: pc.Application, 
    assets: any, 
    name: string, 
    health: number, 
    position: pc.Vec3
): EnemyEntity {
    const enemy = new EnemyEntity(name, health, app, assets);
    enemy.setPosition(position.x, position.y, position.z);
    app.root.addChild(enemy);
    return enemy;
}
