from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv
import uuid
import asyncio

load_dotenv()

app = FastAPI(title="MLIMI Smart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")

class ChatRequest(BaseModel):
    query: str
    query_type: str = "General"

jobs = {}

@app.get("/")
async def root():
    return {"message": "MLIMI Smart API is running", "status": "healthy"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        if OPENAI_API_KEY:
            import openai
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            messages = [
                {"role": "system", "content": "You are a helpful farming assistant for Malawi farmers."},
                {"role": "user", "content": request.query}
            ]
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            return {
                "response": response.choices[0].message.content,
                "query_type": request.query_type
            }
        else:
            demo = {
                "General": "Moni! I'm your farming assistant. call for real responses.",
                "Farming Advice": "For healthy crops, ensure proper spacing and regular watering.",
                "Pest & Disease Control": "Use neem leaves or soap spray as natural pesticides.",
                "Business & Marketing": "Consider forming cooperatives for better prices."
            }
            return {
                "response": demo.get(request.query_type, demo["General"]),
                "query_type": request.query_type
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return {
        "predictions": [
            {"class": "Healthy", "confidence": 0.85},
            {"class": "Leaf Blight", "confidence": 0.10}
        ],
        "advice": "Demo prediction. Add your ML model for real results.",
        "unknown_image": False
    }

@app.post("/predict/async")
async def predict_async(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "job_id": job_id,
        "status": "pending",
        "progress": 0,
        "result": None,
        "error": None
    }
    
    async def process_job():
        jobs[job_id]["status"] = "processing"
        for i in range(0, 101, 20):
            await asyncio.sleep(1)
            jobs[job_id]["progress"] = i
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = {
            "predictions": [{"class": "Healthy", "confidence": 0.85}],
            "advice": "Demo prediction complete."
        }
    
    asyncio.create_task(process_job())
    return {"job_id": job_id}

@app.get("/predict/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/weather")
async def get_weather(lat: Optional[float] = None, lon: Optional[float] = None):
    try:
        if WEATHER_API_KEY and lat and lon:
            import requests
            url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
            response = requests.get(url, timeout=10)
            data = response.json()
            return {
                "temperature": data["main"]["temp"],
                "description": data["weather"][0]["description"],
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"]
            }
        else:
            return {
                "temperature": 28,
                "description": "Partly cloudy",
                "humidity": 65,
                "wind_speed": 12,
                "note": "Add WEATHER_API_KEY to .env for real weather"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
