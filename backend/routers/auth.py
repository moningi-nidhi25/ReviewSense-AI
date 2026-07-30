from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from core.limiter import limiter
from core.oauth import oauth
from models.user import User
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserOut
from services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_token_response(user: User) -> TokenResponse:
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut(id=str(user.id), email=user.email))


@router.post("/register", status_code=201, response_model=TokenResponse)
@limiter.limit(settings.RATE_LIMIT_REGISTER)
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(db, payload)
    return _to_token_response(user)


@router.post("/login", response_model=TokenResponse)
@limiter.limit(settings.RATE_LIMIT_LOGIN)
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, payload)
    return _to_token_response(user)


@router.post("/logout", status_code=204)
def logout():
    # JWTs are stateless — logout is a client-side action (discard the token).
    # This endpoint exists so the frontend has a symmetrical call to make.
    return


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(id=str(current_user.id), email=current_user.email)


# --------------------------------------------------------------------------
# OAuth: Google
# --------------------------------------------------------------------------


@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = str(request.url_for("google_callback"))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo") or await oauth.google.userinfo(token=token)

    user = auth_service.get_or_create_oauth_user(
        db, email=userinfo["email"], provider="google", oauth_id=userinfo.get("sub", "")
    )
    jwt_token = auth_service.issue_token(user)
    return RedirectResponse(f"{settings.FRONTEND_URL}/oauth-callback?token={jwt_token}")


# --------------------------------------------------------------------------
# OAuth: GitHub
# --------------------------------------------------------------------------


@router.get("/github/login")
async def github_login(request: Request):
    redirect_uri = str(request.url_for("github_callback"))
    return await oauth.github.authorize_redirect(request, redirect_uri)


@router.get("/github/callback", name="github_callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    profile_resp = await oauth.github.get("user", token=token)
    profile = profile_resp.json()

    email = profile.get("email")
    if not email:
        # GitHub only returns a primary email here if the user made it public;
        # otherwise fall back to the dedicated emails endpoint.
        emails_resp = await oauth.github.get("user/emails", token=token)
        emails = emails_resp.json()
        primary = next((e for e in emails if e.get("primary")), emails[0] if emails else None)
        email = primary["email"] if primary else f"{profile['id']}@users.noreply.github.com"

    user = auth_service.get_or_create_oauth_user(
        db, email=email, provider="github", oauth_id=str(profile.get("id"))
    )
    jwt_token = auth_service.issue_token(user)
    return RedirectResponse(f"{settings.FRONTEND_URL}/oauth-callback?token={jwt_token}")
