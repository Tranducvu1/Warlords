// Ground.ts
import * as pc from 'playcanvas';

export function createGround(app: pc.Application): void {
    const ground = new pc.Entity('ground');
    ground.addComponent("render", {
        type: "box"
    });
    ground.setLocalScale(20, 0.5, 20);
    ground.setPosition(0, -0.25, 0);

    ground.rigidbody?.on('collisionstart', function (event) {
        console.log('Mặt đất va chạm với:', event.other.name);
    });
    app.root.addChild(ground);
}
