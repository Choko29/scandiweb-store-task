import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import parse from 'html-react-parser';
import { CartContext } from '../context/CartContext';
import ProductGallery from '../components/ProductGallery';
import ProductAttributes from '../components/ProductAttributes';
import '../App.css';

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      brand
      inStock
      description
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

function ProductDetails() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });
  
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});

  if (loading) {
    return (
      <div className="pdp-container">
        <div className="pdp-gallery-section">
           <div className="skeleton" style={{ width: '80px', height: '80px' }}></div>
           <div className="skeleton pdp-main-image" style={{ height: '500px', width: '100%' }}></div>
        </div>
        <div className="pdp-info-section" style={{ gap: '20px' }}>
           <div className="skeleton skeleton-text" style={{ width: '50%', height: '40px' }}></div>
           <div className="skeleton skeleton-text" style={{ width: '80%', height: '30px' }}></div>
           <div className="skeleton" style={{ width: '100%', height: '100px', marginTop: '30px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.product) return <div className="error">Product not found ❌</div>;

  const product = data.product;

  const allAttributesSelected = product.attributes.every(attr => selectedAttrs[attr.name]);
  const isAddToCartDisabled = !product.inStock || !allAttributesSelected;

  const handleAttributeSelect = (attrName, itemId) => {
    setSelectedAttrs(prev => ({ ...prev, [attrName]: itemId }));
  };

  const handlePrevImage = () => {
    setCurrentImgIndex(prev => (prev === 0 ? product.gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImgIndex(prev => (prev === product.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pdp-container">
      <ProductGallery
        product={product}
        currentImgIndex={currentImgIndex}
        setCurrentImgIndex={setCurrentImgIndex}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
      />

      <div className="pdp-info-section">
        <h1 className="pdp-brand">{product.brand}</h1>
        <h2 className="pdp-name">{product.name}</h2>

        <ProductAttributes
          attributes={product.attributes}
          selectedAttrs={selectedAttrs}
          handleAttributeSelect={handleAttributeSelect}
        />

        <div className="pdp-price-block">
          <h3 className="price-label">PRICE:</h3>
          <p className="pdp-price">
            {product.prices[0].currency_symbol}{product.prices[0].amount.toFixed(2)}
          </p>
        </div>

        <button 
          className={`pdp-add-to-cart ${isAddToCartDisabled ? 'disabled' : ''}`}
          data-testid="add-to-cart"
          disabled={isAddToCartDisabled}
          onClick={() => {
            addToCart(product, selectedAttrs);
            setIsCartOpen(true); 
          }}
        >
          {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>

        <div className="pdp-description" data-testid="product-description">
          {parse(product.description || '')}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;