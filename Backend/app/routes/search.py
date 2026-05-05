from fastapi import APIRouter, Query
import pandas as pd
from pathlib import Path

router = APIRouter()

# Get base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load dataset
movies = pd.read_csv(BASE_DIR / "data" / "movies.csv")


@router.get("/search")
def search_movies(title: str = Query(..., description="Movie title to search")):
    
    results = movies[movies["title"].str.contains(title, case=False)]

    return results.head(20).to_dict(orient="records")