from fastapi import APIRouter
from recommender.collabrativefiltering import recommend_movies

router = APIRouter()

@router.get("/recommend/{user_id}")
def recommend(user_id: int):
    movies = recommend_movies(user_id)
    return {"recommendations": movies}