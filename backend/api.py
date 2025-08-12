from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from unidecode import unidecode

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

DATABASE = './database.sqlite'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/check_user/")
async def check_user(name: str = Query(min_length=1)):
    # Normalize input: remove accents and convert to lowercase
    normalized_name = unidecode(name).lower()
    conn = get_db()
    cursor = conn.cursor()
    # Use LOWER() for case-insensitive matching
    cursor.execute("SELECT 1 FROM payments WHERE LOWER(name) = ?", (normalized_name,))
    user_exists = cursor.fetchone() is not None
    conn.close()
    return {"user_exists": user_exists}