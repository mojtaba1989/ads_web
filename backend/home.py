from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from utils.common import *

router = APIRouter()

ROOT_DIR = "E:\DATABASE"

@router.get("/recordings")
def get_recordings(request: Request):
    dads_list = list_dads(ROOT_DIR)
    list_dict = []
    for idx, file in enumerate(dads_list):
        temp_dict = load_dads(file)
        time_str = temp_dict.get("info", {}).get("starting time", "")
        trip_duration = temp_dict.get("info", {}).get("trip duration", "")
        traveled_distance = temp_dict.get("info", {}).get("traveled distance mi", "")
        date_time = time_str.split(".")[0]
        name = os.path.basename(file).split(".")[0]
        description = f"Date/Time: {date_time} - Recording Duration: {trip_duration} - Traveled Distance: {traveled_distance} mi" # description
        temp = {"id": f"{idx}", "file": file, "description": description}
        list_dict.append(temp)
    request.app.state.file_list = list_dict
    return JSONResponse(content=list_dict, status_code=200)

@router.get("/recordings/{recordingId}")
def get_recording(request: Request, recordingId: str):
    for rec in request.app.state.file_list:
        if rec["id"] == recordingId:
            request.app.state.dads = load_dads(rec["file"])
            request.app.state.gps = load_gps(request.app.state.dads)
            request.app.state.gps_df = get_gps_df(request.app.state.gps)
            request.app.state.rostime = request.app.state.gps_df["time"].min()
            request.app.state.video_path = load_video(request.app.state.dads)
            request.app.state.video_sync = get_video_sync(request.app.state.dads)
            request.app.state.scenarios = request.app.state.dads.get("scenarios", {})
            request.app.state.plot_list = get_plot_list(request.app.state.dads)
            request.app.state.lidar = load_lidar_dict(request.app.state.dads)
            return JSONResponse(content=rec, status_code=200)
        
    request.app.state.dads = None
    request.app.state.gps = None
    request.app.state.gps_df = None
    request.app.state.rostime = None
    request.app.state.video_sync = None
    request.app.state.video_path = None
    request.app.state.scenarios = None
    request.app.state.plot_list = None
    request.app.state.lidar = None
    return JSONResponse(content={}, status_code=404)