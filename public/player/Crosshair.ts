import * as pc from "playcanvas";

/**
 * Initializes a crosshair entity in the PlayCanvas application.
 *
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {Object} assets - The assets required for the crosshair, including the model.
 * @returns {pc.Entity} The created crosshair entity.
 */
export function initializeCrosshairEntity(app, assets) {
    // Create a new entity for the crosshair
    const crosshairEntity = new pc.Entity("crosshair");

    // Add a model component to the crosshair entity using the specified asset
    crosshairEntity.addComponent("model", {
        type: "asset", // Specify that the model is an asset
        asset: assets.crosshair // Use the crosshair asset provided
    });

    // Set the local position of the crosshair entity in the 3D space
    crosshairEntity.setLocalPosition(2.5, 1.8, 1); // Position it slightly in front of the camera

    // Set the local scale of the crosshair entity to make it larger
    crosshairEntity.setLocalScale(2, 0.5, 2); // Scale to make the crosshair more visible

    // Rotate the crosshair entity to face the camera properly
    crosshairEntity.setLocalEulerAngles(90, 0, 0); // Rotate to align with the camera view

    // Add the crosshair entity to the root of the application
    app.root.addChild(crosshairEntity);

    // Return the created crosshair entity for further use
    return crosshairEntity;
}
