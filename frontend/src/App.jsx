import { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useLocation, useParams, Navigate } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import CartOverlay from './components/CartOverlay';
import { CartContext } from './context/CartContext';
import './App.css';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      inStock 
      category
      gallery
      prices {
        amount
        currency_symbol
      }
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

// გამარტივებული Kebab Case ფუნქცია
const toKebabCase = (str) => {
  return str.replace(/\s+/g, '-').toLowerCase();
};

function ProductList({ currentCategory }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  if (loading) {
    return (
      <main>
        <h1 className="category-title">{currentCategory === 'all' ? 'All' : currentCategory} Products</h1>
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="product-card skeleton-card">
              <div className="skeleton skeleton-img"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text short"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) return <div className="error">Error: {error.message} ❌</div>;

  const filteredProducts = currentCategory === 'all' 
    ? data.products 
    : data.products.filter(product => product.category.toLowerCase() === currentCategory);

  return (
    <main>
      <h1 className="category-title">{currentCategory} Products</h1>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
            data-testid={`product-${toKebabCase(product.name)}`}
            onClick={() => {
              if (product.inStock) navigate(`/product/${product.id}`);
            }}
            style={{ cursor: product.inStock ? 'pointer' : 'default' }}
          >
            <div className="image-container">
              {!product.inStock && <div className="out-of-stock-overlay">OUT OF STOCK</div>}
              {product.gallery && product.gallery.length > 0 ? (
                <img src={product.gallery[0]} alt={product.name} className="product-image" />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            
            {product.inStock && (
              <button 
                className="quick-shop-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  e.preventDefault();
                  addToCart(product, {}); 
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
                </svg>
              </button>
            )}

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">
                {product.prices && product.prices.length > 0 
                  ? `${product.prices[0].currency_symbol}${product.prices[0].amount.toFixed(2)}` 
                  : "Price unavailable"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function CategoryPage() {
  const { category } = useParams();
  const currentCategory = category || 'all';
  return <ProductList currentCategory={currentCategory} />;
}

function Navigation() {
  const location = useLocation();
  const path = location.pathname.substring(1); 
  const currentCategory = path || 'all';

  return (
    <nav className="nav-categories">
      <Link 
        to="/all" 
        className={currentCategory === 'all' ? 'active' : ''} 
        data-testid={currentCategory === 'all' ? 'active-category-link' : 'category-link'} 
      >
        ALL
      </Link>
      <Link 
        to="/tech" 
        className={currentCategory === 'tech' ? 'active' : ''} 
        data-testid={currentCategory === 'tech' ? 'active-category-link' : 'category-link'} 
      >
        TECH
      </Link>
      <Link 
        to="/clothes" 
        className={currentCategory === 'clothes' ? 'active' : ''} 
        data-testid={currentCategory === 'clothes' ? 'active-category-link' : 'category-link'} 
      >
        CLOTHES
      </Link>
    </nav>
  );
}

function App() {
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Navigation />
          
          <div className="logo">
            {/* ლოგოს ლინკი შესწორდა / -ზე */}
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