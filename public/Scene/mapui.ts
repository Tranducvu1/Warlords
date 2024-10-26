// import * as pc from 'playcanvas';

// export function createMapUI(app: pc.Application, assets: any) {
//     const mapEntity = new pc.Entity('mapEntity');

//     // Add model component to the map entity
//     mapEntity.addComponent('model', {
//         type: 'asset',
//         asset: assets.map
//     });

//     // Add collision component
//     mapEntity.addComponent('collision', {
//         type: 'box',
//         halfExtents: new pc.Vec3(50, 1, 50) 
//     });

//     // Add rigid body component for physics
//     mapEntity.addComponent('rigidbody', {
//         type: 'static', // You can use 'dynamic' if you want it to respond to physics
//         friction: 0.5,
//         restitution: 0.5
//     });

//     // Set the scale and position of the map entity
//     mapEntity.setLocalScale(100, 100, 100);
//     mapEntity.setPosition(0, 0, 0);

//     // Add the map entity to the application's root
//     app.root.addChild(mapEntity);
// }
