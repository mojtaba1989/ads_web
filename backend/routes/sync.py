from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
import pandas as pd
import os
import numpy as np

router = APIRouter()


@router.get("/rostime")
def get_sync(request: Request):
    if request.app.state.rostime is None:
        return JSONResponse({"rostime": None, "status": "no data yet"})
    return JSONResponse({"rostime": request.app.state.rostime, "status": "ok"})