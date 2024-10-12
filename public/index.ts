    import * as pc from 'playcanvas';

    window.onload = () => {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        if (canvas) {
            const app = new pc.Application(canvas, {
                mouse: new pc.Mouse(canvas),
                touch: new pc.TouchDevice(canvas),
                keyboard: new pc.Keyboard(window)
            });

            app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            
            app.setCanvasResolution(pc.RESOLUTION_AUTO);
            app.start();

            // Set up scene
            app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5);

            // Create camera
            const cameraEntity = new pc.Entity('camera');
            cameraEntity.addComponent("camera", {
                clearColor: new pc.Color(0.7, 0.8, 0.9)
            });
            app.root.addChild(cameraEntity);

            // Create light
            const lightEntity = new pc.Entity('light');
            lightEntity.addComponent("light", {
                type: "directional",
                color: new pc.Color(1, 1, 1),
                intensity: 2
            });
            lightEntity.setLocalEulerAngles(45, 0, 0);
            app.root.addChild(lightEntity);

            // Create ground
            const ground = new pc.Entity('ground');
            ground.addComponent("render", {
                type: "box"
            });
            ground.setLocalScale(20, 0.5, 20);
            ground.setPosition(0, -0.25, 0);
            app.root.addChild(ground);

            // Load character model and animations
            const assets = {
                man: new pc.Asset('model_man', 'model', { url: '../model/idle.glb' }),
                idle: new pc.Asset('animation_idle', 'animation', { url: '../model/idle.glb' }),
                zombie: new pc.Asset('zombie','model',{url: '../model/zombie.glb'}),
                zombieIdle: new pc.Asset('animation_zombieidle','model',{url: '../animation/zombieidle.glb'}),
                zombierunning: new pc.Asset('animation_zombierunning','animation',{url: '../animation/zombierunning.glb'}),
                running: new pc.Asset('animation_running', 'animation', { url: '../animation/running.glb' }),
                shooting: new pc.Asset('animation_shooting', 'animation', { url: '../animation/shooting.glb' }),
                rifleaim: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifleaim.glb' }),
                riflewalk: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifle walk.glb' }),
                muzzle_flash: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/muzzle_flash.glb' }),
                weapon: new pc.Asset('model_ak', 'model', { url: '../model/ak.glb' }) 
            };

            const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
            assetListLoader.load(() => {
            
                const EnemyEntity = new pc.Entity("Enemy");
                app.root.addChild(EnemyEntity);
                EnemyEntity.addComponent("model", {
                    type: "asset",
                    asset: assets.zombie
                });
                const zombiesposition = 1;
                EnemyEntity.setLocalPosition(zombiesposition+3, zombiesposition -1, zombiesposition-1);

                
                EnemyEntity.addComponent("animation_zombie", {
                    assets: [assets.zombieIdle,assets.zombierunning]
                });

                const characterEntity = new pc.Entity("character");
                app.root.addChild(characterEntity);
                characterEntity.addComponent("model", {
                    type: "asset",
                    asset: assets.man
                });
                const scale = 0.01;
                characterEntity.setLocalPosition(scale, scale, scale);
                


                

                // Lấy skinInstance từ mô hình nhân vật
                const characterModel = characterEntity.model;
                if (characterModel && characterModel.meshInstances[0].skinInstance) {
                const skinInstance = characterModel.meshInstances[0].skinInstance;
                const bones = skinInstance.bones;

                // Tìm xương tay phải (RightHand)
                const rightHandBone = bones.find(bone => bone.name === 'mixamorig:RightHand');

                if (rightHandBone) {
                console.log("Tìm thấy xương tay phải:", rightHandBone.name);

                // Tạo helper object cho súng
                const weaponHelper = new pc.Entity('weaponHelper');

                // Gắn helper object vào nhân vật để theo dõi xương tay phải
                characterEntity.addChild(weaponHelper);
                    
                // muzzlesEntity.addComponent("animation_muzzle", {
                //     assets: [assets.muzzle_flash]
                // });
        

                // Gắn súng vào helper object
                const weaponModel = new pc.Entity('weaponModel');
                weaponModel.addComponent('model', {
                    type: 'asset',
                    asset: assets.weapon // Asset của mô hình súng
                });

                // Điều chỉnh vị trí và góc của súng để khớp với bàn tay
                weaponModel.setLocalPosition(-0.58, 0.7, 0.1); // Điều chỉnh vị trí cho phù hợp
                weaponModel.setLocalEulerAngles(90, 90, 0); // Điều chỉnh góc xoay nếu cần
                // Gắn súng vào helper
                // Create muzzle flash entity
                const muzzlesEntity = new pc.Entity("muzzleFlash");
                muzzlesEntity.addComponent("animation_muzle", {
                    assets: [assets.muzzle_flash]
                });
                weaponModel.setLocalPosition(-0.68, 0.7, 0);
                
                weaponHelper.addChild(weaponModel);
                // Cập nhật vị trí và góc của helper theo xương tay phải
                app.on('update', () => {
                    // Lấy vị trí và hướng của xương tay phải
                    const handPosition = rightHandBone.getPosition();
                    const handRotation = rightHandBone.getRotation();
                    weaponHelper.setLocalScale(0.4,0.4,0.4)
                    // Cập nhật vị trí và hướng của helper để súng luôn gắn với tay
                    weaponHelper.setPosition(handPosition);
                    weaponHelper.setRotation(handRotation);
                });
            } else {
                console.log("Không tìm thấy xương 'mixamorig:RightHand'.");
            }
        }
                // Add animation component
                characterEntity.addComponent("animation", {
                    assets: [assets.idle, assets.running, assets.shooting, assets.rifleaim]
                });
                let currentAnim = assets.idle.name;

                // Set up character keyboard
                const charMovement = new pc.Vec3();
                const charSpeed = 5;
                const keyboard = new pc.Keyboard(document.body);

                // Variables for mouse movement
                let isDragging = false;
                let cameraYaw = 0;
                let cameraPitch = 15;  // Pitch camera slightly down
                let lastMouseX = 0;
                let lastMouseY = 0;
                const sensitivity = 0.2;
                let isShooting = false; // Variable to track shooting state

                // Mouse down event to start shooting
                if (app.mouse) {
                    app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
                        // Khi nhấn chuột, phát hoạt ảnh bắn nếu đang idle hoặc rifleaim
                        if ((currentAnim === assets.idle.name || currentAnim === assets.rifleaim.name) && !isShooting) {
                            characterEntity.animation?.play(assets.shooting.name, 0.2);
                            currentAnim = assets.shooting.name;
                            isShooting = true;
                            console.log("Mouse down: Shooting started");

                            
                        }
                    });

                    // Mouse up event to stop shooting
                    app.mouse.on(pc.EVENT_MOUSEUP, () => {
                    
                        if (isShooting) {
                            if (currentAnim === assets.shooting.name) {
                                // muzzlesEntity.animation?.play(assets.muzzle_flash.name, 0);
                                // if( muzzlesEntity.animation?.play){
                                //     console.log("muzzle play")
                                // }
                                characterEntity.animation?.play(currentAnim === assets.rifleaim.name ? assets.rifleaim.name : assets.idle.name, 0.2);
                                currentAnim = currentAnim === assets.rifleaim.name ? assets.rifleaim.name : assets.idle.name;
                            }
                            isShooting = false;
                            console.log("Mouse up: Stopped shooting");
                        }
                    });

                    // Mouse move event to rotate the camera when dragging
                    app.mouse.on(pc.EVENT_MOUSEMOVE, (event) => {
                        if (isDragging) {
                            const dx = event.x - lastMouseX;
                            const dy = event.y - lastMouseY;

                            // Update yaw (horizontal rotation) and pitch (vertical rotation)
                            cameraYaw -= dx * sensitivity;
                            cameraPitch -= dy * sensitivity;

                            // Clamp the pitch to prevent flipping over
                            cameraPitch = pc.math.clamp(cameraPitch, -45, 45);

                            lastMouseX = event.x;
                            lastMouseY = event.y;
                        }
                    });
                }

                // Mouse down event to start dragging
                app.mouse?.on(pc.EVENT_MOUSEDOWN, (event) => {
                    isDragging = true;
                    lastMouseX = event.x;
                    lastMouseY = event.y;
                });

                // Mouse up event to stop dragging
                app.mouse?.on(pc.EVENT_MOUSEUP, () => {
                    isDragging = false;
                });

                // Keyboard event for aiming
                keyboard.on(pc.EVENT_KEYDOWN, (event) => {
                    if (event.key === pc.KEY_Q) {
                        characterEntity.animation?.play(assets.rifleaim.name, 0.1);
                        currentAnim = assets.rifleaim.name;
                        console.log("Key Q pressed: Aiming with rifle");

                        
                    }
                });

                keyboard.on(pc.EVENT_KEYUP, (event) => {
                    if (event.key === pc.KEY_Q) {
                        if (currentAnim === assets.rifleaim.name) {
                            characterEntity.animation?.play(assets.idle.name, 0.1);
                            currentAnim = assets.idle.name;
                            console.log("Key Q released: Back to idle");
                        }
                    }
                });

                app.on("update", (dt) => {
                    
                    characterEntity.animation?.play(assets.muzzle_flash.name, 0.1);
                    
                    // Handle character movement
                    if (keyboard.isPressed(pc.KEY_W)) {
                        charMovement.z = +charSpeed * dt;
                    }
                    if (keyboard.isPressed(pc.KEY_S)) {
                        charMovement.z = -charSpeed * dt;
                    }
                    if (keyboard.isPressed(pc.KEY_A)) {
                        charMovement.x = +charSpeed * dt;
                    }
                    if (keyboard.isPressed(pc.KEY_D)) {
                        charMovement.x = -charSpeed * dt;
                    }

                    // Rotate movement direction based on camera yaw
                    const movementQuat = new pc.Quat().setFromEulerAngles(0, cameraYaw, 0);
                    movementQuat.transformVector(charMovement, charMovement);
                    characterEntity.translate(charMovement);
                    // Rotate the character to face the direction of movement, if it is moving
                    if (charMovement.length() > 0) {
                        const angle = Math.atan2(charMovement.x, charMovement.z);
                        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
                    }
                    charMovement.set(0, 0, 0);
                    // Update the animation for movement
                    const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
                    if (moved && currentAnim === assets.idle.name) {
                        characterEntity.animation?.play(assets.running.name, 0.1);
                        currentAnim = assets.running.name;
                    } else if (!moved && currentAnim === assets.running.name) {
                        characterEntity.animation?.play(assets.idle.name, 0.1);
                        currentAnim = assets.idle.name;
                    }             

                const charPosition = characterEntity.getPosition();
                const cameraOffset = new pc.Vec3(-0.1, 1.6, 0.5); // Đặt camera ở vị trí mong muốn
                const cameraPosition = new pc.Vec3().add2(charPosition, cameraOffset);
                cameraEntity.setPosition(cameraPosition);

                // Tính toán vector hướng ra ngoài
                const forwardVector = new pc.Vec3(0, 0, -1); // Hướng ra trước (có thể điều chỉnh)
                const cameraDirection = new pc.Vec3().add2(cameraPosition, forwardVector);

                // Cập nhật hướng của camera
                cameraEntity.setEulerAngles(0, Math.atan2(cameraDirection.x - cameraPosition.x, cameraDirection.z - cameraPosition.z) * (180 / Math.PI), 0);

                });
            });
        }
    };

