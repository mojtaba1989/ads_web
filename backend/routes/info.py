from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from utils.common import *

router = APIRouter()


@router.get("/info")
def get_info(request: Request):
    if request.app.state.dads is None:
        return JSONResponse(content = {}, status_code=500)
    info = request.app.state.dads.get("info", {})
    return JSONResponse(content = info, status_code=200)

@router.get("/walltime")
def update_walltime(rostime: int = Query(...)):
    walltime_disct = {'walltime': get_walltime(rostime)}
    return JSONResponse(content = walltime_disct, status_code=200)