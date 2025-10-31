from fastapi import APIRouter
import pandas as pd

router = APIRouter()

@router.get("/data")
def get_plot_data():
    df = pd.DataFrame({
        "time": range(10),
        "speed": [i * 5 for i in range(10)]
    })
    return df.to_dict(orient="records")
