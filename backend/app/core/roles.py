from fastapi import Depends

from app.core.auth_dependency import get_current_user
from app.core.exceptions import ApiException


def require_role(roles):

    def role_checker (current_user = Depends(get_current_user)):

        if current_user.role not in roles:

            raise ApiException(
                400,
                "No tienes permisos"
            )

        return current_user

    return role_checker