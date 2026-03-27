import { createContext, useState } from 'react';

export const CartContext = createContext();

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : initialValue;
  });

  const setValue = (value) => {
    setStoredValue((prevValue) => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
    });
  };

  return [storedValue, setValue];
};

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useLocalStorage('scandiweb_cart', []);
  
  const [isCartOpen, setIsCartOpen] = useState(false); 

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