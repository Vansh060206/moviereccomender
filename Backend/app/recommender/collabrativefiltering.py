import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load datasets
ratings = pd.read_csv(BASE_DIR / "data" / "ratings.csv")
movies = pd.read_csv(BASE_DIR / "data" / "movies.csv")

# Create user-movie matrix
user_movie_matrix = ratings.pivot_table(
    index="userId",
    columns="movieId",
    values="rating"
).fillna(0)

# Compute similarity once
user_similarity = cosine_similarity(user_movie_matrix)

user_similarity_df = pd.DataFrame(
    user_similarity,
    index=user_movie_matrix.index,
    columns=user_movie_matrix.index
)


def get_similar_users(user_id, n=5):
    if user_id not in user_similarity_df:
        return []
    return user_similarity_df[user_id].sort_values(ascending=False)[1:n+1].index.tolist()


def recommend_movies(user_id, top_n=5):

    similar_users = get_similar_users(user_id)

    if not similar_users:
        return []

    sim_users_ratings = user_movie_matrix.loc[similar_users]

    mean_ratings = sim_users_ratings.mean().sort_values(ascending=False)

    already_watched = user_movie_matrix.loc[user_id]

    unwatched = mean_ratings[already_watched == 0]

    top_movie_ids = unwatched.head(top_n).index

    recommended_movies = movies[movies["movieId"].isin(top_movie_ids)]

    return recommended_movies[["movieId", "title"]].to_dict(orient="records")