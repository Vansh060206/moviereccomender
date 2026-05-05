import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from pathlib import Path

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent

# 1. Load the dataset
print("Loading dataset...")
movies_path = BASE_DIR / "data" / "bollywood_movies.csv"
df = pd.read_csv(movies_path)

# 2. Preprocess Data
print("Cleaning data...")
df['title'] = df['title'].fillna('')
df['genre'] = df['genre'].fillna('')
df['presentation'] = df['presentation'].fillna('')

# 3. Clean Text
def clean_string(x):
    if isinstance(x, str):
        return x.replace(" ", "")
    return ""

df['genre_clean'] = df['genre'].apply(lambda x: str(x).replace(" ", "").replace("|", " "))

# 4. Create the "Tags" column by combining everything
df['tags'] = df['genre_clean'] + " " + df['presentation']

# We only need the title and tags now for training
new_df = df[['title', 'tags']].copy()

# Lowercase everything
new_df['tags'] = new_df['tags'].apply(lambda x: str(x).lower())

# 5. Vectorization
print("Vectorizing tags...")
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(new_df['tags']).toarray()

# 6. Calculate Cosine Similarity
print("Calculating similarity matrix...")
similarity = cosine_similarity(vectors)

# 7. Save the model
print("Saving model files...")
models_dir = BASE_DIR / "models"
models_dir.mkdir(exist_ok=True)

pickle.dump(new_df.to_dict(), open(models_dir / 'movies_dict.pkl', 'wb'))
pickle.dump(similarity, open(models_dir / 'similarity.pkl', 'wb'))

print("Training Complete! Model saved in models/ directory.")
