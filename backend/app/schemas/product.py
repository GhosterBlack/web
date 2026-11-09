from pydantic import BaseModel

class ProductCreate(BaseModel):

    key: str
    name: str
    brand: str
    key_type: str
    spaces: str
    depths: str