"""
Compatibility alias: Exports the FastAPI app from main.py
"""
from main import app

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
