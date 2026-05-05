from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.recommender import get_content_recommendations

# Initialize the router for recommendation endpoints
router = APIRouter()

# Define the expected request body schema
class RecommendRequest(BaseModel):
    movie_name: str

@router.post("/recommend")
def recommend_movies(request: RecommendRequest):
    """
    API endpoint that receives a movie name and returns recommendations.
    Flow:
    1. Validates input.
    2. Calls the recommendation service.
    3. Handles not found scenarios.
    4. Returns structured JSON output.
    """
    if not request.movie_name.strip():
        raise HTTPException(status_code=400, detail="Movie name cannot be empty")
        
    # Generate recommendations using precomputed similarity matrix
    result = get_content_recommendations(request.movie_name)
    
    # Handle the case where the movie doesn't exist in our dataset
    if not result:
        raise HTTPException(status_code=404, detail=f"No movie found matching '{request.movie_name}'")
        
    # Return structured JSON response defined in standard format
    return result