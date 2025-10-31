from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import video, plots
from routes import map as map_router

app = FastAPI(title="Web Dashboard Backend")

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(video.router, prefix="/api/video")
app.include_router(map_router.router, prefix="/api/map")
app.include_router(plots.router, prefix="/api/plots")
# app.include_router(scenario.router, prefix="/api/scenario")

@app.get("/")
def root():
    return {"message": "Backend is running"}
