// Weapon.js
import * as pc from 'playcanvas';

export function createWeapon(characterEntity, assets, rightHandBone) {
    const weaponHelper = new pc.Entity('weaponHelper');   
    characterEntity.addChild(weaponHelper);         

    const weaponModel = new pc.Entity('weaponModel');
    weaponModel.addComponent('model', {
        type: 'asset',
        asset: assets.weapon
    });
    
    weaponModel.setLocalPosition(-0.68, 0.7, 0);    
    weaponModel.setLocalEulerAngles(90, 90, 0); 
    weaponHelper.addChild(weaponModel);
    
    
    return weaponHelper;
}
