from fastapi import APIRouter
import pandas as pd
from pathlib import Path

router = APIRouter()

# Get base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load movies dataset
movies = pd.read_csv(BASE_DIR / "data" / "movies.csv")


@router.get("/movies")
def get_movies():
    return movies.head(50).to_dict(orient="records")