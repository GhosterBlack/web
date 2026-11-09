from fastapi import Header, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User

from app.core.security import verify_token
from app.core.exceptions import ApiException


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    if not authorization:

        raise ApiException(
            401,
            "Token requerido"
        )

    if not authorization.startswith("Bearer "):

        raise ApiException(
            401,
            "Formato de token inválido"
        )

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if not payload:

        raise ApiException(
            401,
            "Token inválido"
        )

    user = (
        db.query(User)
        .filter(User.id == payload["id"])
        .first()
    )

    if not user:

        raise ApiException(
            404,
            "Usuario no encontrado"
        )

    return user