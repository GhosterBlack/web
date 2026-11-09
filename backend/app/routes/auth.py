from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User
from app.schemas.user import (UserRegister, UserLogin)
from app.core.security import (hash_password, verify_password, create_access_token)
from app.core.exceptions import ApiException
from app.core.responses import success

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == credentials.email)
        .first()
    )

    if not user:

        raise ApiException(
            401,
            "Credenciales inválidas: El usuario no ha sido registrado"
        )

    if not verify_password(
        credentials.password,
        user.password
    ):

        raise ApiException(
            401,
            "Credenciales inválidas: La contraseña no coincide"
        )

    token = create_access_token({
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

    return success(data={"user_token": token}, message="usuario encontrado")


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    exists = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if exists:
        raise ApiException(
            409,
            "El usuario ya existe"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return success(message="Usuario registrado con exito")