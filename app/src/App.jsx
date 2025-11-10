import { useState, useEffect, useRef } from 'react'

// Sample food data
const foodCategories = [
  { id: 1, name: 'Grill', image: '🍔' },
  { id: 2, name: 'Non Grill', image: '🍕' },
  { id: 3, name: 'Cakes', image: '🎂' },
  { id: 4, name: 'Beverages', image: '🥤' },
  { id: 5, name: 'Desserts', image: '🍰' },
]

const menuItems = [
  { id: 1, name: 'American Pizza Butter Crust', price: 100, description: 'Thin crust topped with sauce, cheese, and a variety of toppings.', category: 'Non Grill', veg: true, image: '🍕' },
  { id: 2, name: 'Grilled Chicken Burger', price: 150, description: 'Juicy grilled chicken with fresh vegetables and special sauce.', category: 'Grill', veg: false, image: '🍔' },
  { id: 3, name: 'Chocolate Layer Cake', price: 200, description: 'Rich chocolate cake with creamy frosting layers.', category: 'Cakes', veg: true, image: '🎂' },
  { id: 4, name: 'Veg Grilled Sandwich', price: 80, description: 'Fresh vegetables grilled to perfection with cheese.', category: 'Grill', veg: true, image: '🥪' },
  { id: 5, name: 'Margherita Pizza', price: 120, description: 'Classic pizza with tomato, mozzarella, and basil.', category: 'Non Grill', veg: true, image: '🍕' },
  { id: 6, name: 'Red Velvet Cake', price: 250, description: 'Delicious red velvet cake with cream cheese frosting.', category: 'Cakes', veg: true, image: '🎂' },
  { id: 7, name: 'Cola', price: 20, description: 'The Original Refreshing Cola', category: 'Beverages', veg: true, image: '🥤' },
  { id: 8, name: 'Water Bottle', price: 20, description: 'Pure drinking water', category: 'Beverages', veg: true, image: '💧' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cart, setCart] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [vegMode, setVegMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 768

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change
        if (newQuantity <= 0) {
          return null
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean))
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory && (!vegMode || item.veg))
    : (!vegMode ? menuItems : menuItems.filter(item => item.veg))

  const bestsellers = menuItems.slice(0, 4)

  if (currentPage === 'cart') {
    return <CartPage
      cart={cart}
      updateQuantity={updateQuantity}
      removeFromCart={removeFromCart}
      getTotal={getTotal}
      setCurrentPage={setCurrentPage}
      windowWidth={windowWidth}
      isMobile={isMobile}
      addToCart={addToCart}
      menuItems={menuItems}
    />
  }

  return <HomePage
    cart={cart}
    addToCart={addToCart}
    setCurrentPage={setCurrentPage}
    windowWidth={windowWidth}
    isMobile={isMobile}
    vegMode={vegMode}
    setVegMode={setVegMode}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    foodCategories={foodCategories}
    bestsellers={bestsellers}
    filteredItems={filteredItems}
    getCartCount={getCartCount}
    menuItems={menuItems}
  />
}

