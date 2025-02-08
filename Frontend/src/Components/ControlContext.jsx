import React,{Children, createContext,useContext, useState} from "react";

export const ControlContext=createContext({});

export function ControlContextProvider({children}){
    const [kitchenActive,setKitchenActive] = useState(true) //set as per the other code

    //admin logout check
    // add code here in use-effect

    return(
        <ControlContext.Provider value={{kitchenActive,setKitchenActive}}>
            {children}
        </ControlContext.Provider>
    )
}