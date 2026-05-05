def generate_explanation(input_movie: str, recommended_movie: str) -> str:
    """
    Generates an AI-like explanation for why a movie was recommended.
    """
    return f"Because you liked {input_movie}, you may enjoy {recommended_movie} due to similar genre and themes."