function HomePage({
  cart,
  addToCart,
  setCurrentPage,
  windowWidth,
  isMobile,
  vegMode,
  setVegMode,
  selectedCategory,
  setSelectedCategory,
  foodCategories,
  bestsellers,
  filteredItems,
  getCartCount,
  menuItems
}) {
  const menuSectionRef = useRef(null)
  const categoriesRef = useRef(null)
  const bestsellersRef = useRef(null)

  const scrollToSection = (categoryName) => {
    if (categoryName) {
      setSelectedCategory(categoryName)
      setTimeout(() => {
        if (menuSectionRef.current) {
          menuSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      setSelectedCategory(null)
    }
  }

  const headerStyle = {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: isMobile ? '14px 16px' : '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    boxSizing: 'border-box',
  }

  const searchBarStyle = {
    width: '100%',
    padding: isMobile ? '12px 16px' : '14px 20px',
    margin: '16px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    fontSize: isMobile ? '14px' : '16px',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
    maxWidth: isMobile ? 'calc(100% - 32px)' : '600px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const sectionTitleStyle = {
    fontSize: isMobile ? '18px' : '22px',
    fontWeight: '700',
    color: '#333333',
    margin: '24px 16px 16px',
  }

  const categoryContainerStyle = {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    padding: '0 16px 16px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
  }

  const categoryCardStyle = {
    minWidth: '80px',
    textAlign: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  }

  const categoryImageStyle = (isSelected) => ({
    width: isMobile ? '70px' : '80px',
    height: isMobile ? '70px' : '80px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '32px' : '40px',
    marginBottom: '8px',
    border: isSelected ? '3px solid #4CAF50' : '2px solid transparent',
    transition: 'all 0.2s ease',
  })

  const productCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    margin: '0 16px 16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  }

  const productImageStyle = {
    width: isMobile ? '100px' : '120px',
    height: isMobile ? '100px' : '120px',
    borderRadius: '12px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '50px' : '60px',
    flexShrink: 0,
    objectFit: 'cover',
  }

  const addButtonStyle = {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: isMobile ? '10px 20px' : '12px 24px',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
  
  const addButtonStyleMenu = {
    ...addButtonStyle,
    marginLeft: 'auto',
  }

  const vegModeContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 16px',
  }

  const toggleStyle = {
    width: '50px',
    height: '26px',
    backgroundColor: vegMode ? '#4CAF50' : '#ccc',
    borderRadius: '13px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }

  const toggleCircleStyle = {
    width: '22px',
    height: '22px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    right: vegMode ? '2px' : '26px',
    transition: 'right 0.3s',
  }

  const horizontalScrollStyle = {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    padding: '0 16px 16px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
  }

  const bestsellerCardStyle = {
    minWidth: isMobile ? '220px' : '280px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'relative',
    flexShrink: 0,
  }

  const vegIconStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    width: '20px',
    height: '20px',
    backgroundColor: '#4CAF50',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 10,
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600' }}>Logo</div>
        <div style={{ fontSize: isMobile ? '20px' : '24px', cursor: 'pointer' }}>🔍</div>
        <div
          style={{ fontSize: isMobile ? '20px' : '24px', cursor: 'pointer', position: 'relative' }}
          onClick={() => setCurrentPage('cart')}
        >
          🛒
          {getCartCount() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}>
              {getCartCount()}
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={searchBarStyle}>
          <span style={{ fontSize: isMobile ? '16px' : '18px' }}>🔍</span>
          <input
            type="text"
            placeholder="Explore the menu......"
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              flex: 1,
              fontSize: isMobile ? '14px' : '16px',
              color: '#333',
            }}
          />
        </div>
      </div>

      {/* What's on your mind */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 16px' }}>
        <h2 style={{ ...sectionTitleStyle, margin: '24px 16px 16px 16px' }}>What's on your mind?</h2>
        <div style={vegModeContainerStyle}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#333', fontWeight: '500' }}>Veg Mode</span>
          <div style={toggleStyle} onClick={() => setVegMode(!vegMode)}>
            <div style={toggleCircleStyle}></div>
          </div>
        </div>
      </div>

      {/* Categories - Swipeable */}
      <div ref={categoriesRef} className="horizontal-scroll" style={categoryContainerStyle}>
        {foodCategories.map(category => {
          const isSelected = selectedCategory === category.name
          return (
            <div
              key={category.id}
              style={categoryCardStyle}
              onClick={() => scrollToSection(category.name)}
            >
              <div style={categoryImageStyle(isSelected)}>{category.image}</div>
              <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '500', color: '#333' }}>{category.name}</div>
            </div>
          )
        })}
      </div>

      {/* Bestsellers - Swipeable */}
      <h2 ref={bestsellersRef} style={sectionTitleStyle}>Bestsellers</h2>
      <div className="horizontal-scroll" style={horizontalScrollStyle}>
        {bestsellers.map(item => (
          <div key={item.id} style={bestsellerCardStyle}>
            {item.veg && <div style={vegIconStyle}>V</div>}
            <div style={{ fontSize: isMobile ? '60px' : '70px', textAlign: 'center', marginBottom: '12px' }}>{item.image}</div>
            <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>{item.name}</div>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>₹{item.price}</div>
            <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666', marginBottom: '12px', lineHeight: '1.4' }}>{item.description}</div>
            <button 
              style={addButtonStyle}
              onClick={() => addToCart(item)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Menu */}
      <h2 ref={menuSectionRef} style={sectionTitleStyle}>Menu</h2>
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
          <div style={{ fontSize: isMobile ? '16px' : '18px' }}>No items found in this category</div>
        </div>
      ) : (
        filteredItems.map(item => (
          <div key={item.id} style={productCardStyle}>
            <div style={productImageStyle}>{item.image}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {item.veg && <div style={{ ...vegIconStyle, position: 'relative', top: '0', left: '0' }}>V</div>}
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#333' }}>{item.name}</div>
              </div>
              <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>₹{item.price}</div>
              <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666', lineHeight: '1.4' }}>{item.description}</div>
            </div>
            <button 
              style={addButtonStyleMenu}
              onClick={() => addToCart(item)}
            >
              Add
        </button>
          </div>
        ))
      )}
    </div>
  )
}

function CartPage({
  cart,
  updateQuantity,
  removeFromCart,
  getTotal,
  setCurrentPage,
  windowWidth,
  isMobile,
  addToCart,
  menuItems
}) {
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)
  const [note, setNote] = useState('')
  const [waterBottleQty, setWaterBottleQty] = useState(0)

  const paymentMethods = [
    { id: 'cash', label: 'Cash' },
    { id: 'upi-cash', label: 'UPI/Cash' },
    { id: 'google-upi', label: 'Google UPI ID...' },
  ]

  const headerStyle = {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: isMobile ? '14px 16px' : '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    boxSizing: 'border-box',
  }

  const cartItemStyle = {
    backgroundColor: '#ffffff',
    padding: '16px',
    margin: '0 16px 16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  }

  const quantitySelectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#4CAF50',
    borderRadius: '8px',
    padding: '4px 8px',
  }

  const quantityButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: isMobile ? '18px' : '20px',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  }

  const paymentBarStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: isMobile ? '14px 16px' : '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    gap: '12px',
    width: '100%',
    boxSizing: 'border-box',
  }

  const placeOrderButtonStyle = {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    padding: isMobile ? '12px 20px' : '14px 24px',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  }

  const dropdownStyle = {
    position: 'relative',
    display: 'inline-block',
  }

  const dropdownButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    padding: isMobile ? '12px 16px' : '14px 20px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    minWidth: isMobile ? '160px' : '200px',
    width: '100%',
  }

  const dropdownMenuStyle = {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 200,
  }

  const dropdownItemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#333',
    fontSize: isMobile ? '14px' : '16px',
    borderBottom: '1px solid #f0f0f0',
  }

  const totalBillStyle = {
    position: 'fixed',
    bottom: isMobile ? '75px' : '85px',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: isMobile ? '12px 16px' : '16px 24px',
    borderTop: '1px solid #e0e0e0',
    zIndex: 99,
    boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
  }

  const suggestedItems = menuItems.filter(item => item.category === 'Beverages' && item.name === 'Cola').slice(0, 2)

  const calculateTotal = () => {
    const cartTotal = getTotal()
    const waterBottleTotal = waterBottleQty * 20
    return cartTotal + waterBottleTotal
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingBottom: waterBottleQty > 0 || cart.length > 0 ? '160px' : '20px' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: isMobile ? '20px' : '24px', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>←</div>
        <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600' }}>Your Order</div>
        <div style={{ fontSize: isMobile ? '20px' : '24px' }}>🛒</div>
      </div>

      {/* Cart Items */}
      {cart.length === 0 && waterBottleQty === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Your cart is empty</div>
          <div style={{ fontSize: isMobile ? '14px' : '16px' }}>Add some delicious items to get started!</div>
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} style={cartItemStyle}>
              <div style={{ fontSize: isMobile ? '50px' : '60px' }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {item.veg && <div style={{ width: '16px', height: '16px', backgroundColor: '#4CAF50', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>V</div>}
                  <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#333' }}>{item.name}</div>
                </div>
                <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#666', marginBottom: '8px' }}>₹{item.price}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={quantitySelectorStyle}>
                    <button style={quantityButtonStyle} onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span style={{ color: '#ffffff', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button style={quantityButtonStyle} onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#333' }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Water Bottle */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#333' }}>Add Water Bottle (₹20)</div>
              <div style={quantitySelectorStyle}>
                <button style={quantityButtonStyle} onClick={() => setWaterBottleQty(Math.max(0, waterBottleQty - 1))}>-</button>
                <span style={{ color: '#ffffff', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{waterBottleQty}</span>
                <button style={quantityButtonStyle} onClick={() => setWaterBottleQty(waterBottleQty + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* Add more items link */}
          <div style={{ padding: '0 16px', marginBottom: '24px' }}>
            <div style={{ color: '#4CAF50', fontSize: isMobile ? '14px' : '16px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
              + Add items
            </div>
          </div>

          {/* Personalize Order */}
          <div style={{ padding: '0 16px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: isMobile ? '14px' : '16px', color: '#333' }}>
              <span>Personalize Your Order with a Note</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                style={{
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '16px',
                  outline: 'none',
                }}
              />
            </label>
          </div>

          {/* Add more joy section */}
          <div style={{ margin: '24px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#333' }}>Add more joy to your plate!</h2>
              <span style={{ fontSize: '20px' }}>🍽️</span>
            </div>
            <div className="horizontal-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {suggestedItems.map(item => (
                <div key={item.id} style={{ minWidth: isMobile ? '150px' : '180px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                  <div style={{ fontSize: isMobile ? '40px' : '50px', textAlign: 'center', marginBottom: '8px' }}>{item.image}</div>
                  <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>{item.description}</div>
                  <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#333' }}>₹{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Total Bill */}
      {(cart.length > 0 || waterBottleQty > 0) && (
        <div style={totalBillStyle}>
          <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#666', marginBottom: '4px' }}>Total Bill to Pay</div>
          <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#333' }}>₹{calculateTotal()}</div>
        </div>
      )}

      {/* Payment Bar */}
      {(cart.length > 0 || waterBottleQty > 0) && (
        <div style={paymentBarStyle}>
          <div style={dropdownStyle}>
            <button
              style={dropdownButtonStyle}
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', flex: 1 }}>
                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.9, lineHeight: '1' }}>
                  {paymentMethod === 'Cash' || paymentMethod === 'UPI/Cash' ? 'PAY USING' : 'PAY BY'}
                </span>
                <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600', lineHeight: '1' }}>
                  {paymentMethod}
                </span>
              </div>
              <span style={{ fontSize: '12px', marginLeft: '8px' }}>▼</span>
            </button>
            {showPaymentDropdown && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 199,
                  }}
                  onClick={() => setShowPaymentDropdown(false)}
                />
                <div style={dropdownMenuStyle}>
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      style={{
                        ...dropdownItemStyle,
                        backgroundColor: paymentMethod === method.label ? '#f5f5f5' : '#ffffff',
                      }}
                      onClick={() => {
                        setPaymentMethod(method.label)
                        setShowPaymentDropdown(false)
                      }}
                    >
                      {method.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <button style={placeOrderButtonStyle}>
            Place order
          </button>
        </div>
      )}
    </div>
  )
}

export default App
