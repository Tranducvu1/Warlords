import * as pc from 'playcanvas';
import { createWeapon } from './createWeapon';

export function handleWeapon(characterEntity, assets, app) {
    const characterModel = characterEntity.model;
    
    if (characterModel?.meshInstances[0].skinInstance) {
        const skinInstance = characterModel.meshInstances[0].skinInstance;
        const rightHandBone = skinInstance.bones.find(bone => bone.name === 'mixamorig:RightHand');
        
        if (rightHandBone) {
            const weaponHelper = createWeapon(characterEntity, assets, rightHandBone);
            const muzzleFlashEntity = initializeMuzzleFlash(app, assets);
            
            app.on('update', () => {
                updateWeaponPosition(weaponHelper, rightHandBone);
            });
        } else {
            console.log("Không tìm thấy 'mixamorig:RightHand'.");
        }
    }
}

export function updateWeaponPosition(weaponHelper, rightHandBone) {
    const handPosition = rightHandBone.getPosition();
    const handRotation = rightHandBone.getRotation();

    weaponHelper.setLocalScale(0.4, 0.4, 0.4);
    weaponHelper.setPosition(handPosition);
    weaponHelper.setRotation(handRotation);
}

function initializeMuzzleFlash(app, assets) {
  
    const muzzleFlashEntity = new pc.Entity('muzzleFlash');
    muzzleFlashEntity.addComponent('model', {
        type: 'asset',
        asset: assets.muzzleFlash
    });
    app.root.addChild(muzzleFlashEntity);
    return muzzleFlashEntity;
}
