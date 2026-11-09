from fastapi import APIRouter
from fastapi import APIRouter
from app.core.exceptions import ApiException
from app.core.auth_dependency import get_current_user
from fastapi import Depends
from app.core.responses import success

router = APIRouter()

@router.get("/")
async def get_users(
    current_user = Depends(get_current_user)
):

    return success(data=current_user, message="Usuario encontrado")

@router.get("/error")
async def test_error():

    raise ApiException(
        400,
        "Error de prueba"
    )
