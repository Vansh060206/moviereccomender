import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

# Load datasets
ratings = pd.read_csv('data/ratings.csv')     # userId, movieId, rating
movies = pd.read_csv('data/movies.csv')       # movieId, title

# Step 1: Create a user-item ratings matrix
user_movie_matrix = ratings.pivot_table(index='userId', columns='movieId', values='rating').fillna(0)

# Step 2: Compute cosine similarity between users
user_similarity = cosine_similarity(user_movie_matrix)
user_similarity_df = pd.DataFrame(user_similarity, index=user_movie_matrix.index, columns=user_movie_matrix.index)

# Step 3: Get top similar users for a given user
def get_similar_users(user_id, n=5):
    if user_id not in user_similarity_df:
        return []
    return user_similarity_df[user_id].sort_values(ascending=False)[1:n+1].index.tolist()

# Step 4: Generate movie recommendations for a user
def recommend_movies(user_id, top_n=5):
    similar_users = get_similar_users(user_id)
    if not similar_users:
        return []

    # Get ratings of similar users
    sim_users_ratings = user_movie_matrix.loc[similar_users]

    # Compute the average ratings from similar users
    mean_ratings = sim_users_ratings.mean().sort_values(ascending=False)

    # Filter out movies already rated by the target user
    already_watched = user_movie_matrix.loc[user_id]
    unwatched = mean_ratings[already_watched == 0]

    # Get movie titles
    top_movie_ids = unwatched.head(top_n).index
    top_movie_titles = movies[movies['movieId'].isin(top_movie_ids)]

    return top_movie_titles[['movieId', 'title']]

# --- Run it for a user
user_input = input("Enter user ID (e.g., 1): ")
try:
    user_id = int(user_input)
    recommendations = recommend_movies(user_id)

    print(f"\n🎬 Top Recommendations for User {user_id}:")
    if not recommendations.empty:
        for _, row in recommendations.iterrows():
            print(f"- {row['title']} (movieId: {row['movieId']})")
    else:
        print("No recommendations found (maybe all movies already rated).")
except:
    print("Invalid input. Please enter a valid user ID.")
