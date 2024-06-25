import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const LoggedUserProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);

    return (
        <GlobalStateContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);