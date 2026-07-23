import { useEffect, useState } from 'react'
import { fetchProducts, placeOrder } from './api'
import keycloak from './keycloak'
import './App.css'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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

  const handleBuyNow = async (productId: number, price: number) => {
    if (!authenticated) {
        alert("Please sign in to place an order.");
        keycloak.login();
        return;
    }
    try {
      // In a real app we'd get skuCode from the product object properly
      // We are just simulating a skuCode based on productId for now
      const skuCode = `SKU-${productId}`;
      alert(`Placing order for ${skuCode}...`);
      
      const responseMessage = await placeOrder({
        skuCode,
        price,
        quantity: 1
      });
      
      alert(`Backend response: ${responseMessage}`);
    } catch (error: any) {
      alert(`Error placing order: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      
      <nav className="navbar glass">
        <div className="logo">MicroStore</div>
        <div>
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
                  <button className="btn btn-secondary" onClick={() => handleBuyNow(p.id, p.price)}>
                    Buy Now
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

export default App
