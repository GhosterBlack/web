from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB

from app.database.database import Base

class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    key = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    brand = Column(
        String,
        nullable=False
    )

    key_type = Column(
        String,
        nullable=False
    )

    spaces = Column(
        JSONB,
        nullable=False,
        default=list
    )

    depths = Column(
        JSONB,
        nullable=False,
        default=list
    )