import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import CartOverlay from './components/CartOverlay';
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
            {}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>🛍️ SCANDISTORE</Link>
          </div>

          <div className="header-actions">
            <button 
              className="cart-icon-wrapper" 
              data-testid="cart-btn" 
              onClick={() => setIsCartOpen(!isCartOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', position: 'relative' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1667 6.66667H15.8333L19.1667 19.1667H0.833332L4.16667 6.66667H5.83333V5C5.83333 2.69881 7.69881 0.833334 10 0.833334C12.3012 0.833334 14.1667 2.69881 14.1667 5V6.66667ZM7.5 6.66667V8.33333H9.16667V6.66667H10.8333V8.33333H12.5V6.66667H14.1667V5C14.1667 2.69881 12.3012 0.833334 10 0.833334C7.69881 0.833334 5.83333 2.69881 5.83333 5V6.66667H7.5Z" fill="#43464E"/>
              </svg>
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