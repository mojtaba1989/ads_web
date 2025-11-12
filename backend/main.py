from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import video, plots, scenario, lidar, info
from routes import map as map_router
import home
from contextlib import asynccontextmanager
import pandas as pd
import os
from utils.common import *

TEST_DATA_DIR = "D:\\presentation_sample_dads\\presentation_dads\\csv\\2025-05-08-10-57-27_8.bag.pos"
TEST_VIDEO_DIR = "D:\\presentation_sample_dads\\presentation_dads\\cam_mono_2025_05_08_14_17_15_Ngpu.mp4"
DADS_DIR = "D:\\"
# DADS_DIR = "/data"


file_path = os.path.abspath(__file__)
dir_path = os.path.dirname(file_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context: runs once on startup and once on shutdown.
    """
    cleanup(app)

    yield

    cleanup(app)
    print("🧹 Cleaned up global state.")

def cleanup(app: FastAPI):
    app.state.file_list = []
    app.state.dads = None
    app.state.gps = None
    app.state.gps_df = None
    app.state.rostime = None
    app.state.video_sync = None
    app.state.video_path = None
    app.state.scenarios = None
    app.state.plot_list = None
    app.state.lidar = None



app = FastAPI(title="Web Dashboard Backend", lifespan=lifespan)

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
app.include_router(scenario.router, prefix="/api/scenario")
app.include_router(lidar.router, prefix="/api/lidar")
app.include_router(info.router, prefix="/api/info")
app.include_router(home.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend is running"}

        
