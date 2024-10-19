import * as pc from 'playcanvas';  
import { addZombieMovement } from './zombieMovement'; 
import { stateMachine } from '../Utils/StateMachine';
import { createZombieStateMachine } from './zombiestateMachine';

export function createZombie(app, assets) {
    const EnemyEntity = new pc.Entity("Enemy");
    EnemyEntity.tags.add('enemy');
    app.root.addChild(EnemyEntity);
    
    EnemyEntity.addComponent("model", {
        type: "asset",
        asset: assets.zombie // Đảm bảo asset đã được tải
    });

    const zombiesposition = 0;
    EnemyEntity.setLocalPosition(zombiesposition, zombiesposition, zombiesposition);

    EnemyEntity.addComponent("animation", {
        assets: [assets.zombieIdle, assets.zombierunning] // Kiểm tra xem các asset animation đã được tải
    });
    
    const zombieStateMachine = createZombieStateMachine(EnemyEntity, assets);
    
    EnemyEntity.addComponent("rigidbody", {
        type: 'dynamic',
        mass: 50
    });

    EnemyEntity.addComponent("collision", {
        type: 'capsule',
        halfExtents: new pc.Vec3(0.5, 1, 0.5)
    });

    addZombieMovement(EnemyEntity, assets, app);
    
    console.log('Zombie created:', EnemyEntity);

    return EnemyEntity; 
}
