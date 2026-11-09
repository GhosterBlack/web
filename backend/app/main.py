from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from fastapi.responses import JSONResponse
from fastapi import Request
from app.core.exceptions import ApiException
from app.routes.product_routes import router as product_router

from app.database.database import Base
from app.database.database import engine
from app.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ApiException)
async def api_exception_handler(
    request: Request,
    exc: ApiException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(
    request: Request, 
    exc: Exception
):

    print(exc)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Error interno del servidor"
        }
    )

app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(product_router)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

@app.get("/")
async def root():
    return {
        "success": True
    }