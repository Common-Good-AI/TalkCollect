import os
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
import crud, schemas, deps
from starlette.responses import RedirectResponse

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# Allow http for local dev
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive.file"
]

@router.get("/login")
def login(request: Request):
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/auth/callback" # TODO: Make this dynamic
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    return {"url": authorization_url}

@router.get("/callback")
def callback(code: str, db: Session = Depends(deps.get_db)):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
         raise HTTPException(status_code=500, detail="Google Credentials not configured")

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/auth/callback"
    )
    
    flow.fetch_token(code=code)
    credentials = flow.credentials
    
    # Verify the token
    # Note: For real verification we'd verify the ID token. 
    # Simply using the credentials to get user info is also an option.
    
    try:
        id_info = id_token.verify_oauth2_token(
            credentials.id_token, requests.Request(), GOOGLE_CLIENT_ID
        )
        
        google_sub = id_info.get("sub")
        email = id_info.get("email")
        name = id_info.get("name")
        picture = id_info.get("picture")
        
        user = crud.get_user_by_google_sub(db, google_sub=google_sub)
        if not user:
            user_in = schemas.UserCreate(
                email=email,
                name=name,
                google_sub=google_sub,
                picture=picture
            )
            user = crud.create_user(db, user_in)
        
        # In a real app, we would issue our own JWT here.
        # For this prototype, I'll just return the user info and maybe the google creds 
        # (though transferring creds to frontend is questionable security... 
        # better to store creds in DB or session and give frontend a session cookie).
        
        # For simplicity in this demo:
        return {"message": "Login successful", "user": user, "access_token": credentials.token} 
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
