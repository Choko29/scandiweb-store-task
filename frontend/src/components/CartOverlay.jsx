import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const toKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
};

function CartOverlay({ onClose }) {
  const { cartItems, updateQuantity, setCartItems } = useContext(CartContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.prices[0].amount * item.quantity), 0);
  const currencySymbol = cartItems.length > 0 ? cartItems[0].product.prices[0].currency_symbol : '$';
  
  const itemsText = totalItems === 1 ? '1 Item' : `${totalItems} Items`;

  return (
    <>
      <div className="cart-overlay-backdrop" onClick={onClose}></div>
      
      <div className="cart-overlay" data-testid="cart-overlay">
        <h3 className="cart-overlay-title">
          <strong>My Bag</strong>, {itemsText}
        </h3>

        <div className="cart-items-container">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-info">
                <p className="cart-item-name">{item.product.name}</p>
                <p className="cart-item-price">{item.product.prices[0].currency_symbol}{item.product.prices[0].amount.toFixed(2)}</p>
                
                <div className="cart-item-attributes">
                  {item.product.attributes?.map(attr => (
                    <div key={attr.id} className="cart-attr-group" data-testid={`cart-item-attribute-${toKebabCase(attr.name)}`}>
                      <p className="cart-attr-name">{attr.name}:</p>
                      <div className="cart-attr-items">
                        {attr.items.map(attrItem => {
                          const isSelected = item.selectedAttributes && item.selectedAttributes[attr.name] === attrItem.id;
                          const isColor = attr.type === 'swatch';
                          
                          // Scandiweb Test ID requirements for attributes inside the cart
                          const testId = isSelected 
                            ? `cart-item-attribute-${toKebabCase(attr.name)}-${toKebabCase(attrItem.id)}-selected`
                            : `cart-item-attribute-${toKebabCase(attr.name)}-${toKebabCase(attrItem.id)}`;

                          return (
                            <div 
                              key={attrItem.id} 
                              data-testid={testId}
                              className={`cart-attr-btn ${isColor ? 'color' : 'text'} ${isSelected ? 'selected' : ''}`}
                              style={isColor ? { backgroundColor: attrItem.value } : {}}
                            >
                              {!isColor && attrItem.value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button data-testid="cart-item-amount-increase" onClick={() => updateQuantity(index, 1)}>+</button>
                  <span data-testid="cart-item-amount">{item.quantity}</span>
                  <button data-testid="cart-item-amount-decrease" onClick={() => updateQuantity(index, -1)}>-</button>
                </div>
                <img src={item.product.gallery[0]} alt={item.product.name} className="cart-item-image" />
              </div>
            </div>
          ))}
        </div>

        <div className="cart-total-section">
          <p className="cart-total-label">Total</p>
          <p data-testid="cart-total" className="cart-total-price">{currencySymbol}{totalPrice.toFixed(2)}</p>
        </div>

        <button 
          className={`place-order-btn ${cartItems.length === 0 ? 'disabled' : ''}`}
          disabled={cartItems.length === 0}
          style={{ opacity: cartItems.length === 0 ? 0.5 : 1, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer' }}
          onClick={() => {
            if(cartItems.length > 0) {
              
              setCartItems([]);
              onClose();
            }
          }}
        >
          PLACE ORDER
        </button>
      </div>
    </>
  );
}

export default CartOverlay;