from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
import numpy as np
from utils.common import *


router = APIRouter()

# DATA_DIR = "/data/csv/2025-05-08-10-57-27_8.bag.pos"

@router.get("/route")
def get_route(request: Request):
    """
    Return GPS route points from CSV file
    """
    if request.app.state.gps_df is None:
        return JSONResponse({"error": "POS not found"}, status_code=404)

    route = [
        {"time": int(row["time"]), "lat": float(row["lat"]), "lon": float(row["lon"])}  
        for _, row in request.app.state.gps_df.iterrows()
    ]
    return JSONResponse(content=route)


@router.get("/nearest")
def get_nearest(request: Request, lat: float = Query(...), lon: float = Query(...)):
    """
    Find the closest GPS point in the dataset to the given lat/lon.
    """
    if request.app.state.gps_df is None:
        return JSONResponse({"error": "POS not found"}, status_code=404)

    df = request.app.state.gps_df.copy()
    
    coords = np.radians(df[["lat", "lon"]])
    target = np.radians([lat, lon])
    dlat = coords["lat"] - target[0]
    dlon = coords["lon"] - target[1]
    a = np.sin(dlat / 2)**2 + np.cos(target[0]) * np.cos(coords["lat"]) * np.sin(dlon / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    distances = 6371000 * c  # meters

    idx = np.argmin(distances)
    row = df.iloc[idx]
    request.app.state.rostime = int(row["time"])
    
    return JSONResponse(content={"closest_time": int(row["time"]),
                                 "lat": row["lat"],
                                 "lon": row["lon"],
                                 "distance_m": round(float(distances[idx]), 2)})  # round(distances[idx], 2)


@router.get("/rostime")
def get_rostime(request: Request, rostime: int = Query(...)):
    if request.app.state.gps is None:
        return JSONResponse({"error": "POS not found"}, status_code=404)
    best_time = find_closest_time(request.app.state.gps, rostime)
    loc = request.app.state.gps[best_time]
    return JSONResponse(content={"lat": float(loc[0]), "lon": float(loc[1])}, status_code=200)