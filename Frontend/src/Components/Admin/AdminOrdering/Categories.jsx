import React from "react";
import Grill from '../../../assets/pizza.png';
import NonGrill from "../../../assets/garlic_Bread.png";
import Choco from "../../../assets/fries.png";
import './CommonFonts.css';

function Categories({ sectionRefs }) {
    const scrollHandler = (refKey) => {
        if (sectionRefs[refKey]?.current) {
            sectionRefs[refKey].current.scrollIntoView({ behavior: "smooth" });
        } else {
            console.error(`Ref for ${refKey} is not defined.`);
        }
    };

    return (
        <div>
                <h2
                    className="categories"
                    style={{
                        left: 24,
                        position: "relative",
                        display: "flex",
                        justifyContent: "flex-start",
                        fontSize:19.2,
                        fontFamily: "Arial, sans-serif",
                        // fontWeight: "200",
                    }}
                >
                    Categories
                </h2>
            <div
                className="button"
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    position: "relative",
                    top: 25,
                }}
            >
                <button
                    onClick={() => scrollHandler("Grilled")}
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: "100%",
                        background: "white",
                        border: "0px solid darkgrey",
                    }}
                >
                    <img src={Grill} alt="grilled" style={{position:'relative', height: 60, width:60,right:60 }} />
                    <h3 style={{position:'relative',right:60,fontSize:15, fontWeight:"lighter", fontFamily: "Arial, sans-serif" }}>
                        Non-Grilled
                    </h3>
                </button>
                
                <button
                    onClick={() => scrollHandler("Grilled")}
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: "100%",
                        background: "white",
                        border: "0px solid darkgrey",
                    }}
                >
                    <img src={Grill} alt="grilled" style={{position:'relative', height: 60, width:60,right:60 }} />
                    <h3 style={{position:'relative',right:60,fontSize:15, fontWeight:"lighter", fontFamily: "Arial, sans-serif" }}>
                        Non-Grilled
                    </h3>
                </button>

                <button
                    onClick={() => scrollHandler("Grilled")}
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: "100%",
                        background: "white",
                        border: "0px solid darkgrey",
                    }}
                >
                    <img src={Grill} alt="grilled" style={{position:'relative', height: 60, width:60,right:60 }} />
                    <h3 style={{position:'relative',right:60,fontSize:15, fontWeight:"lighter", fontFamily: "Arial, sans-serif" }}>
                        Non-Grilled
                    </h3>
                </button>

                                <button
                    onClick={() => scrollHandler("Grilled")}
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: "100%",
                        background: "white",
                        border: "0px solid darkgrey",
                    }}
                >
                    <img src={Grill} alt="grilled" style={{position:'relative', height: 60, width:60,right:60 }} />
                    <h3 style={{position:'relative',right:60,fontSize:15, fontWeight:"lighter", fontFamily: "Arial, sans-serif" }}>
                        Non-Grilled
                    </h3>
                </button>
            </div>
        </div>
    );
}

export default Categories;
