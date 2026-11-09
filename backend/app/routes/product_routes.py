from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.schemas.product import ProductCreate
from app.models.product_model import Product
from app.database.database import SessionLocal
from app.core.exceptions import ApiException
from app.core.responses import success
from app.core.auth_dependency import get_current_user
from app.core.roles import require_role


router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("editor"))
):

    new_product = Product(
        key=product.key,
        name=product.name,
        brand=product.brand,
        key_type=product.key_type,
        spaces=product.spaces,
        depths=product.depths,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    existing_product = (
        db.query(Product)
        .filter(Product.key == product.key)
        .first()
    )

    if existing_product:
        raise ApiException(409, "Ya existe un producto con esa llave")
    return success(
        data= {
            "id": new_product.id
        },
        message="Producto guardado"
    )


@router.get("/product/{key}")
def get_product(
    key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):

    product = (
        db.query(Product)
        .filter(Product.key == key)
        .first()
    )

    if not product:

        raise ApiException(404,"Producto no encontrado")

    return success(
        data={
            "key": product.key,
            "name": product.name,
            "brand": product.brand,
            "key_type": product.key_type,
            "spaces": product.spaces,
            "depths": product.depths
        },
        message="Producto encontrado"
    )

@router.get("/products/all")
def get_all_products(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    products = db.query(Product).all()

    return success(
        data=[
            {
                "key": product.key,
                "name": product.name,
                "brand": product.brand,
                "key_type": product.key_type,
                "spaces": product.spaces,
                "depths": product.depths
            }
            for product in products
        ],
        message="Productos encontrados",
    )
    