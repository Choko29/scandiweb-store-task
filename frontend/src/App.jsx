import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import CartOverlay from './components/CartOverlay';
import CartIcon from './components/CartIcon';
import Navigation from './components/Navigation';
import { CartContext } from './context/CartContext';
import './App.css';

function App() {
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Navigation />
          
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>🛍️ SCANDISTORE</Link>
          </div>

          <div className="header-actions">
            <button 
              className="cart-icon-wrapper" 
              data-testid="cart-btn" 
              onClick={() => setIsCartOpen(!isCartOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', position: 'relative' }}
            >
              <CartIcon />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
          
          {isCartOpen && <CartOverlay onClose={() => setIsCartOpen(false)} />}
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/all" replace />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;