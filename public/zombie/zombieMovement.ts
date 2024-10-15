import * as pc from 'playcanvas';

export function addZombieMovement(EnemyEntity, assets, app) {
    let direction = 1; // 1 for right, -1 for left
    const zombieSpeed = 2; // Speed of the zombie movement
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
