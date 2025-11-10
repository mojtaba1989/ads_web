from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from utils.common import *


router = APIRouter()

@router.get("/objects")
def get_objects(request: Request, rostime: int = Query(...)):
    if request.app.state.lidar is None:
        return JSONResponse(content=[], status_code=404)
    best_time = find_closest_time(request.app.state.lidar, rostime)
    res = request.app.state.lidar[best_time]
    return JSONResponse(content=res, status_code=200)