from fastapi import APIRouter
from services.recommender import movies_df

router = APIRouter()

@router.get("/movies")
def get_movies():
    """
    Returns a random selection of movies for the trending carousel.
    """
    sample = movies_df.sample(10)
    
    # Rename movieId to id and url to poster_path for the frontend
    result = sample.rename(columns={"movieId": "id", "url": "poster_path"}).to_dict(orient="records")
    return {"movies": result}
