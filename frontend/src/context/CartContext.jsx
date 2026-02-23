import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('scandiweb_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false); 

  
  useEffect(() => {
    localStorage.setItem('scandiweb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedAttributes) => {
    setCartItems((prevItems) => {
      let attrsToSave = { ...selectedAttributes };
      
      if (Object.keys(attrsToSave).length === 0 && product.attributes) {
        product.attributes.forEach(attr => {
          if (attr.items && attr.items.length > 0) {
            attrsToSave[attr.name] = attr.items[0].id;
          }
        });
      }

      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(attrsToSave)
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { product, selectedAttributes: attrsToSave, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (index, delta) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: updatedItems[index].quantity + delta
      };
      
      if (updatedItems[index].quantity <= 0) {
        updatedItems.splice(index, 1);
      }
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, setCartItems, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};