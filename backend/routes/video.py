from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import cv2

router = APIRouter()

def video_stream():
    cap = cv2.VideoCapture("sample.mp4")
    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        _, buffer = cv2.imencode(".jpg", frame)
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")

@router.get("/stream")
def get_video():
    return StreamingResponse(video_stream(), media_type="multipart/x-mixed-replace; boundary=frame")
