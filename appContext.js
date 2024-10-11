import React, { createContext, useState } from 'react';

// Create Context
export const AppContext = createContext();

// Create a Provider Component
export const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({ user: null });

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    );
};
