import keycloak from './keycloak';

export const API_BASE_URL = 'http://localhost:9090/api';

export const fetchProducts = async () => {
    const headers: any = {};
    if (keycloak.token) {
        headers['Authorization'] = `Bearer ${keycloak.token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/product`, { headers });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const placeOrder = async (orderData: { skuCode: string, quantity: number, price: number }) => {
    const headers: any = {
        'Content-Type': 'application/json'
    };
    if (keycloak.token) {
        headers['Authorization'] = `Bearer ${keycloak.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to place order');
    }
    
    return response.text();
};
