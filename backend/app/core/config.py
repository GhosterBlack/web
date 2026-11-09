from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
OPENAI_KEY = os.getenv("OPENAI_KEY")