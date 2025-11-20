import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chatSlice.js';
import authReducer from './authSlice.js';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'] // Only persist auth state
};

// Combine reducers
const rootReducer = combineReducers({
    chat: chatReducer,
    auth: authReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
});

export const persistor = persistStore(store);

export default store;
