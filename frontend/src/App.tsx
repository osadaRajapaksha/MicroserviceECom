import { useEffect, useState } from 'react'
import { fetchProducts } from './api'
import keycloak from './keycloak'
import './App.css'
import { CartProvider, useCart, type Product } from './context/CartContext'
import { CartSidebar } from './components/CartSidebar'

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { addToCart, setIsCartOpen, cartItems } = useCart();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then(auth => {
      setAuthenticated(auth);
      loadProducts();
    }).catch(() => {
      console.error("Keycloak initialization failed");
      setLoading(false);
    });

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <CartSidebar authenticated={authenticated} onLogin={handleLogin} />
      
      <nav className="navbar glass">
        <div className="logo">MicroStore</div>
        <div className="nav-actions">
          <button className="btn cart-btn" onClick={() => setIsCartOpen(true)}>
            Cart 🛒 {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
          </button>
          {authenticated ? (
             <button className="btn" onClick={handleLogout}>Sign Out</button>
          ) : (
             <button className="btn" onClick={handleLogin}>Sign In</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <h1>Welcome to the Future</h1>
        <p>Discover premium tech artifacts powered by microservices.</p>
      </header>

      <main>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading inventory...</div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-card glass">
                <h2 className="product-name">{p.name}</h2>
                <p className="product-desc">{p.description}</p>
                <div className="product-footer">
                  <span className="product-price">${p.price.toFixed(2)}</span>
                  <button className="btn btn-secondary" onClick={() => addToCart(p)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
