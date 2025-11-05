from fastapi import APIRouter, Request, Response, Query
from fastapi.responses import FileResponse, Response, JSONResponse



router = APIRouter()

@router.get("/scenario")
def get_scenario(request: Request):
    if request.app.state.scenarios is None:
        return Response(status_code=500)
    return JSONResponse(request.app.state.scenarios)