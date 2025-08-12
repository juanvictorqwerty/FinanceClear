import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class Demand(BaseModel):
    student_name: str
    
class response(BaseModel):
    message: str

app = FastAPI()

origins = [
    "*"  # Allows all origins
],

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
