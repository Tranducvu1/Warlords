// Camera.ts
import * as pc from 'playcanvas';

export function createCamera(app: pc.Application): pc.Entity {
    const cameraEntity = new pc.Entity('camera');
    cameraEntity.addComponent("camera", {
        clearColor: new pc.Color(0.7, 0.8, 0.9)
    });
    app.root.addChild(cameraEntity);
    return cameraEntity;
}

