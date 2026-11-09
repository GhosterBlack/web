from fastapi.responses import JSONResponse

def success(
    data=None,
    message="OK",
    status_code=200
):

    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )