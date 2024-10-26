export class stateMachine {
    private currentState: string; // Holds the current state of the state machine.
    private states: { [key: string]: () => void }; // Dictionary to store states and their associated actions.

    constructor(initialState: string) {
        this.currentState = initialState; // Sets the initial state.
        this.states = {}; // Initializes the states dictionary.
    }

    /**
     * Adds a new state to the state machine with a corresponding action.
     * 
     * @param name - Name of the state.
     * @param action - Action to execute when the state is active.
     */
    addState(name: string, action: () => void) {
        this.states[name] = action; // Stores the action for the specified state.
    }

    /**
     * Changes the current state to a new state and executes its action if it exists.
     * 
     * @param newState - The name of the state to switch to.
     */
    changeState(newState: string) {
        if (this.states[newState]) { // Checks if the new state exists.
            this.currentState = newState; // Updates the current state.
            this.states[newState](); // Executes the action for the new state.
        }
    }

    /**
     * Retrieves the current state of the state machine.
     * 
     * @returns The name of the current state.
     */
    getCurrentState() {
        return this.currentState; // Returns the active state name.
    }

    /**
     * Destroys the state machine by clearing all states and resetting the current state.
     */
    destroy() {
        this.states = {}; // Clears all states.
        this.currentState = ""; // Resets the current state.
    }
}
