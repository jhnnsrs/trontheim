export class ReducerRegistry {
    constructor() {
        this._emitChange = null;
        this._reducers = {};
    }

    getReducers() {
        return { ...this._reducers };
    }

    register(name, reducer) {
        this._reducers = { ...this._reducers, [name]: reducer };
        if (this._emitChange) {
            this._emitChange(this.getReducers());
        }
    }

    unregister(name) {
        const newReducers = Object.keys(this._reducers).reduce((object, key) => {
            if (key !== name) {
                object[key] = this._reducers[key]
            }
            else object[key] = (state = null) => state
            return object
        }, {})

        console.log(newReducers)
        console.log(this._reducers)

        this._reducers = { ...newReducers}
        if (this._emitChange) {
            this._emitChange(this.getReducers());
        }
    }

    setChangeListener(listener) {
        this._emitChange = listener;
    }
}

const reducerRegistry = new ReducerRegistry();

export default reducerRegistry;