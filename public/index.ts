import * as pc from 'playcanvas';
import { createPlayer } from './player/Player';
import { createZombie } from './zombie/zombie';
import { createCamera } from './Scene/Camera';
import { createLight } from './Scene/Light';
import { createGround } from './Scene/Ground';
import { loadAssets } from './Utils/loadAssets';
import { createMap } from './Scene/Map';

// Cấu hình cho Ammo.js
pc.WasmModule.setConfig("Ammo", {
    fallbackUrl: "../Utils/ammo.js",
    glueUrl: "../Utils/ammo.wasm.js",
    wasmUrl: "../Utils/ammo.wasm.wasm",
});


window.onload = async () => {

    await new Promise((resolve) => {
        pc.WasmModule.getInstance("Ammo", resolve);
    });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;    
    if (canvas) {
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window)
        });

      
        const assets = await loadAssets(app);
        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
        assetListLoader.load(async () => {
            if (!canvas || !app) return; 

            // Tạo các thành phần của cảnh
            const cameraEntity = createCamera(app);
            createMap(app);
            createLight(app);
            createGround(app);
            createZombie(app, assets);
            createPlayer(app, assets, cameraEntity);
        });

       
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.start();
        
      
        app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5);
    } else {
        console.error("Canvas not found!");
    }
};
