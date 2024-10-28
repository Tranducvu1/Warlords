// healthBar.ts
import * as pc from 'playcanvas';

/**
 * Class representing a health bar in the game.
 * The health bar visually represents the health of an entity.
 */
export class HealthBar {
    entity: pc.Entity; // The entity that represents the health bar in the scene.
    private redMaterial: pc.StandardMaterial; // Material used for the health bar's appearance.
    
    /**
     * Creates an instance of HealthBar.
     * @param app - The PlayCanvas application instance.
     * @param assets - The asset library containing the health bar model.
     */
    constructor(app: pc.Application, assets: any) {
        this.entity = new pc.Entity('healthbar'); // Create a new entity for the health bar.
        this.redMaterial = this.createMaterial(); // Initialize the red material for the health bar.
        this.setupModel(assets); // Set up the health bar model using the provided assets.
        this.setInitialScale(); // Set the initial scale and position of the health bar.
    }

    /**
     * Creates a red material for the health bar.
     * @returns The created StandardMaterial instance.
     */
    private createMaterial(): pc.StandardMaterial {
        const material = new pc.StandardMaterial(); // Create a new material instance.
        material.diffuse = new pc.Color(1, 0, 0); // Set the diffuse color to red.
        material.ambient = new pc.Color(1, 0, 0); // Set the ambient color to red.
        material.useLighting = false; // Disable lighting effects on this material.
        material.cull = pc.CULLFACE_NONE; // Disable backface culling to render both sides.
        material.update(); // Update the material to apply changes.
        return material; // Return the created material.
    }

    /**
     * Sets up the model for the health bar using the provided assets.
     * @param assets - The asset library containing the health bar model.
     */
    private setupModel(assets: any) {
        // Add a model component to the health bar entity using the health bar asset.
        this.entity.addComponent('model', {
            type: 'asset',
            asset: assets.healthbar
        });

        // Function to apply the red material to the mesh instances of the model.
        const setupMaterial = () => {
            const model = this.entity.model; // Get the model component of the entity.
            if (model && model.meshInstances) { // Check if the model has mesh instances.
                model.meshInstances.forEach((meshInstance: any) => {
                    meshInstance.material = this.redMaterial; // Set the red material to each mesh instance.
                });
            }
        };

        // Attach the setupMaterial function to the load event of the health bar asset.
        assets.healthbar.on('load', setupMaterial);
        // If the asset is already loaded, apply the material immediately.
        if (assets.healthbar.resource) {
            setupMaterial();
        }
    }

    /**
     * Sets the initial scale and position of the health bar.
     */
    private setInitialScale() {
        const scaleWidth = 0.015; // Width scale factor.
        const scaleHeight = 0.05;  // Height scale factor.
        const scaleDepth = 0.015;   // Depth scale factor.
        
        // Set the local scale of the health bar entity.
        this.entity.setLocalScale(scaleWidth, scaleHeight, scaleDepth);
        // Position the health bar above the entity it represents.
        this.entity.setLocalPosition(0, 2.5, 0);
    }

    /**
     * Updates the health bar's scale based on current and maximum health.
     * @param currentHealth - The current health value.
     * @param maxHealth - The maximum health value.
     */
    updateHealth(currentHealth: number, maxHealth: number) {
        // Calculate the percentage of current health.
        const healthPercentage = currentHealth / maxHealth;
        // Update the scale of the health bar based on the health percentage.
        this.entity.setLocalScale(
            0.025 * healthPercentage, // Adjust width based on health percentage.
            0.05,                     // Keep height constant.
            0.025                     // Keep depth constant.
        );
    }

    /**
     * Destroys the health bar entity, cleaning up resources.
     */
    destroy() {
        this.entity.destroy(); // Remove the health bar entity from the scene.
    }
}
