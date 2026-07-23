import { useEffect, useState } from 'react'
import { fetchProducts } from './api'
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

  useEffect(() => {
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

  const handleBuyNow = async (productId: number) => {
    // Mocking an order placement
    alert(`Placing order for product ID: ${productId}... (Integration to POST /api/order)`);
    // Example: fetch('http://localhost:9090/api/order', { method: 'POST', body: JSON.stringify({ skuCode: '...', quantity: 1 })})
  };

  return (
    <div className="app-container">
      
      <nav className="navbar glass">
        <div className="logo">MicroStore</div>
        <div>
          <button className="btn">Sign In</button>
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
                  <button className="btn btn-secondary" onClick={() => handleBuyNow(p.id)}>
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
