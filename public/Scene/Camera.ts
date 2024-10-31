// Camera.ts
import * as pc from 'playcanvas';

/**
 * Creates a camera entity for the PlayCanvas application.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @returns {pc.Entity} The created camera entity.
 */

export function createCamera(app: pc.Application): pc.Entity {
    // Create a new entity named 'camera'
    const cameraEntity = new pc.Entity('camera');
    
    // Add a camera component to the entity with specified clear color
    cameraEntity.addComponent("camera", {
        clearColor: new pc.Color(0.7, 0.8, 0.9) // Light blue color for the camera background
    });
    
    // Add the camera entity to the application's root entity
    app.root.addChild(cameraEntity);
    
    // Return the created camera entity
    return cameraEntity;
}
