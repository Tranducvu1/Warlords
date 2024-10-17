import * as pc from 'playcanvas';

export function createMap(app: pc.Application, assets: any) {
    const mapEntity = new pc.Entity('mapEntity');

   
    mapEntity.addComponent('model', {
        type: 'asset',
        asset: assets.map
    });

    mapEntity.addComponent('collision', {
        type: 'box',
        halfExtents: new pc.Vec3(50, 1, 50) 
    });

    mapEntity.setLocalScale(100, 100, 100);
    mapEntity.setPosition(0, 0, 0);
    app.root.addChild(mapEntity);
}
