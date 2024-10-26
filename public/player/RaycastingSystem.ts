import * as pc from "playcanvas";

export function setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets) {
    let isShooting = false;

    app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
        if ((playerStateMachine.getCurrentState() === "runningshooting" || playerStateMachine.getCurrentState() === "rifleaim") && !isShooting) {
            playerStateMachine.changeState("shooting");
            const from = cameraEntity.getPosition();
            const forward = cameraEntity.forward.clone();
            const distance = 100;
            const to = new pc.Vec3().add2(from, forward.mulScalar(distance));
            const result = app.systems.rigidbody.raycastFirst(from, to);

            if (result?.entity) {
               
                if (result.entity.tags.has("enemy")) {
                    if (result.entity.health !== undefined) {
                        result.entity.health -= 10; 
                        console.log(`Enemy hit! Remaining health: ${result.entity.health}`);
                        if (result.entity.health <= 0) {
                            result.entity.destroy();
                            console.log("Enemy destroyed!");
                        }
                        showHitEffect(result.entity); 
                    }
                } else {

                    console.log("Hit something that is not an enemy.");
                }
            }
        }
    });
}

// Hàm để hiện hiệu ứng khi trúng kẻ thù
function showHitEffect(enemyEntity) {
    // Có thể tạo hiệu ứng hoặc thông báo gì đó ở đây
    console.log(`Hit effect shown for: ${enemyEntity.name}`);
}
