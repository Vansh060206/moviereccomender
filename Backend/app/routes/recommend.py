from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.recommender import get_content_recommendations

router = APIRouter()

class RecommendRequest(BaseModel):
    movie_name: str

@router.post("/recommend")
def recommend_movies(request: RecommendRequest):
    """
    Given a movie name, returns a list of top recommendations based on content (genres).
    """
    if not request.movie_name.strip():
        raise HTTPException(status_code=400, detail="Movie name cannot be empty")
        
    result = get_content_recommendations(request.movie_name)
    
    if not result:
        raise HTTPException(status_code=404, detail=f"No movie found matching '{request.movie_name}'")
        
    return result