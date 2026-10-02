import os
import sys

# Ensure the root directory is on the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Vercel ASGI serverless handler exports FastAPI app
