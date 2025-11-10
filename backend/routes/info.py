from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/info")
def get_info(request: Request):
    if request.app.state.dads is None:
        return JSONResponse(content = {}, status_code=500)
    info = request.app.state.dads.get("info", {})
    return JSONResponse(content = info, status_code=200)