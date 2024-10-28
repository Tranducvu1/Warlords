import * as pc from 'playcanvas';
import { createWeapon } from './createWeapon';

/**
 * Handles weapon setup and updates for a character entity in the game.
 * 
 * @param characterEntity - The character entity to attach the weapon to.
 * @param assets - The assets required for the weapon.
 * @param app - The PlayCanvas application instance.
 */
export function handleWeapon(characterEntity, assets, app) {
    const characterModel = characterEntity.model;

    // Check if the character model has a skinned instance for attaching to specific bones.
    if (characterModel?.meshInstances[0].skinInstance) {
        const skinInstance = characterModel.meshInstances[0].skinInstance;

        // Locate the 'RightHand' bone to attach the weapon.
        const rightHandBone = skinInstance.bones.find(bone => bone.name === 'mixamorig:RightHand');

        if (rightHandBone) {
            const weaponHelper = createWeapon(characterEntity, assets); // Create the weapon and attach to character.

            // Update weapon position relative to the right hand bone on each frame.
            app.on('update', () => {
                updateWeaponPosition(weaponHelper, rightHandBone);
            });
        } else {
            console.log("Right hand bone 'mixamorig:RightHand' not found."); // Log if the bone is missing.
        }
    }
}

/**
 * Updates the position and rotation of the weapon to align with the specified hand bone.
 * 
 * @param weaponHelper - The helper entity for positioning the weapon.
 * @param rightHandBone - The bone entity of the right hand to align with.
 */
export function updateWeaponPosition(weaponHelper, rightHandBone) {
    const handPosition = rightHandBone.getPosition(); // Get hand bone position.
    const handRotation = rightHandBone.getRotation(); // Get hand bone rotation.

    // Set weapon scale, position, and rotation to match the hand bone.
    weaponHelper.setLocalScale(0.4, 0.4, 0.4);
    weaponHelper.setPosition(handPosition);
    weaponHelper.setRotation(handRotation);
}

