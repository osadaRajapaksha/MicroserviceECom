import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';

export const CartSidebar = ({ authenticated, onLogin }: { authenticated: boolean, onLogin: () => void }) => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!authenticated) {
      alert("Please sign in to place an order.");
      onLogin();
      return;
    }

    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Fire parallel checkout requests for each unique cart item
      const orderPromises = cartItems.map(item => 
        placeOrder({
          skuCode: `SKU-${item.id}`,
          price: item.price,
          quantity: item.quantity
        })
      );

      await Promise.all(orderPromises);
      alert(`Successfully placed orders for ${cartItems.length} items!`);
      clearCart();
      setIsCartOpen(false);
    } catch (error: any) {
      alert(`Error during checkout: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar glass ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item glass">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <h3>Total: ${totalAmount.toFixed(2)}</h3>
            <button className="btn btn-secondary checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
