import * as pc from 'playcanvas';

export function initializeCharacterEntity(app, assets) {
    app.start();
    const characterEntity = new pc.Entity("character");
    characterEntity.tags.add('player');
    app.root.addChild(characterEntity);

    characterEntity.addComponent("model", {
        type: "asset",
        asset: assets.man
    });

    characterEntity.setLocalPosition(0, 0, 0);

    characterEntity.addComponent("rigidbody", {
        type: 'dynamic', 
        mass: 80,
        linearDamping: 0.9,
        angularDamping: 0.9
    });

    characterEntity.addComponent("collision", {
        type: 'capsule', 
        radius: 0.5,
        height: 1
    });
   
    console.log('Player Components:', {
        model: characterEntity.model,
        rigidbody: characterEntity.rigidbody,
        collision: characterEntity.collision
    });
    app.root.addChild(characterEntity);
    return characterEntity;
}
