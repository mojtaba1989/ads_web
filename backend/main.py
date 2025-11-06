from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import video, plots, scenario, lidar
from routes import map as map_router
from contextlib import asynccontextmanager
import pandas as pd
import os
import cv2
from utils.common import *

TEST_DATA_DIR = "D:\\presentation_sample_dads\\presentation_dads\\csv\\2025-05-08-10-57-27_8.bag.pos"
TEST_VIDEO_DIR = "D:\\presentation_sample_dads\\presentation_dads\\cam_mono_2025_05_08_14_17_15_Ngpu.mp4"
DADS_DIR = "D:\\"


file_path = os.path.abspath(__file__)
dir_path = os.path.dirname(file_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context: runs once on startup and once on shutdown.
    """
    # --- Startup ---
    DADS_LIST = list_dads(DADS_DIR)
    TEST_DADS = DADS_LIST[1]
    if os.path.exists(TEST_DADS):
        app.state.dads = load_dads(TEST_DADS)
        app.state.gps = load_gps(app.state.dads)
        app.state.gps_df = get_gps_df(app.state.gps)
        app.state.rostime = app.state.gps_df["time"].min()
        app.state.video_list = load_video(app.state.dads)
        app.state.video_sync = get_video_sync(app.state.dads)
        app.state.video_path = app.state.video_list[0]
        app.state.video_sync = change_video(app.state.video_sync, app.state.video_path)
        app.state.scenarios = app.state.dads.get("scenarios", {})
        app.state.plot_list = get_plot_list(app.state.dads)
        app.state.lidar = load_lidar_dict(app.state.dads)
        print(f"✅ Loaded GPS data from {TEST_DADS} ({len(app.state.gps_df)} rows)")
        print(f"✅ Loaded video from {app.state.video_path}")
    else:
        app.state.dads = None
        app.state.gps = None
        app.state.gps_df = None
        app.state.rostime = None
        app.state.video_list = None
        app.state.video_sync = None
        app.state.video_path = None
        app.state.scenarios = None
        app.state.plot_list = None
        app.state.lidar = None
        print(f"⚠️ GPS data file not found at {TEST_DADS}")

    # Yield control to allow the app to run
    yield

    # --- Shutdown ---
    app.state.dads = None
    app.state.gps = None
    app.state.gps_df = None
    app.state.rostime = None
    app.state.video_list = None
    app.state.video_sync = None
    app.state.video_path = None
    app.state.scenarios = None
    app.state.plot_list = None
    app.state.lidar = None
    print("🧹 Cleaned up global state.")


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

@app.get("/")
def root():
    return {"message": "Backend is running"}

        
