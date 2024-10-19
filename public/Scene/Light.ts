    // Light.ts
    import * as pc from 'playcanvas';

    export function createLight(app: pc.Application): void {
        const lightEntity = new pc.Entity('light');
        lightEntity.addComponent("light", {
            type: "directional",
            color: new pc.Color(1, 1, 1),
            intensity: 2
        });
        lightEntity.setLocalEulerAngles(45, 0, 0);
        app.root.addChild(lightEntity);
    }
