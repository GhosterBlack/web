import os

from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pwdlib import PasswordHash


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

TOKEN_EXPIRE_HOURS = 24
password_hash = PasswordHash.recommended()

def create_access_token(data: dict):

    payload = data.copy()

    payload["exp"] = (
        datetime.utcnow()
        + timedelta(
            hours=TOKEN_EXPIRE_HOURS
        )
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None

def hash_password(password: str):

    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    return password_hash.verify(
        plain_password,
        hashed_password
    )