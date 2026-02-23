import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import parse from 'html-react-parser';
import { CartContext } from '../context/CartContext';
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

const toKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
};

function ProductDetails() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });
  
  
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});

  if (loading) return <div className="loader">Loading product details... ⏳</div>;
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
      
      <div className="pdp-gallery-section" data-testid="product-gallery">
        <div className="pdp-thumbnails">
          {product.gallery.map((imgUrl, index) => (
            <img 
              key={index} 
              src={imgUrl} 
              alt={`Thumbnail ${index}`} 
              className={currentImgIndex === index ? 'active-thumbnail' : ''}
              onClick={() => setCurrentImgIndex(index)}
            />
          ))}
        </div>
        <div className="pdp-main-image-container">
          <img src={product.gallery[currentImgIndex]} alt={product.name} className="pdp-main-image" />
          {product.gallery.length > 1 && (
            <div className="pdp-image-arrows">
              <button onClick={handlePrevImage} className="arrow-btn">{'<'}</button>
              <button onClick={handleNextImage} className="arrow-btn">{'>'}</button>
            </div>
          )}
        </div>
      </div>

      <div className="pdp-info-section">
        <h1 className="pdp-brand">{product.brand}</h1>
        <h2 className="pdp-name">{product.name}</h2>

        <div className="pdp-attributes">
          {product.attributes.map(attr => (
            <div key={attr.id} className="attribute-block" data-testid={`product-attribute-${toKebabCase(attr.name)}`}>
              <h3 className="attribute-name">{attr.name.toUpperCase()}:</h3>
              <div className="attribute-items">
                {attr.items.map(item => {
                  const isSelected = selectedAttrs[attr.name] === item.id;
                  const isColor = attr.type === 'swatch';
                  
                  return (
                    <button
                      key={item.id}
                      className={`attr-btn ${isColor ? 'color-swatch' : 'text-swatch'} ${isSelected ? 'selected' : ''}`}
                      style={isColor ? { backgroundColor: item.value } : {}}
                      onClick={() => handleAttributeSelect(attr.name, item.id)}
                    >
                      {!isColor ? item.value : ''} 
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

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