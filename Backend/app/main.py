from fastapi import FastAPI
from routes.recommend import router as recommend_router
from routes.movies import router as movies_router
from routes.search import router as search_router

app = FastAPI(
    title="Movie Recommendation API",
    description="API for recommending movies",
    version="1.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router)
app.include_router(movies_router)
app.include_router(search_router)


@app.get("/")
def home():
    return {"message": "Movie Recommendation API Running"}