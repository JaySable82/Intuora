import React, { createContext, useState } from "react";

const OrderContext=createContext({});

function OrderContextProvider({children}){
    const [tableNo_c,setTableNo_c]=useState(0);
    const [blockNo_c,setBlockNo_c]=useState(0);

    return (
        <OrderContext.Provider value={{tableNo_c,setTableNo_c,blockNo_c,setBlockNo_c}}>
            {children}
        </OrderContext.Provider>
    );
}

export {OrderContext,OrderContextProvider};