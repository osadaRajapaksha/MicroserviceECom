from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="AI Inference Service")

class RecommendationRequest(BaseModel):
    user_id: str
    recent_purchases: List[str] = []

class RecommendationResponse(BaseModel):
    product_id: str
    product_name: str
    reason: str

@app.post("/predict/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(request: RecommendationRequest):
    """
    Mock inference endpoint.
    In a real scenario, this would load a PyTorch/Scikit-learn model,
    process the user's features, and run `model.predict()`.
    """
    # Simple rule-based mock for demonstration
    recommendations = []
    
    # Generic recommendations based on 'internal AI model' logic
    recommendations.append(
        RecommendationResponse(
            product_id="prod-101",
            product_name="Wireless Noise-Canceling Headphones",
            reason="Based on our internal collaborative filtering model, users similar to you bought this."
        )
    )
    
    recommendations.append(
        RecommendationResponse(
            product_id="prod-102",
            product_name="Ergonomic Office Chair",
            reason="Our content-based model suggests this pairs well with recent electronics views."
        )
    )

    return recommendations

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
