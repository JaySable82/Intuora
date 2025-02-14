import React, { useContext } from "react";
import { ControlContext } from "./ControlContext";

const Warning = ({ offWarning }) => {
    const { kitchenActive, setKitchenActive } = useContext(ControlContext);
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",  // Semi-transparent background
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: 1011,
                    height: 530,
                    background: "white",
                    borderRadius: 89,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        color: "black",
                        fontSize: 64,
                        fontFamily: "Inter",
                        fontWeight: "400",
                    }}
                >
                    {kitchenActive? <p>Stop Accepting Orders</p>:<p>Open the kitchen</p>}
                </div>
                <div
                    style={{
                        color: "black",
                        fontSize: 36,
                        fontFamily: "Inter",
                        fontWeight: "400",
                        margin: "20px 0",
                    }}
                >
                    {kitchenActive? <p>Are You Sure?<br />You will not be able to see and accept new orders</p>:<p>Are You Sure?<br />You will start receiving the orders</p>}
                    
                </div>
                <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
                    <button
                        style={{
                            width: 289,
                            height: 103,
                            background: "#31B475",
                            borderRadius: 20,
                            color: "black",
                            fontSize: 64,
                            fontFamily: "Inter",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setKitchenActive(!kitchenActive);
                            offWarning();
                            // console.log("from warining", kitchenActive);
                        }}
                    >
                        YES
                    </button>
                    <button
                        style={{
                            width: 289,
                            height: 103,
                            background: "#D9D9D9",
                            borderRadius: 20,
                            color: "black",
                            fontSize: 64,
                            fontFamily: "Inter",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={offWarning}
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Warning;
