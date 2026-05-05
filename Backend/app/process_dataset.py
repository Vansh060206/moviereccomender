import pandas as pd
import json
import warnings
warnings.filterwarnings('ignore')

print("Loading dataset...")
df = pd.read_csv('d:/Codec_Internship/Movierecommender/Backend/app/data/movies_metadata.csv', low_memory=False)
df = df.dropna(subset=['production_countries', 'original_language'])

# Filter for Indian movies or Hindi language
ind_df = df[df['production_countries'].str.contains('India', case=False, na=False) | (df['original_language'] == 'hi')].copy()

# Helper to extract genres
def extract_genres(x):
    try:
        # Some JSON strings use single quotes, let's fix them or use eval
        import ast
        genres = ast.literal_eval(x)
        return '|'.join([g['name'] for g in genres])
    except:
        return ''

ind_df['genre'] = ind_df['genres'].apply(extract_genres)
ind_df['year'] = ind_df['release_date'].astype(str).str[:4]
ind_df['rating'] = ind_df['vote_average']
ind_df['presentation'] = ind_df['overview']
ind_df['imdb_id'] = ind_df['imdb_id']
# If poster_path exists, prefix it with TMDB url
ind_df['url'] = ind_df['poster_path'].apply(lambda x: f"https://image.tmdb.org/t/p/w500{x}" if pd.notna(x) and str(x) != 'nan' else "")

# The backend recommender uses these columns
# 'title', 'year', 'rating', 'genre', 'url', 'presentation'
final_df = ind_df[['title', 'year', 'rating', 'genre', 'url', 'presentation', 'imdb_id']]
final_df = final_df.fillna('')

output_path = 'd:/Codec_Internship/Movierecommender/Backend/app/data/bollywood_movies.csv'
final_df.to_csv(output_path, index=False)
print("Saved", output_path, "with", len(final_df), "movies.")
