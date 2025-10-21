# Import necessary modules
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

# MySQL connection URI: mysql+pymysql://username:password@host/database
load_dotenv()
DB_USER = os.getenv("DB_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "")
DB_NAME = os.getenv("DB_NAME", "")

# Base connection (without specifying the DB name)
engine_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/"

# Full URI with database name
database_uri = f"{engine_url}{DB_NAME}"

# Create engine
engine = create_engine(database_uri)

# Check if database exists, if not create it
if not database_exists(engine.url):
    print(f"Database '{DB_NAME}' not found. Creating...")
    create_database(engine.url)
    print("Database created successfully.")
else:
    print("Database already exists.")
SQLALCHEMY_DATABASE_URI = database_uri
SQLALCHEMY_TRACK_MODIFICATIONS = False
