import * as pc from 'playcanvas';

// Create zombie
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

    EnemyEntity.addComponent("rigidbody", {
        type: 'static'
    });

    EnemyEntity.addComponent("collision", {
        type: 'box',
        halfExtents: new pc.Vec3(0.5, 1, 0.5)
    });

    let direction = 1; // 1 for right, -1 for left
    const zombieSpeed = 2; // Speed of the zombie movement
    EnemyEntity.health = 100;

    const maxPositionX = 10; // Max x
    const minPositionX = -10; // Min x

    app.on('update', (dt) => {
        const position = EnemyEntity.getLocalPosition(); 
        const targetPositionX = position.x + (direction * zombieSpeed * dt);

        if (targetPositionX > maxPositionX) {
            direction = -1; 
            EnemyEntity.setLocalEulerAngles(0, -90, 0);
            EnemyEntity.animation?.play(assets.zombierunning.name, 0.1); 
        } else if (targetPositionX < minPositionX) {
            direction = 1; 
            EnemyEntity.setLocalEulerAngles(0, 90, 0);
            EnemyEntity.animation?.play(assets.zombierunning.name, 0.1); 
        }

        position.x = targetPositionX; 
        EnemyEntity.setLocalPosition(position);
    });
}
