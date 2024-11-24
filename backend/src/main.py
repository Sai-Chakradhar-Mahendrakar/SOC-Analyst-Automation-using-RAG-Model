import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import uvicorn
from src.api.app import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
