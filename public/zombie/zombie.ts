import * as pc from 'playcanvas'; 
import { addZombieMovement } from './zombieMovement'; 
import { stateMachine } from './StateMachine';

export function createZombie(app, assets) {
    const EnemyEntity = new pc.Entity("Enemy");
    EnemyEntity.tags.add('enemy');
    app.root.addChild(EnemyEntity);
    
    EnemyEntity.addComponent("model", {
        type: "asset",
        asset: assets.zombie
    });

    const zombiesposition = 1;
    EnemyEntity.setLocalPosition(zombiesposition + 3, zombiesposition - 1, zombiesposition - 1);

    EnemyEntity.addComponent("animation", {
        assets: [assets.zombieIdle, assets.zombierunning]
    });
    
    const zombieStateMachine = new stateMachine("idle");

    zombieStateMachine.addState("idle" ,() => {
        EnemyEntity.animation?.play(assets.zombieIdle.name, 0.2);
    });
    
    zombieStateMachine.addState("running" ,() => {
        EnemyEntity.animation?.play(assets.zombierunning.name, 0.2);
    });
    
    zombieStateMachine.addState("death" ,() => {
        EnemyEntity.animation?.play(assets.zombieDeath.name, 0.2); // Thêm hoạt ảnh chết nếu cần
    });

    EnemyEntity.addComponent("rigidbody", {
        type: 'static'
    });

    EnemyEntity.addComponent("collision", {
        type: 'box',
        halfExtents: new pc.Vec3(0.5, 1, 0.5)
    });

    EnemyEntity.health = 100;

    // Gọi hàm chuyển động
    addZombieMovement(EnemyEntity, assets, app);
}
