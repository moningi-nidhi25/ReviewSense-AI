import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import decode_access_token
from models.user import User

# HTTPBearer parses the "Authorization: Bearer <token>" header for us.
# auto_error=False lets us raise our own 401 with a consistent message.
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validates the JWT from the Authorization header and loads the user.

    Use as a route/router dependency to protect endpoints:
        @router.get("/secret", dependencies=[Depends(get_current_user)])
    or to also access the user:
        def route(current_user: User = Depends(get_current_user)): ...
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")

    return user


# Alias matching the naming used in the spec ("requireAuth"/"verifyToken").
require_auth = get_current_user
