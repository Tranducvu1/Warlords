import * as pc from 'playcanvas';

export function createMap(app: pc.Application, assets: any) { 
    const mapEntity = new pc.Entity('mapEntity');

    mapEntity.addComponent('model', {
        type: 'asset',
        asset: assets.map
    });

    mapEntity.setLocalScale(100, 100, 100);
    mapEntity.setPosition(0, 0, 0);
    app.root.addChild(mapEntity);

    const model = mapEntity.model;

    if (model) {
        model.meshInstances.forEach((meshInstance) => {
            const collisionEntity = new pc.Entity('collision_' + meshInstance.node.name);
            const mesh = meshInstance.mesh; 
            if (mesh) {
                collisionEntity.addComponent('collision', {
                    type: 'mesh',
                    model: meshInstance
                });

                collisionEntity.addComponent('rigidbody', {
                    type: 'static',
                    restitution: 0.5,
                    friction: 0.6
                });

                collisionEntity.setLocalPosition(meshInstance.node.getLocalPosition());
                collisionEntity.setLocalScale(meshInstance.node.getLocalScale());
                app.root.addChild(collisionEntity);
            }
        });
    }
}