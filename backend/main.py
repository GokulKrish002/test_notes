# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

app = FastAPI(title="Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(DATABASE_URL)
db = client.notes_app

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserCreate(BaseModel):
    user_name: str
    user_email: EmailStr
    password: str

class User(BaseModel):
    user_id: str
    user_name: str
    user_email: EmailStr
    created_on: datetime
    last_update: datetime

class UserInDB(User):
    hashed_password: str

class NoteCreate(BaseModel):
    note_title: str
    note_content: str

class NoteUpdate(BaseModel):
    note_title: Optional[str] = None
    note_content: Optional[str] = None

class Note(BaseModel):
    note_id: str
    note_title: str
    note_content: str
    user_id: str
    created_on: datetime
    last_update: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(user_email: str):
    user = await db.users.find_one({"user_email": user_email})
    if user:
        user["user_id"] = str(user["_id"])
        return UserInDB(**user)

async def authenticate_user(user_email: str, password: str):
    user = await get_user(user_email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"_id": ObjectId(token_data.user_id)})
    if user is None:
        raise credentials_exception
    
    user["user_id"] = str(user["_id"])
    return UserInDB(**user)

@app.post("/api/auth/signup", response_model=User)
async def signup(user: UserCreate):
    try:
        hashed_password = get_password_hash(user.password)
        now = datetime.utcnow()
        
        user_dict = {
            "_id": ObjectId(),
            "user_name": user.user_name,
            "user_email": user.user_email,
            "hashed_password": hashed_password,
            "created_on": now,
            "last_update": now
        }
        
        await db.users.insert_one(user_dict)
        
        return {
            "user_id": str(user_dict["_id"]),
            "user_name": user.user_name,
            "user_email": user.user_email,
            "created_on": now,
            "last_update": now
        }
    except Exception as e:
        print(f"Error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
@app.post("/api/auth/signin", response_model=Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/signout")
async def signout():
    return {"detail": "Successfully signed out"}

@app.get("/api/notes", response_model=List[Note])
async def get_notes(current_user: User = Depends(get_current_user)):
    notes = []
    cursor = db.notes.find({"user_id": current_user.user_id})
    
    async for doc in cursor:
        doc["note_id"] = str(doc["_id"])
        notes.append(Note(**doc))
    
    return notes

@app.post("/api/notes", response_model=Note)
async def create_note(note: NoteCreate, current_user: User = Depends(get_current_user)):
    now = datetime.utcnow()
    
    note_dict = {
        "_id": ObjectId(),
        "note_title": note.note_title,
        "note_content": note.note_content,
        "user_id": current_user.user_id,
        "created_on": now,
        "last_update": now
    }
    
    await db.notes.insert_one(note_dict)
    
    return {
        "note_id": str(note_dict["_id"]),
        "note_title": note.note_title,
        "note_content": note.note_content,
        "user_id": current_user.user_id,
        "created_on": now,
        "last_update": now
    }

@app.get("/api/notes/{note_id}", response_model=Note)
async def get_note(note_id: str, current_user: User = Depends(get_current_user)):
    try:
        note = await db.notes.find_one({"_id": ObjectId(note_id), "user_id": current_user.user_id})
    except:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note["note_id"] = str(note["_id"])
    return note

@app.get("/api/auth/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/api/notes/{note_id}", response_model=Note)
async def update_note(note_id: str, note_update: NoteUpdate, current_user: User = Depends(get_current_user)):
    try:
        note = await db.notes.find_one({"_id": ObjectId(note_id), "user_id": current_user.user_id})
    except:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_update.dict(exclude_unset=True)
    update_data["last_update"] = datetime.utcnow()
    
    await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": update_data}
    )
    
    updated_note = await db.notes.find_one({"_id": ObjectId(note_id)})
    updated_note["note_id"] = str(updated_note["_id"])
    
    return updated_note

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str, current_user: User = Depends(get_current_user)):
    try:
        note = await db.notes.find_one({"_id": ObjectId(note_id), "user_id": current_user.user_id})
    except:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    await db.notes.delete_one({"_id": ObjectId(note_id)})
    return {"detail": "Note deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)