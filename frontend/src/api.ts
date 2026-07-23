export const API_BASE_URL = 'http://localhost:9090/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/product`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const placeOrder = async (orderData: { skuCode: string, quantity: number, price: number }) => {
    const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to place order');
    }
    
    return response.text();
};
