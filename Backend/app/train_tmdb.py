import pandas as pd
import ast
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from pathlib import Path

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent

print("Loading TMDB datasets...")
movies = pd.read_csv(BASE_DIR / "data" / "tmdb_5000_movies.csv")
credits = pd.read_csv(BASE_DIR / "data" / "tmdb_5000_credits.csv")

print("Merging and Preprocessing...")
# Merge on title
movies = movies.merge(credits, on='title')

# We need these columns for the frontend/browsing:
# title, year, rating, genre, url, presentation
movies['year'] = pd.to_datetime(movies['release_date'], errors='coerce').dt.year.fillna(0).astype(int).astype(str)
movies['year'] = movies['year'].replace('0', '')
movies['presentation'] = movies['overview'].fillna('')
movies['rating'] = movies['vote_average'].fillna(0)
movies['url'] = "" # No poster URLs available in this dataset

def extract_names(obj):
    try:
        L = []
        for i in ast.literal_eval(obj):
            L.append(i['name'])
        return L
    except:
        return []

movies['genre_list'] = movies['genres'].apply(extract_names)
movies['genre'] = movies['genre_list'].apply(lambda x: '|'.join(x))
movies['keywords_list'] = movies['keywords'].apply(extract_names)

def convert3(obj):
    try:
        L = []
        counter = 0
        for i in ast.literal_eval(obj):
            if counter != 3:
                L.append(i['name'])
                counter+=1
            else:
                break
        return L
    except:
        return []
movies['cast_list'] = movies['cast'].apply(convert3)

def fetch_director(obj):
    try:
        L = []
        for i in ast.literal_eval(obj):
            if i['job'] == 'Director':
                L.append(i['name'])
                break
        return L
    except:
        return []
movies['crew_list'] = movies['crew'].apply(fetch_director)

print("Preparing Tags for AI Recommendation Model...")
def collapse(L):
    return [i.replace(" ","") for i in L]

movies['genre_list'] = movies['genre_list'].apply(collapse)
movies['keywords_list'] = movies['keywords_list'].apply(collapse)
movies['cast_list'] = movies['cast_list'].apply(collapse)
movies['crew_list'] = movies['crew_list'].apply(collapse)

movies['overview_list'] = movies['overview'].apply(lambda x: str(x).split() if pd.notna(x) else [])

movies['tags'] = movies['overview_list'] + movies['genre_list'] + movies['keywords_list'] + movies['cast_list'] + movies['crew_list']
movies['tags'] = movies['tags'].apply(lambda x: " ".join(x).lower())

# Save the clean generic dataset for the frontend
final_df = movies[['title', 'year', 'rating', 'genre', 'url', 'presentation']].copy()
final_csv_path = BASE_DIR / 'data' / 'tmdb_movies_clean.csv'
final_df.to_csv(final_csv_path, index=False)
print(f"Saved clean TMDB data to {final_csv_path}")

print("Vectorizing tags...")
new_df = movies[['id', 'title', 'tags']].copy()
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(new_df['tags']).toarray()

print("Calculating similarity matrix...")
similarity = cosine_similarity(vectors)

print("Saving model files...")
models_dir = BASE_DIR / "models"
models_dir.mkdir(exist_ok=True)

pickle.dump(new_df.to_dict(), open(models_dir / 'movies_dict.pkl', 'wb'))
pickle.dump(similarity, open(models_dir / 'similarity.pkl', 'wb'))

print("Training Complete! Model saved in models/ directory.")
