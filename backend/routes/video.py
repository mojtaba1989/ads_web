from fastapi import APIRouter, Request, Response, Query
from fastapi.responses import FileResponse, StreamingResponse, Response, JSONResponse
import cv2
import threading
import pandas as pd
import numpy as np


router = APIRouter()


@router.get("/file")
def get_video_file(request: Request):
    if request.app.state.video_path is None:
        return FileResponse("", media_type="video/mp4")
    return FileResponse(request.app.state.video_path, media_type="video/mp4")

@router.get("/frame2rostime")
def get_video_frame(request: Request, frame_id: int = Query(...)):
    if request.app.state.video_sync is None:
        return Response(status_code=500)
    rostime = request.app.state.video_sync["current"].get(frame_id, 0)
    return JSONResponse(content={"frame_id": frame_id, "rostime": rostime}, status_code=200)


@router.get("/rostime2elapsed")
def get_rostime(request: Request, rostime: int = Query(...)):
    if request.app.state.video_sync is None:
        return Response(status_code=500)
    best_frame = min(request.app.state.video_sync["current"], key=lambda k: abs(request.app.state.video_sync["current"][k] - rostime))
    elapsed = best_frame / 15
    return JSONResponse(content={"frame_id": best_frame, "elapsed": elapsed}, status_code=200)

# ffmpeg -hwaccel cuda -i .\cam_mono_2025_05_08_14_17_15.mp4 -vf scale=1280:-1 -c:v h264_nvenc -preset fast -b:v 3M -an .\cam_mono_2025_05_08_14_17_15_Ngpu.mp4