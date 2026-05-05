from fastapi import APIRouter
from services.recommender import movies_df

router = APIRouter()

@router.get("/search")
def search_movies(title: str = ""):
    """
    Searches for movies by title.
    """
    if not title.strip():
        return {"results": []}
        
    match = movies_df[movies_df['title'].str.contains(title, case=False, na=False)]
    result = match.head(10).rename(columns={"movieId": "id"}).to_dict(orient="records")
    return {"results": result}
