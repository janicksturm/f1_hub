from fastapi import FastAPI, Form, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, constr, EmailStr
from src.password_utils import hash_password, validate_password
from src.database import Database
from src.news_utils import get_top_6_articles

app = FastAPI()
app.mount("/public", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="public")

db = Database("data/f1_forum.db")
db.connect()
db.create_user_table()

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=12)
    email: EmailStr
    password: constr(min_length=8)

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/forum")
async def forum(request: Request):
    return templates.TemplateResponse("forum.html", {"request": request})

@app.get("/success")
async def success(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})

@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register")
async def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    hashed_password = hash_password(password)

    user = UserCreate(username=username, email=email, password=hashed_password)

    db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (user.username, user.email, user.password))

    return RedirectResponse(url="/success", status_code=303)

@app.get("/news")
async def get_news():
    return {"news": get_top_6_articles()}
