import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        () => {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        }
    );

    const [admin, setAdmin] = useState(() => {
        const savedAdmin = localStorage.getItem('admin');
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    });
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedAdmin = localStorage.getItem("admin");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const loginAdmin = (adminData) => {
        setAdmin(adminData);
        localStorage.setItem("admin", JSON.stringify(adminData));
    };
    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem("admin");
    };

    // store location
    const [authcontextlocation, setLocation] = useState(() => {
        const savedLocation = localStorage.getItem('location');
        return savedLocation ? JSON.parse(savedLocation) : null;
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            setLocation(JSON.parse(storedLocation));
        }
    }
    , []);
    const setUserLocation = (locationData) => {
        setLocation(locationData);
        localStorage.setItem("location", JSON.stringify(locationData));
    };
    // const clearUserLocation = () => {
    //     setLocation(null);
    //     localStorage.removeItem("location");
    // };


    return (
        <AuthContext.Provider value={{ user, login, logout, setUser, admin, loginAdmin, logoutAdmin, login, setUserLocation, authcontextlocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
