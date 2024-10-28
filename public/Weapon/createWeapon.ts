import * as pc from 'playcanvas';

/**
 * Attaches a weapon model to a character entity, positioning it correctly as a child object.
 * 
 * @param {pc.Entity} characterEntity - The main character entity to which the weapon will be attached.
 * @param {Record<string, pc.Asset>} assets - A dictionary of preloaded assets, including the weapon model.
 * @returns {pc.Entity} - The weapon helper entity, serving as the parent for the weapon model.
 */
export function createWeapon(characterEntity: pc.Entity, assets: Record<string, pc.Asset>): pc.Entity {
    
    // Create a helper entity to manage the weapon's position and rotation relative to the character.
    const weaponHelper = new pc.Entity('weaponHelper');   
    characterEntity.addChild(weaponHelper); // Attach helper to character to follow its movement.

    // Create the weapon model entity using the asset from the assets dictionary.
    const weaponModel = new pc.Entity('weaponModel');
    weaponModel.addComponent('model', {
        type: 'asset',
        asset: assets.weapon // Assign weapon asset, ensuring it matches the model key from assets.
    });

    // Position and rotate the weapon model relative to the helper.
    weaponModel.setLocalPosition(-0.68, 0.7, 0);    // Offset to align with character's hand.
    weaponModel.setLocalEulerAngles(90, 90, 0);     // Rotation to ensure weapon orientation matches character.

    // Add weapon model as a child of the weapon helper, allowing it to inherit transformations.
    weaponHelper.addChild(weaponModel);
    
    
    return weaponHelper; // Return the helper, which can be further manipulated or removed if needed.
}