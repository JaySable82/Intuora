import React, { useRef } from "react";
import list from "./data";
import Cards from "./Cards";
import './CommonFonts.css';

function Menu({ handleClick,cart,sectionRefs }) {
    // Function to filter items by ID range
    const filterItems = (minId, maxId) => 
        list.filter(item => item.id >= minId && item.id <= maxId);

    const grilledItems = filterItems(1,9);
    const nonGrilledItems = filterItems(10, 25);
    const chocolateItems = filterItems(26, 29);

    // const Grilled = useRef(null);
    // const NonGrilled = useRef(null);
    // const Chocolate = useRef(null);


    const scrollHandler = (elmRef) => {
        elmRef.current.scrollIntoView({ behavior: "smooth" });
    };
    // const { Grilled, NonGrilled, Chocolate } = sectionRefs;
    return (
        <div>
            <div style={{ textAlign: 'center', color: '#6D6D6D', position: 'relative', top: '50px', fontWeight: 'bolder', fontSize: 50, fontFamily: 'Inter' }}>
                Menu
            </div>
            <div style={{ marginBottom: '40px' }} ref={sectionRefs.Grilled}>
            <div className="Vector2" style={{ width: 108.5, height: 1, left: 10, top: 883, position: 'absolute', border: '1px #B6ADAD solid' }}></div>
            <div className="Vector2" style={{ width: 108.5, height: 1, right: 10, top:883, position: 'absolute', border: '1px #B6ADAD solid' }}></div>

                <div style={{ textAlign: 'center', marginBottom: '20px', color: '#6D6D6D', position: 'relative', top: 108, fontWeight: 'bold' }}>
                    Non-Grilled Sandwich
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {grilledItems.map((item) => (
                        <Cards item={item} key={item.id} handleClick={handleClick} cart={cart} />
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '40px' }} ref={sectionRefs.NonGrilled}>
            <div className="Vector2" style={{ width: 125, height: 1, left: 10, top: 4516, position: 'absolute', border: '1px #B6ADAD solid' }}></div>
            <div className="Vector2" style={{ width: 125, height: 1, right: 10, top: 4516, position: 'absolute', border: '1px #B6ADAD solid' }}></div>
                <div style={{ textAlign: 'center', color: '#6D6D6D', marginTop: '20px', position: 'relative', top: 80, marginBottom: '20px', fontWeight: 'bold' }}>
                    Grilled Sandwich
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {nonGrilledItems.map((item) => (
                        <Cards item={item} key={item.id} handleClick={handleClick} cart={cart} />
                    ))}
                </div>
            </div>

            <div ref={sectionRefs.Chocolate}>
                <div className="Vector2" style={{ width: 125, height: 1, left: 10, top: 5175, position: 'absolute', border: '1px #B6ADAD solid' }}></div>
                <div className="Vector2" style={{ width: 125, height: 1, right: 10, top: 5175, position: 'absolute', border: '1px #B6ADAD solid' }}></div>
                <div style={{ textAlign: 'center', marginBottom: '20px', color: '#6D6D6D', position: 'relative', top: 80, fontWeight: 'bold' }}>
                    Chocolate Sandwich
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', paddingBottom: '400px' }}>
                    {chocolateItems.map((item) => (
                        <Cards item={item} key={item.id} handleClick={handleClick} cart={cart} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Menu;
