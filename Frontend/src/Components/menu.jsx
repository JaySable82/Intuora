import React from "react";
import list from "./data";
import Cards from "./Cards";
import './CommonFonts.css';

function Menu({ handleClick, cart, sectionRefs }) {
  const filterItems = (minId, maxId) =>
    list.filter(item => item.id >= minId && item.id <= maxId);

  const grilledItems = filterItems(4,7);
  const nonGrilledItems = filterItems(1,3);
  const chocolateItems = filterItems(8,8);

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{
        textAlign: 'center',
        color: '#6D6D6D',
        fontWeight: 'bolder',
        fontSize: 40,
        fontFamily: 'Inter',
        marginBottom: 10
      }}>
        Menu
      </div>

      {/* Non Grill */}
      <section ref={sectionRefs.NonGrilled} style={{ marginTop: 50, marginBottom: 15 }}>
        
        {/* Heading */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 4       // SMALL gap before cards
        }}>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
          <h3 style={{ margin: 0, color: '#6D6D6D', fontWeight: 700, fontSize: 18 }}>Non Grill</h3>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 8,              // small grid gap
          marginTop: 0
        }}>
          {grilledItems.map(item => (
            <Cards
              item={item}
              key={item.id}
              handleClick={handleClick}
              cart={cart}
              style={{ margin: 0,padding:0 }}  // REMOVE card margin
            />
          ))}
        </div>
      </section>

      {/* Grilled Sandwich */}
      <section ref={sectionRefs.Grilled} style={{ marginTop: 85, marginBottom: 15 }}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 4
        }}>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
          <h3 style={{ margin: 0, color: '#6D6D6D', fontWeight: 700, fontSize: 18 }}>Grilled Sandwich</h3>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 8,
          marginTop: 0
        }}>
          {nonGrilledItems.map(item => (
            <Cards
              item={item}
              key={item.id}
              handleClick={handleClick}
              cart={cart}
              style={{ margin: 0,padding:0 }}  // REMOVE card margin
            />
          ))}
        </div>
      </section>

      {/* Chocolate */}
      <section ref={sectionRefs.Chocolate} style={{ marginTop: 150, marginBottom: 25, paddingBottom:150 }}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 4
        }}>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
          <h3 style={{ margin:0, color: '#6D6D6D', fontWeight: 700, fontSize: 18 }}>Chocolate Sandwich</h3>
          <div style={{ flex: 1, height: 1, background: '#B6ADAD', maxWidth: 120 }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 8,
          marginTop: 0
        }}>
          {chocolateItems.map(item => (
            <Cards
              item={item}
              key={item.id}
              handleClick={handleClick}
              cart={cart}
              style={{ margin: 0,padding:0 }}  // REMOVE card margin
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Menu;
