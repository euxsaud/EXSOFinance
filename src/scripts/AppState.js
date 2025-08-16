class AppState {
    /**
     *
     * @param {string} keyName | Key name for the app state, default is 'appState'
     * @param {string} eventName | Event name for the app state change, default is 'appStateChange'
     * @param {EventTarget} target | Target for the event, default is window
     */
    constructor(keyName = "appState", eventName = "appStateChange", target = window) {
        this.keyName = keyName;
        this.eventName = eventName;
        this.target = target;
    }

    /**
     * Get the current app state
     * @returns {Object} The current app state
     */
    getState() {
        const state = localStorage.getItem(this.keyName);
        return state ? JSON.parse(state) : {};
    }

    /**
     * Set the current app state
     * @param {Object} state - The new app state
     */
    setState(newState) {
        const oldState = this.getState();
        newState = { ...oldState, ...newState };
        localStorage.setItem(this.keyName, JSON.stringify(newState));

        const event = new CustomEvent(this.eventName, {
            detail: { oldState, newState },
        });
        this.target.dispatchEvent(event);
    }

    /**
     * Watch for changes to the app state
     * @param {(oldValue: object, newValue: object) => void} callback
     */
    watchState(callback) {
        this.target.addEventListener(this.eventName, (event) => {
            callback(event.detail.oldState, event.detail.newState);
        });
    }
}

const appState = new AppState();

export default appState;
export const watch = (callback) => appState.watchState(callback);
