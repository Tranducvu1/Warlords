import * as pc from 'playcanvas';

/**
 * Creates a colorful and detailed zombie battle map in the PlayCanvas application.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @returns {pc.Entity[]} entities - Array of created entities.
 */
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
        if (entity.model) {
            entity.model.material = material; // Set the material to the model
        }
        entity.tags.add('map');

        // Add collision component
        entity.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2),
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

    // Ground
    createEntity("Ground", "box", new pc.Vec3(0, 0, 0), new pc.Vec3(100, 0.1, 100), { r: 0.4, g: 0.5, b: 0.4 });

    // Zombie spawn points
    for (let i = -20; i <= 20; i += 10) {
        createEntity(`ZombieSpawnPoint${i}`, "box", new pc.Vec3(i, 0.5, 20), new pc.Vec3(1, 0.1, 1), { r: 0.3, g: 0.1, b: 0.1 });
    }

    // House
    const house = createEntity("House", "box", new pc.Vec3(0, 1.5, -10), new pc.Vec3(5, 5, 5), { r: 0.7, g: 0.5, b: 0.3 });

    // Roof (Pyramid)
    const roof = createEntity("Roof", "cone", new pc.Vec3(0, 5.5, -10), new pc.Vec3(5, 3, 5), { r: 0.9, g: 0.1, b: 0.1 });

    // Slide (Cube ramp)
    const slide = createEntity("Slide", "box", new pc.Vec3(10, 1.5, -10), new pc.Vec3(1, 0.5, 5), { r: 0.5, g: 0.5, b: 0.8 });
    slide.setEulerAngles(0, 0, 30); // Tilt the slide

    // Trees
    const trunkColor = { r: 0.6, g: 0.4, b: 0.2 };
    const foliageColor = { r: 0.1, g: 0.8, b: 0.1 };
    for (let i = -20; i < 21; i += 10) {
        const trunk = createEntity("TreeTrunk", "cylinder", new pc.Vec3(i, 1.5, 20), new pc.Vec3(1, 2, 1), trunkColor);
        createEntity("TreeFoliage", "sphere", new pc.Vec3(i, 4.5, 20), new pc.Vec3(3, 3, 3), foliageColor);
    }

    // Adding fences
    for (let i = -30; i <= 30; i += 10) {
        createEntity(`Fence${i}`, "box", new pc.Vec3(i, 1.5, -15), new pc.Vec3(0.2, 2, 2), { r: 0.7, g: 0.5, b: 0.3 });
    }

    // Adding tombstones (for the scary effect)
    createEntity("Tombstone1", "box", new pc.Vec3(-8, 1, -5), new pc.Vec3(1, 2, 0.5), { r: 0.4, g: 0.4, b: 0.4 });
    createEntity("Tombstone2", "box", new pc.Vec3(8, 1, -5), new pc.Vec3(1, 2, 0.5), { r: 0.4, g: 0.4, b: 0.4 });

    // Adding a small pond (water)
    const pond = createEntity("Pond", "cylinder", new pc.Vec3(-10, 0.1, -5), new pc.Vec3(2, 0.1, 3), { r: 0.1, g: 0.2, b: 0.8 });

    // Adding vehicles (cars)
    createEntity("Car1", "box", new pc.Vec3(5, 0.5, -15), new pc.Vec3(3, 0.5, 1), { r: 0.5, g: 0.1, b: 0.1 });
    createEntity("Car2", "box", new pc.Vec3(-5, 0.5, -15), new pc.Vec3(3, 0.5, 1), { r: 0.1, g: 0.1, b: 0.5 });

    // Adding zombies
    for (let i = -15; i <= 15; i += 10) {
        createEntity(`Zombie${i}`, "box", new pc.Vec3(i, 1.5, -10), new pc.Vec3(1, 1.5, 1), { r: 0.3, g: 0.8, b: 0.3 }); // Zombie green color
    }

    // Thêm ngôi đền
    const createTemple = (position: pc.Vec3) => {
        createEntity("TempleBase", "box", position, new pc.Vec3(10, 0.5, 10), { r: 0.9, g: 0.8, b: 0.1 });
        createEntity("TempleRoof", "cone", new pc.Vec3(position.x, position.y + 3, position.z), new pc.Vec3(10, 2, 10), { r: 0.8, g: 0.3, b: 0.1 });
    };

    // Tạo hai ngôi đền cách nhau 100 đơn vị
    createTemple(new pc.Vec3(-50, 0, -20));
    createTemple(new pc.Vec3(50, 0, -20));

    // Thêm ngôi mộ
    const createTombstone = (position: pc.Vec3) => {
        createEntity("Tombstone", "box", position, new pc.Vec3(1, 2, 0.5), { r: 0.4, g: 0.4, b: 0.4 });
    };

    // Tạo 100 ngôi mộ ngẫu nhiên trong khu vực
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 200 - 100; // Ngẫu nhiên trong khoảng -100 đến 100
        const z = Math.random() * -50; // Ngẫu nhiên trong khoảng -50 đến 0
        createTombstone(new pc.Vec3(x, 1, z)); // Đặt Y là 1
    }

    return entities;
}

/**
 * Updates the map entities.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {number} dt - Delta time for frame updates.
 * @param {pc.Entity[]} entities - Array of map entities.
 */
export function updateMap(app: pc.Application, dt: number, entities: pc.Entity[]) {
    entities.forEach(entity => {
        // Ensure collision component exists and is enabled
        if (!entity.collision) {
            entity.addComponent('collision', {
                type: entity.model?.type === 'sphere' ? 'sphere' : 'box',
                halfExtents: new pc.Vec3(
                    entity.getLocalScale().x / 2,
                    entity.getLocalScale().y / 2,
                    entity.getLocalScale().z / 2
                )
            });
        }
        // Additional update logic here if needed
    });
}
