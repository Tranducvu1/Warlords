import * as  pc from "playcanvas";




export function initializeCrosshairEntity(app, assets) {
      const crosshairEntity = new pc.Entity("crosshair");
      crosshairEntity.addComponent("model", {
          type: "asset",
          asset: assets.crosshair
      });
  
      crosshairEntity.setLocalPosition(2.5, 1.8, 1);
      crosshairEntity.setLocalScale(2, 0.5, 2);
      crosshairEntity.setLocalEulerAngles(90, 0, 0);
  
      app.root.addChild(crosshairEntity);
  
      return crosshairEntity;
  }
  