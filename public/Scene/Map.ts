import * as pc from 'playcanvas';

export function createMap(app: pc.Application) {
    app.start();

    const entities: pc.Entity[] = []; 

    // Helper function to create basic entity with model and collision
    const createEntity = (name: string, shape: string, position: pc.Vec3, scale: pc.Vec3, color: { r: number, g: number, b: number }) => {
        const entity = new pc.Entity(name);

        entity.addComponent('model', { type: shape });

        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(color.r, color.g, color.b);
        material.update(); 
        entity.tags.add('map');
        // Add collision component
        entity.addComponent('collision', {
            type: 'box', 
            halfExtents: new pc.Vec3(scale.x, scale.y, scale.z) ,
            group: 1,
            mask: 2 
        });
        
        // Add rigidbody component for physics
        entity.addComponent('rigidbody', {
            type: 'static' // or 'dynamic' depending on your needs
        });

        entity.setLocalPosition(position.x, position.y, position.z);
        entity.setLocalScale(scale.x, scale.y, scale.z);
       
        app.root.addChild(entity);
        entities.push(entity);
       
        return entity;
    };


    

    // House
    const house = createEntity("House", "box", new pc.Vec3(0, 1, -10), new pc.Vec3(5, 5, 5), { r: 0.7, g: 0.5, b: 0.3 });

    // Roof (Pyramid)
    const roof = createEntity("Roof", "cone", new pc.Vec3(0, 4.5, -10), new pc.Vec3(5, 3, 5), { r: 0.9, g: 0.1, b: 0.1 });

    // Slide (Cube ramp)
    const slide = createEntity("Slide", "box", new pc.Vec3(10, 1, -10), new pc.Vec3(1, 0.5, 5), { r: 0.5, g: 0.5, b: 0.8 });
    slide.setEulerAngles(0, 0, 30); // Tilt the slide

    // Trees
    const trunkColor = { r: 0.6, g: 0.4, b: 0.2 };
    const foliageColor = { r: 0.1, g: 0.8, b: 0.1 };
    for (let i = -20; i < 21; i += 10) {
        const trunk = createEntity("TreeTrunk", "cylinder", new pc.Vec3(i, 1, 20), new pc.Vec3(1, 2, 1), trunkColor);
        createEntity("TreeFoliage", "sphere", new pc.Vec3(i, 4, 20), new pc.Vec3(3, 3, 3), foliageColor);
    }

    // Cubes
    createEntity("Cube1", "box", new pc.Vec3(-5, 0.5, -5), new pc.Vec3(2, 2, 2), { r: 0.2, g: 0.2, b: 0.7 });
    createEntity("Cube2", "box", new pc.Vec3(5, 0.5, 5), new pc.Vec3(2, 2, 2), { r: 0.7, g: 0.2, b: 0.2 });

    return entities; 
}

export function updateMap(app: pc.Application, dt: number, entities: pc.Entity[]) {
    entities.forEach(entity => {
        // Ensure collision component exists and is enabled
        if (!entity.collision) {
            entity.addComponent('collision', {
                type: entity.model?.type === 'sphere' ? 'cone' : 'box',
                halfExtents: new pc.Vec3(
                    entity.getLocalScale().x / 2,
                    entity.getLocalScale().y / 2,
                    entity.getLocalScale().z / 2
                )
            });
        }
        
        // Ensure rigidbody exists and is enabled
        if (!entity.rigidbody) {
            entity.addComponent('rigidbody', {
                type: 'static',
                friction: 0.5,
                restitution: 0.5
            });
        }

        // Update collision shapes based on current scale
        if (entity.collision) {
            entity.collision.halfExtents = new pc.Vec3(
                entity.getLocalScale().x / 2,
                entity.getLocalScale().y / 2,
                entity.getLocalScale().z / 2
            );
        }
    });
}

