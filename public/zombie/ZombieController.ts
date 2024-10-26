import * as pc from 'playcanvas';  

import { stateMachine } from '../Utils/StateMachine';
import { EnemyEntity } from './EnemyEntity';


export function createZombieEntity(app, assets, x, y, z) {
    const zombieEntity = new EnemyEntity('Zombie', 100);
    zombieEntity.tags.add('enemy');
    const health = 100; 
    zombieEntity.addComponent("model", {
        type: "asset",
        asset: assets.zombie 
    });

    zombieEntity.addComponent("animation", {
        assets: [assets.zombieIdle, assets.zombierunning, assets.zombieattack, assets.zombiedeath], 
    });
        
    zombieEntity.addComponent("rigidbody", {
        type: 'dynamic',
        mass: 80,
        linearDamping: 0.9,
        angularDamping: 0.9,
        linearFactor: new pc.Vec3(1, 1, 1),
        angularFactor: new pc.Vec3(0, 1, 0)  
    });

    zombieEntity.addComponent("collision", {
        type: 'capsule', 
        radius: 0.5,
        height: 1.6
    });

    zombieEntity.setLocalPosition(15, 0.05, 0);

    app.root.addChild(zombieEntity);
    return zombieEntity;
}