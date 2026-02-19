from fastapi import FastAPI, Form
from pydantic import BaseModel, constr, EmailStr
from src.password_utils import hash_password, validate_password
from src.database import Database

app = FastAPI()

db = Database("data/f1_forum.db")
db.connect()
db.create_user_table()

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=12)
    email: EmailStr
    password: constr(min_length=8)

@app.post("/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    hashed_password = hash_password(password)

    user = UserCreate(username=username, email=email, password=hashed_password)

    db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (user.username, user.email, user.password))

    return {"username": user.username}
