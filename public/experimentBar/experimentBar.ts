import * as pc from 'playcanvas';
// Class to create and manage an experience bar for a character
export class experimentBar {
    entity: pc.Entity; // Entity representing the fill portion of the experience bar
    private fillMaterial: pc.StandardMaterial; // Material for the fill portion
    private backgroundEntity: pc.Entity; // Entity representing the background of the experience bar
    private backgroundMaterial: pc.StandardMaterial; // Material for the background
    // Define consistent scale constants for the experience bar
    private readonly BASE_WIDTH = 0.025;
    private readonly BASE_HEIGHT = 0.05;
    private readonly BASE_DEPTH = 0.025;
    
    // Constructor to initialize the experience bar and its components
    constructor(app: pc.Application, assets: any) {
        // Create main entity for the fill bar
        this.entity = new pc.Entity('experiencebar-fill');
        
        // Create background entity
        this.backgroundEntity = new pc.Entity('experiencebar-background');
        
        // Initialize materials for both fill and background
        this.fillMaterial = this.createFillMaterial();
        this.backgroundMaterial = this.createBackgroundMaterial();
        
        // Set up the model for both entities
        this.setupModel(assets, this.entity, this.fillMaterial);
        this.setupModel(assets, this.backgroundEntity, this.backgroundMaterial);
        
        // Set initial positions and scales for the entities
        this.setInitialScale();
        
        // Add the background as a child of the main entity
        this.entity.addChild(this.backgroundEntity);
    }

    // Method to create the material for the fill portion of the experience bar
    private createFillMaterial(): pc.StandardMaterial {
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 1, 1); // Set color to bright blue
        material.ambient = new pc.Color(1, 1, 1); // Set ambient color to match diffuse
        material.opacity = 1; // Fully opaque
        material.blendType = pc.BLEND_NORMAL; // Set blend type for rendering
        material.useLighting = false; // Disable lighting effects
        material.cull = pc.CULLFACE_NONE; // Disable backface culling
        material.update(); // Update the material to apply changes
        return material; // Return the created material
    }

    // Method to create the material for the background of the experience bar
    private createBackgroundMaterial(): pc.StandardMaterial {
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(0.2, 0.2, 0.2, 0.5); // Set color to semi-transparent dark gray
        material.ambient = new pc.Color(0.2, 0.2, 0.2, 0.5); // Set ambient color to match diffuse
        material.opacity = 0.5; // Semi-transparent
        material.blendType = pc.BLEND_NORMAL; // Set blend type for rendering
        material.useLighting = false; // Disable lighting effects
        material.cull = pc.CULLFACE_NONE; // Disable backface culling
        material.update(); // Update the material to apply changes
        return material; // Return the created material
    }

    // Method to set up the model for a target entity using the provided material
    private setupModel(assets: any, targetEntity: pc.Entity, material: pc.StandardMaterial) {
        // Add a model component to the entity using the health bar asset
        targetEntity.addComponent('model', {
            type: 'asset',
            asset: assets.healthbar // Use the health bar asset
        });

        // Function to set the material of the model mesh instances
        const setupMaterial = () => {
            const model = targetEntity.model; // Get the model of the entity
            if (model && model.meshInstances) {
                model.meshInstances.forEach((meshInstance: any) => {
                    meshInstance.material = material; // Apply the specified material to each mesh instance
                });
            }
        };

        // Set up the material once the health bar asset is loaded
        assets.healthbar.on('load', setupMaterial);
        if (assets.healthbar.resource) {
            setupMaterial(); // If the resource is already loaded, set up the material immediately
        }
    }

    // Method to set the initial scale and position of the experience bar components
    private setInitialScale() {
        // Set the scale for the background (empty bar) to full width
        this.backgroundEntity.setLocalScale(
            this.BASE_WIDTH, // Set full width
            this.BASE_HEIGHT - 0.02, // Set height slightly reduced
            this.BASE_DEPTH - 0.01 // Set depth slightly reduced
        );
        this.backgroundEntity.setLocalPosition(0, 0, 0); // Set initial position for background

        // Set the fill bar initial scale to start empty
        this.entity.setLocalScale(0.001, this.BASE_HEIGHT - 0.02, this.BASE_DEPTH - 0.01);
        this.entity.setLocalPosition(2, 2.7, 0); // Position to align with the character
    }

    // Method to update the experience bar scale based on current and maximum experience
    updateExperience(currentExperience: number, maxExperience: number) {
        const experiencePercentage = currentExperience / maxExperience; // Calculate experience percentage

        // Update the fill bar scale based on experience percentage
        this.entity.setLocalScale(
            this.BASE_WIDTH * experiencePercentage, // Set width based on percentage
            this.BASE_HEIGHT - 0.02, // Maintain constant height
            this.BASE_DEPTH - 0.01 // Maintain constant depth
        );
        const fillColor = new pc.Color(0,0, experiencePercentage * 10); // Calculate fill color
        this.fillMaterial.diffuse = fillColor; // Update fill color
        this.fillMaterial.ambient = fillColor; // Update ambient color
        this.fillMaterial.update(); // Update the material to apply changes

        // Calculate the new position to anchor the fill bar from the left
        const newX = -2.5 + (this.BASE_WIDTH * experiencePercentage) / 2; // Calculate new X position
        this.entity.setLocalPosition(newX, 1.4, -4); // Update position of the fill bar
    }

    // Method to destroy the experience bar and its components
    destroy() {
        this.backgroundEntity.destroy(); // Remove the background entity
        this.entity.destroy(); // Remove the fill entity
    }
}
