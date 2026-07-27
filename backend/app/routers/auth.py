import hashlib
import random
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User, UserSession
from ..schemas import UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SESSION_COOKIE_NAME = "access_token"
SESSION_EXPIRATION_DAYS = 7


def _hash_password(password: str) -> str:
    """Simple SHA-256 hash for demo purposes."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def create_session(user_id: int, response: Response, db: Session) -> str:
    session_id = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(days=SESSION_EXPIRATION_DAYS)
    
    db_session = UserSession(
        session_id=session_id,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_session)
    db.commit()
    
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        httponly=True,
        samesite="lax",
        max_age=SESSION_EXPIRATION_DAYS * 24 * 3600
    )
    return session_id


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
        
    db_session = db.query(UserSession).filter(UserSession.session_id == session_id).first()
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session"
        )
        
    if db_session.expires_at < datetime.utcnow():
        db.delete(db_session)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )
        
    user = db.query(User).filter(User.id == db_session.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """Helper endpoint to list all seeded users for switching profiles in the UI"""
    return db.query(User).all()


@router.post("/switch/{user_id}", response_model=UserResponse)
def switch_active_user(user_id: int, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )
    
    create_session(user.id, response, db)
    return user


# ---------- CHECK IF EMAIL EXISTS ----------

class CheckEmailRequest(BaseModel):
    email: str

class CheckEmailResponse(BaseModel):
    exists: bool
    name: str | None = None

@router.post("/check-email", response_model=CheckEmailResponse)
def check_email(req: CheckEmailRequest, db: Session = Depends(get_db)):
    """Check if an email is already registered. Returns exists=True + user's name if found."""
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        return CheckEmailResponse(exists=True, name=user.name)
    return CheckEmailResponse(exists=False, name=None)


# ---------- LOGIN (existing user) ----------

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=UserResponse)
def login_user(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email."
        )
    
    # Verify password
    if user.password_hash != _hash_password(req.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password."
        )
    
    create_session(user.id, response, db)
    return user


# ---------- OTP LOGIN FLOW ----------

class SendOtpRequest(BaseModel):
    email: str

@router.post("/send-otp")
def send_otp(req: SendOtpRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate 6 digit code
    code = f"{random.randint(100000, 999999)}"
    user.otp_code = code
    db.commit()
    
    # In a real app, send via email/SMS. We just print to console.
    print(f"\n\n{'='*40}")
    print(f"MOCK EMAIL SENT TO: {user.email}")
    print(f"SUBJECT: Your Airbnb Login Code")
    print(f"BODY: Your verification code is: {code}")
    print(f"{'='*40}\n\n")
    
    return {"status": "success", "message": "OTP sent to email", "code": code}


class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp(req: VerifyOtpRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.otp_code or user.otp_code != req.otp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP code"
        )
        
    # Clear the OTP after successful use
    user.otp_code = None
    db.commit()
    
    create_session(user.id, response, db)
    return user


# ---------- REGISTER (new user) ----------

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    date_of_birth: str | None = None

@router.post("/register", response_model=UserResponse)
def register_user(req: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    new_user = User(
        name=req.name,
        email=req.email,
        password_hash=_hash_password(req.password),
        role="guest"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    create_session(new_user.id, response, db)
    return new_user


# ---------- LOGOUT ----------

@router.post("/logout")
def logout_user(request: Request, response: Response, db: Session = Depends(get_db)):
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if session_id:
        db.query(UserSession).filter(UserSession.session_id == session_id).delete()
        db.commit()
    response.delete_cookie(key=SESSION_COOKIE_NAME)
    return {"status": "success"}
