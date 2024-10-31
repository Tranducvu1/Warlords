// Import the PlayCanvas library and necessary modules for health and experience bars
import * as pc from 'playcanvas';
import { HealthBar } from '../healthbar/healthbar';
import { healthbarCharacter } from '../healthbar/HealthBarCharacter';
import { experimentBar } from '../experimentBar/experimentBar';

// CharacterEntity class to define character properties and behaviors
export class CharacterEntity extends pc.Entity {
    private health: number;
    private maxHealth: number;
    private healthBar: healthbarCharacter;
    private experienceBar: experimentBar;
    private maxExperience: number;
    private experience: number;

    // Constructor to initialize character's name, health, experience, app, and assets
    constructor(name: string, initialHealth: number, initialExperience: number, app: pc.Application, assets: any,camera:pc.Entity) {
        super(name);

        // Initialize health and experience values
        this.health = initialHealth;
        this.maxHealth = initialHealth;
        this.maxExperience = 100;
        this.experience = 0; 

       

          // Initialize and attach health and experience bars to the character entity
          this.healthBar = new healthbarCharacter(app, assets);
          this.healthBar.entity.setLocalPosition(-2.5, 1.5, -4); 
          this.healthBar.entity.setEulerAngles(90, 0, 0);
          this.healthBar.entity.setLocalScale(0.015, 0.02, 0.02);
          camera.addChild(this.healthBar.entity);

          this.experienceBar = new experimentBar(app, assets);
          this.experienceBar.entity.setLocalPosition(-2.5, 1.4, -4);
          this.experienceBar.entity.setLocalScale(0.015, 0.02, 0.02);
          camera.addChild(this.experienceBar.entity);
    }

   

    // Update the health bar to reflect the current health value
    private updateHealthBar() {
        this.healthBar.updateHealth(this.health, this.maxHealth);
    }

    // Update the experience bar to reflect the current experience value
    private updateExperienceBar() {
        this.experienceBar.updateExperience(this.experience, this.maxExperience);
    }

    // Method to decrease health by a given amount and update the health bar
    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount); // Ensure health doesn't go below zero
        console.log(`${this.name} takes ${amount} damage. Health remaining: ${this.health}`);
        this.updateHealthBar();

        // Check if health is zero or below to trigger death
        if (this.health <= 0) {
            this.die();
        }
    }

    // Method to increase experience by a certain amount and update the experience bar
    getExperience(point: number) {
        this.experience = Math.min(this.maxExperience, this.experience + point); // Ensure experience doesn't exceed maxExperience
        console.log(`${this.name} gained ${point} experience. Total experience: ${this.experience}`);
        this.updateExperienceBar(); // Update experience bar
        return this.experience; // Return current experience for verification
    }

    // Method to heal the character and update the health bar
    heal(amount: number) {
        this.health = Math.min(this.maxHealth, this.health + amount); // Ensure health doesn't exceed maxHealth
        this.updateHealthBar();
    }

    // Method to handle character's death
    die() {
        console.log(`${this.name} has died.`);
        this.healthBar.destroy(); // Destroy health bar to clean up resources
        this.destroy(); // Destroy the character entity itself
    }

    // Getter method to retrieve current health
    getHealth(): number {
        return this.health;
    }

    // Getter method to retrieve maximum health
    getMaxHealth(): number {
        return this.maxHealth;
    }
}

// Helper function to create an enemy character with specified properties and add it to the app root
export function createCharacterEntity(
    app: pc.Application,
    assets: any,
    name: string,
    health: number,
    experience: number,
    position: pc.Vec3,
    camera:pc.Entity
): CharacterEntity {
    const enemy = new CharacterEntity(name, health, experience, app, assets,camera); // Create a new enemy character
    enemy.setPosition(position.x, position.y, position.z); // Set enemy position
    app.root.addChild(enemy); // Add enemy to the app root
    return enemy; // Return the created enemy instance
}
