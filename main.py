from fastapi import FastAPI, Form, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, constr, EmailStr
from src.password_utils import hash_password, validate_password
from src.database import Database
from src.news_utils import get_top_6_articles
from datetime import date

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
    joined_at: date

@app.get("/")
async def index(request: Request):
    user_id = request.cookies.get("user_id")
    username = request.cookies.get("username")

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "user_id": user_id,
            "username": username
        }
    )

@app.get("/forum")
async def forum(request: Request):
    user_id = request.cookies.get("user_id")
    username = request.cookies.get("username")

    return templates.TemplateResponse(
        "forum.html",
        {
            "request": request,
            "user_id": user_id,
            "username": username
        }
    )

@app.get("/success")
async def success(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})

@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login_post(request: Request, email: str = Form(...), password: str = Form(...)):
    cursor = db.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    if user:
        if validate_password(password, user[3]):
            response = RedirectResponse(url="/dashboard", status_code=303)
            response.set_cookie(
                key="user_id",
                value=user[0],
                httponly=True,
                secure=True,
                max_age=60 * 60 * 24
            )
            response.set_cookie(
                key="username",
                value=user[1],
                httponly=True,
                secure=True,
                max_age=60 * 60 * 24
            )
            return response
    return RedirectResponse(url="/login", status_code=303)

@app.get("/logout")
async def logout(request: Request):
    response = RedirectResponse(url=request.headers.get("referer"), status_code=303)
    response.delete_cookie("user_id")
    response.delete_cookie("username")
    return response

@app.get("/dashboard")
async def dashboard(request: Request):
    user_id = request.cookies.get("user_id")
    username = request.cookies.get("username")
    
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user_id": user_id,
            "username": username
        }
    )

@app.get("/register")
async def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    hashed_password = hash_password(password)
    joined_at = date.today()

    user = UserCreate(username=username, email=email, password=hashed_password, joined_at=joined_at)

    db.execute("INSERT INTO users (username, email, password, joined_at) VALUES (?, ?, ?, ?)", (user.username, user.email, user.password, user.joined_at))

    return RedirectResponse(url="/success", status_code=303)

@app.get("/news")
async def get_news():
    return {"news": get_top_6_articles()}
