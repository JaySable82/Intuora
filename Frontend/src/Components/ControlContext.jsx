import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const ControlContext = createContext({});

export function ControlContextProvider({ children }) {
    const [kitchenActive, setKitchenActive] = useState(null);
    const url = import.meta.env.VITE_LOCAL;
    const firstRender = useRef(true); // Prevent first update

    useEffect(() => {
        async function fetchKitchenStatus() {
            try {
                const response = await axios.get(`${url}/kitchen-status`);
                console.log("Fetched kitchen status: ", response.data);
                setKitchenActive(response.data.kitchenActive); 
            } catch (err) {
                console.error("Error fetching kitchen status", err);
            }
        }
        fetchKitchenStatus();
    }, []);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false; // Skip first update
            return;
        }
        
        if (kitchenActive !== null) {
            console.log("UseEffect called from ControlContext: ", kitchenActive);

            async function updateKitchenStatus() {
                try {
                    const response = await axios.post(`${url}/kitchen-status/update`, {
                        kitchenActive: kitchenActive,
                    });
                    console.log("frontend: ", response.data);
                } catch (err) {
                    console.error("Error updating kitchen status", err);
                }
            }

            updateKitchenStatus();
        }
    }, [kitchenActive]);

    return (
        <ControlContext.Provider value={{ kitchenActive, setKitchenActive }}>
            {children}
        </ControlContext.Provider>
    );
}
