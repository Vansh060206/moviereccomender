# AI-Powered Movie Recommendation System

## Project Overview
This project is an advanced, production-ready Movie Recommendation System built to help users discover new cinematic experiences. By analyzing thousands of movies using a content-based filtering approach (via the TMDB 5000 dataset), the platform generates hyper-personalized AI recommendations based on genres, themes, cast, and crew. It pairs a robust FastAPI backend for high-performance machine learning inferences with a visually stunning, responsive, and highly interactive frontend built with Next.js and TailwindCSS.

## Features
- **AI-Powered Recommendations:** Instant content-based filtering using cosine similarity matrices.
- **Smart Explanations:** Explains *why* a movie was recommended based on semantic matching.
- **Modern User Interface:** Features glassmorphism, dynamic animations (Framer Motion), hover effects, and a fully responsive design.
- **Authentication:** Secure Firebase Authentication (Login & Signup) integrated with seamless UI/UX.
- **Personalized Watchlists:** Authenticated users can save and 'heart' their favorite movies instantly.
- **Real-time API Integration:** Uses the OMDb API dynamically as a fallback to fetch high-quality movie posters if absent in the raw dataset.

## Tech Stack
- **Frontend:** Next.js (React), TailwindCSS, Framer Motion, Axios, Lucide React
- **Backend:** FastAPI, Python, Pandas, Scikit-learn, Uvicorn
- **Machine Learning:** Natural Language Processing (NLP), CountVectorizer, Cosine Similarity
- **Database & Auth:** Firebase (Realtime Database & Authentication)

## Screenshots
*(Add placeholders or images of your project here)*
- `[Screenshot 1: Landing Page]`
- `[Screenshot 2: Recommendation Panel]`
- `[Screenshot 3: Auth Modal]`

## How to Run

### 1. Start the Backend API
Navigate to the `Backend/app` directory, activate your virtual environment, and run the server:
```bash
cd Backend/app
uvicorn main:app --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`. You can visit `/docs` for the interactive Swagger UI.

*(Note: To train the model yourself or regenerate the similarity matrix, you can run `python train_tmdb.py` inside the backend directory.)*

### 2. Start the Frontend Application
Open a new terminal, navigate to the `frontend` directory, install dependencies if needed, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will start at `http://localhost:3000`.

---
*Built with ❤️ for a seamless cinematic journey.*
