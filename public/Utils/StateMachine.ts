
export class stateMachine {
      private currentState: string;
      private states: { [key: string]: () => void };
  
      constructor(initialState: string) {
          this.currentState = initialState;
          this.states = {};
      }
  
      addState(name: string, action: () => void) {
          this.states[name] = action;
      }
  
      changeState(newState: string) {
          if (this.states[newState]) {
              this.currentState = newState;
              this.states[newState]();
          }
      }
  
      getCurrentState() {
          return this.currentState;
      }
      destroy() {
          this.states = {};
          this.currentState = "";
      }
  }
  