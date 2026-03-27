import { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

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
              navigate(`/product/${product.id}`);
            }}
            style={{ cursor: 'pointer' }}
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
                  : 'Price unavailable'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ProductList;