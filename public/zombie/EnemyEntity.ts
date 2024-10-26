import * as pc from 'playcanvas'; 
export class EnemyEntity extends pc.Entity {
      health: number;
  
      constructor(name: string, health: number) {
          super(name); 
          this.health = health;
        //  this.state = stateMachine;
      }
  
      takeDamage(amount) {
          this.health -= amount;
          console.log(`${this.name} takes ${amount} damage. Health remaining: ${this.health}`);
          if (this.health <= 0) {
              this.die();
          }
      }
  
      die() {
          console.log(`${this.name} has died.`);
        
          this.destroy(); 
      }
  }