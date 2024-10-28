import * as pc from 'playcanvas';

/**
 * Creates a light entity for the PlayCanvas application.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 */
export function createLight(app: pc.Application): void {
    // Create a new light entity
    const lightEntity = new pc.Entity('light');

    // Add a directional light component to the light entity
    lightEntity.addComponent("light", {
        type: "directional", // Directional light, similar to sunlight
        color: new pc.Color(1, 1, 1), // White light
        intensity: 1.0 // Increased intensity for brighter light
    });

    // Set the rotation angle of the light to illuminate the scene from a specific angle
    lightEntity.setLocalEulerAngles(45, 0, 0); // Rotate 45 degrees along the X-axis

    // Add the light entity to the application's root entity to make it part of the scene
    app.root.addChild(lightEntity);

    // Optional: create a soft, ambient light
    const lightColor = new pc.Color(1, 1, 1); // White color
    const lightIntensity = 0.5; // Increased intensity for ambient light
    const lightDistance = 20; // Increased distance the light affects

    // Create a point light for a soft effect
    const pointLight = new pc.Entity('pointLight');
    pointLight.addComponent('light', {
        type: 'point', // Point light
        color: lightColor,
        intensity: lightIntensity,
        range: lightDistance // Increased range of light effect
    });

    // Set position for the point light
    pointLight.setPosition(0, 5, 0); // Position of the point light

    // Add the point light to the root entity
    app.root.addChild(pointLight);
}
