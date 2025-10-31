from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import pandas as pd
import os
from geopy.distance import geodesic

router = APIRouter()

DATA_DIR = "/data/csv/2025-05-08-10-57-27_8.bag.pos"  # ./backend/data/

@router.get("/route")
def get_route():
    """
    Return GPS route points from CSV file
    """
    if not os.path.exists(DATA_DIR):
        return JSONResponse({"error": "gps.csv not found"}, status_code=404)
    
    df = pd.read_csv(DATA_DIR)
    route = [
        {"time": int(row["time"]), "lat": float(row["lat"]), "lon": float(row["lon"])}
        for _, row in df.iterrows()
    ]
    return JSONResponse(content=route)


@router.get("/nearest")
def get_nearest(lat: float = Query(...), lon: float = Query(...)):
    """
    Find the closest GPS point in the dataset to the given lat/lon.
    """
    file_path = DATA_DIR
    # file_path = os.path.join(DATA_DIR, "gps.pos")
    if not os.path.exists(file_path):
        return JSONResponse({"error": "gps.pos not found"}, status_code=404)
    
    df = pd.read_csv(file_path)
    min_dist, closest_time = float("inf"), None

    for _, row in df.iterrows():
        d = geodesic((lat, lon), (row["lat"], row["lon"])).meters
        if d < min_dist:
            min_dist, closest_time = d, row["time"]
    
    return {"closest_time": int(closest_time), "distance_m": round(min_dist, 2)}
