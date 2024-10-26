import * as pc from 'playcanvas';

export function createGround(app: pc.Application): void {
  
    const ground = new pc.Entity('ground');


    ground.addComponent("model", {
        type: "box"
    });

    
    ground.setLocalScale(100, 0.1, 100); 
    ground.setLocalPosition(0, 0, 0); 


    ground.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(50, 0.05, 50)
    });

    
    ground.addComponent("rigidbody", {
        type: "static", 
        friction: 0.5, 
        restitution: 0.1 
    });

  


    app.root.addChild(ground);
}
