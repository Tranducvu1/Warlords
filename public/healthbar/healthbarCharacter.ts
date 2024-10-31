// HealthBarCharacter.ts
import * as pc from 'playcanvas';

// Class to create and manage the health bar for a character
export class healthbarCharacter {
    entity: pc.Entity; // Entity representing the health bar
    private redMaterial: pc.StandardMaterial; // Material used for the health bar
    
    // Define consistent scale constants for the health bar
    private readonly BASE_WIDTH = 0.05 /2;
    private readonly BASE_HEIGHT = 0.05/2 ;
    private readonly BASE_DEPTH = 0.05 /2;

    // Constructor to initialize the health bar entity and its properties
    constructor(app: pc.Application, assets: any) {
        this.entity = new pc.Entity('healthbarcharacter'); // Create a new entity for the health bar
        this.redMaterial = this.createMaterial(); // Create the red material for the health bar
        this.setupModel(assets); // Set up the model with the provided assets
        this.setInitialScale(); // Set the initial scale and position of the health bar
    }

    // Method to create a red material for the health bar
    private createMaterial(): pc.StandardMaterial {
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 0, 0); // Set diffuse color to red
        material.ambient = new pc.Color(1, 0, 0); // Set ambient color to red
        material.useLighting = false; // Disable lighting for the material
        material.cull = pc.CULLFACE_NONE; // Disable culling
        material.update(); // Update the material to apply changes
        return material; // Return the created material
    }

    // Method to set up the model for the health bar
    private setupModel(assets: any) {
        // Add a model component to the entity using the health bar asset
        this.entity.addComponent('model', {
            type: 'asset',
            asset: assets.healthbar
        });

        // Function to set the material of the model mesh instances
        const setupMaterial = () => {
            const model = this.entity.model; // Get the model of the entity
            if (model && model.meshInstances) {
                model.meshInstances.forEach((meshInstance: any) => {
                    meshInstance.material = this.redMaterial; // Apply the red material to each mesh instance
                });
            }
        };

        // Set up the material once the health bar asset is loaded
        assets.healthbar.on('load', setupMaterial);
        if (assets.healthbar.resource) {
            setupMaterial(); // If the resource is already loaded, set up the material immediately
        }
    }   

    // Method to set the initial scale and position of the health bar
    private setInitialScale() {
        this.entity.setLocalScale(
            this.BASE_WIDTH , // Scale width
            this.BASE_HEIGHT , // Scale height
            this.BASE_DEPTH  // Scale depth
        );
        this.entity.setLocalPosition(-100, 0, 10); 
        // Set the initial position of the health bar
    }

    // Method to update the health bar scale based on current and maximum health
    updateHealth(currentHealth: number, maxHealth: number) {
        const healthPercentage = currentHealth / maxHealth; // Calculate health percentage
        this.entity.setLocalScale(
            (this.BASE_WIDTH) * healthPercentage, // Scale width based on health percentage
            this.BASE_HEIGHT , // Maintain constant height
            this.BASE_DEPTH // Maintain constant depth
        );
    }

    // Method to destroy the health bar entity
    destroy() {
        this.entity.destroy(); // Remove the entity from the scene
    }
}
