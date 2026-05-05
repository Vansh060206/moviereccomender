import pandas as pd
import pickle
from pathlib import Path
from utils.explain import generate_explanation

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------
# Load Full Dataset for /movies Endpoint
# ---------------------------------------------------------
movies_path = BASE_DIR / "data" / "tmdb_movies_clean.csv"
movies_df = pd.read_csv(movies_path)
movies_df['title'] = movies_df['title'].fillna('')
movies_df['genre'] = movies_df['genre'].fillna('')
movies_df['year'] = movies_df['year'].fillna('')
movies_df['rating'] = movies_df['rating'].fillna(0)
movies_df['url'] = movies_df['url'].fillna('')
movies_df['imdb_id'] = movies_df.get('imdb_id', pd.Series()).fillna('')

# Replace all remaining NaN values with empty string to prevent JSON serialization errors
movies_df = movies_df.fillna('')

movies_df = movies_df.rename(columns={"genre": "genres"})
movies_df['movieId'] = range(1, len(movies_df) + 1)
movies_df['genres'] = movies_df['genres'].apply(lambda x: str(x).replace(", ", "|").replace(",", "|"))

# ---------------------------------------------------------
# Load Pre-trained AI Models for INSTANT /recommend Endpoint
# ---------------------------------------------------------
models_dir = BASE_DIR / "models"
import zipfile

try:
    if not (models_dir / 'similarity.pkl').exists():
        if (models_dir / 'models.zip').exists():
            print("Extracting models from zip...")
            with zipfile.ZipFile(models_dir / 'models.zip', 'r') as zip_ref:
                zip_ref.extractall(models_dir)
                
    movies_dict = pickle.load(open(models_dir / 'movies_dict.pkl', 'rb'))
    model_movies_df = pd.DataFrame(movies_dict)
    similarity = pickle.load(open(models_dir / 'similarity.pkl', 'rb'))
except Exception as e:
    print(f"Error loading models: {e}")
    model_movies_df = pd.DataFrame()
    similarity = None

def get_content_recommendations(movie_name: str, top_n: int = 5):
    """
    Core recommendation logic using pre-computed cosine similarity matrix.
    Logic:
    1. Finds the closest matching movie title in the dataset.
    2. Retrieves precomputed similarity distances in O(1) time.
    3. Sorts distances to find the top_n most similar movies.
    4. Constructs response with movie details and AI explanations.
    """
    if similarity is None or model_movies_df.empty:
        print("Model files not found. Run train_model.py first.")
        return None
        
    # Find the movie index by name (case insensitive partial match)
    match = model_movies_df[model_movies_df['title'].str.contains(movie_name, case=False, na=False)]
    
    if match.empty:
        return None
        
    # Get the index of the best match
    movie_idx = match.index[0]
    source_title = match.iloc[0]['title']
    
    # Get similarity scores for this movie directly from the precomputed matrix O(1) time
    distances = similarity[movie_idx]
    
    # Sort the distances and get the top_n (excluding the first one since it's the movie itself)
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:top_n+1]
    
    recommendations = []
    for i in movies_list:
        rec_idx = i[0]
        score = i[1]
        rec_title = model_movies_df.iloc[rec_idx]['title']
        
        poster_path = ""
        full_match = movies_df[movies_df.index == rec_idx]
        if not full_match.empty:
            poster_path = full_match.iloc[0].get('url', "")
            if pd.isna(poster_path):
                poster_path = ""
        
        recommendations.append({
            "title": rec_title,
            "similarity_score": round(float(score), 2),
            "poster_path": str(poster_path),
            "explanation": generate_explanation(source_title, rec_title)
        })
        
    return {
        "input_movie": source_title,
        "recommendations": recommendations
    }
