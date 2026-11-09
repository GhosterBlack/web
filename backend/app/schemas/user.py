from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):

    username: str
    email: EmailStr
    password: str
    role: str = "viewer"


class UserLogin(BaseModel):

    email: EmailStr
    password: str