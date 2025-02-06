import React from "react";
import Grill from "../assets/pizza.png";
import NonGrill from "../assets/garlic_Bread.png";
import Choco from "../assets/fries.png";
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
            <div
                className="categories"
                style={{
                    left: 24,
                    position: "relative",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: 30,
                    fontFamily: "Inter",
                    fontWeight: "400",
                }}
            >
                Categories
            </div>
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
                        width: 90,
                        height: 90,
                        borderRadius: "100%",
                        background: "white",
                        border: "0px solid darkgrey",
                    }}
                >
                    <img src={Grill} alt="grilled" style={{ height: 90, width: 90 }} />
                    <h3 style={{ fontWeight: "normal", fontFamily: "Inter" }}>
                        Delicious Pizza
                    </h3>
                </button>
                <button
                    onClick={() => scrollHandler("NonGrilled")}
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "100%",
                        background: "white",
                        border: "1px solid darkgrey",
                    }}
                >
                    <img src={NonGrill} alt="non-grilled" style={{ height: 90, width: 90 }} />
                    <h3 style={{ fontWeight: "normal", fontFamily: "Inter" }}>
                        Garlic Bread
                    </h3>
                </button>
                <button
                    onClick={() => scrollHandler("Chocolate")}
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "100%",
                        background: "white",
                        border: "1px solid darkgrey",
                    }}
                >
                    <img src={Choco} alt="chocolate" style={{ height: 90, width: 90 }} />
                    <h3 style={{ fontWeight: "normal", fontFamily: "Inter" }}>
                        French Fries
                    </h3>
                </button>
            </div>
        </div>
    );
}

export default Categories;
