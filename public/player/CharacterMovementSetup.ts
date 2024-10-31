    import * as pc from 'playcanvas';

    // Define common configuration settings for movement and camera
    export const MOVEMENT_CONFIG = {
        CHAR_SPEED: 20, 
        cameraPitch:0,                  // Character movement speed
        cameraYaw: 0,                      // Initial camera yaw angle
        CAMERA_OFFSET: new pc.Vec3(0, 2, -3), // Camera offset relative to character
        CAMERA_SENSITIVITY: 0.2,           // Camera movement sensitivity
        CROSSHAIR_DISTANCE: -2,            // Distance of the crosshair from the character
        INITIAL_CAMERA_PITCH: 15,          // Initial pitch angle for the camera
        MAX_CAMERA_PITCH: 60    ,              // Maximum pitch angle for camera rotation
        RAYCAST_DISTANCE: 200            // Raycast distance for detecting objects
    };

    // Define an interface for the character’s movement state
    export interface MovementState {
        isAttacking: boolean;              // True if character is attacking
        hasDealtDamage: boolean;           // Tracks if damage has been dealt in an attack
        isPointerLocked: boolean;          // True if pointer is locked (FPS control)
        isShooting: boolean;               // True if character is shooting
        isDragging: boolean;               // True if character is dragging an object
        cameraPitch: number;               // Current camera pitch angle
        lastMouseX: number;                // Last recorded mouse X position
        lastMouseY: number;       
        currentAmmo : number;         // Last recorded mouse Y position
        isAiming: boolean;    
        isReloading: boolean;             // True if character is aiming
        lastShotTime: number;              // Timestamp of the last shot fired
        shootingCooldown: number;  
        lastReloadTime: number;        // Cooldown period (ms) between shots
    }
    // Initialize the default state for the character’s movement and actions
    export const createInitialState = (): MovementState => ({
        isAttacking: false,
        hasDealtDamage: false,
        isPointerLocked: false,
        isShooting: false,
        isDragging: false,
        cameraPitch: MOVEMENT_CONFIG.INITIAL_CAMERA_PITCH,
        lastMouseX: 0,
        currentAmmo : 30,
        isReloading: false,
        lastMouseY: 0,
        isAiming: false,
        lastShotTime: 0,
        lastReloadTime: 0,
        shootingCooldown: 500               // Default cooldown time in milliseconds
    });

    export const AMMO_CONFIG = {
        MAX_AMMO: 30,
        RELOAD_TIME: 2000
    };

    // Initialize the character entity's physical and collision components
    export function initializeComponents(characterEntity: pc.Entity, assets: any) {
        // Add collision component if not already present
        if (!characterEntity.collision) {
            characterEntity.addComponent('collision', {
                type: 'capsule',            // Capsule shape for character collision
                radius: 0.5,                // Radius of the capsule
                height: 1,                  // Height of the capsule
                asset: characterEntity.model?.asset || assets.characterModel // Model asset
            });
        }

        // Add rigidbody component if not already present
        if (!characterEntity.rigidbody) {
            characterEntity.addComponent('rigidbody', {
                type: 'dynamic',            // Dynamic type allows for movement physics
                mass: 80,                   // Mass of the character
                linearDamping: 0.9,         // Slows down linear movement over time
                angularDamping: 0.9,        // Slows down rotation over time
                linearFactor: new pc.Vec3(1, 1, 1),  // Restricts movement in X, Y, Z
                angularFactor: new pc.Vec3(0, 1, 0)  // Restricts rotation on specific axes
            });
        }

        // Register collision event handler to log collision interactions
        characterEntity.collision?.on('collisionstart', (result) => {
            console.log('Player collided with:', result.other.name); // Log name of collided object
        });
    }
