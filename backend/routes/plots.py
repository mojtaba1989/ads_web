from fastapi import APIRouter, Request, Response, Query
from fastapi.responses import FileResponse, Response, JSONResponse
import pandas as pd
from utils.common import *

router = APIRouter()

@router.get("/list")
def get_plot_list(request: Request):
    if request.app.state.plot_list is None:
        return Response(status_code=500)
    return JSONResponse(content={"list": request.app.state.plot_list})

@router.get("/data")
def get_plot_data(request: Request, topic: str = Query(...)):
    if request.app.state.dads is None:
        return Response(status_code=500)
    topic, col = topic.split(".")
    data = load_chart(request.app.state.dads, topic, col)
    return JSONResponse(content=data, status_code=200)
    
