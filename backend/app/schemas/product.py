from pydantic import BaseModel

class ProductCreate(BaseModel):

    key: str
    name: str
    price: float
    stock: int