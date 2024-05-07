# Python Utilities

This section of the repository utilizes a virtual environment to manage Python dependencies and ensure consistent development and runtime environments for users. Below are instructions for setting up and using the virtual environment.

## Developer One-Time Steps

### 1. Set Up Virtual Environment

```bash
# Navigate to project directory
cd /path/to/Python-Utils

# Create virtual environment (using virtualenv).
# NOTE: may have to first pip install virtualenv
python3 -m venv venv

# Activate virtual environment (on macOS/Linux)
source venv/bin/activate

# Activate virtual environment (on Windows)
venv\Scripts\activate
```

### 2. Install Dependencies into the Virtual Environment
```bash
# Install project dependencies from requirements.txt.
# As a developer, over time you can add to requirements.txt
# to include more of the neccesary python libraries.
pip install -r requirements.txt
```
