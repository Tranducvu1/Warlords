import * as pc from "playcanvas";

let isShooting = false;
export function setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets) {
      app.mouse.on(pc.EVENT_MOUSEDOWN, (event) => {
          if ((playerStateMachine.getCurrentState() === "idle" || playerStateMachine.getCurrentState() === "rifleaim") && !isShooting) {
              playerStateMachine.changeState("shooting");
              const from = cameraEntity.getPosition();
              const forward = cameraEntity.forward.clone();
              const distance = 100;
              const to = new pc.Vec3().add2(from, forward.mulScalar(distance));
              const result = app.systems.rigidbody.raycastFirst(from, to);
  
              if (result?.entity?.health !== undefined) {
                  result.entity.health -= 10;
                  console.log(`Enemy health: ${result.entity.health}`);
                  if (result.entity.health <= 0) {
                      result.entity.destroy();
                  }
              }
          }
      });
  }
  