# Python Utilities

This section of the repository utilizes a virtual environment to manage Python dependencies and ensure consistent development and runtime environments for users. Below are instructions for setting up and using the virtual environment.

## Workflow Steps
<b>What to do to source the correct libraries and get started using the tools or developing!</b>

### 1. Navigate to python directory location
```bash
cd /path/to/Python-Utils
```

### 2. Source the Virtual Environment
```bash
# Source virtual environment (on macOS/Linux)
source venv/bin/activate
```
-OR-
```bash
# Source virtual environment (on Windows)
venv\Scripts\activate
```

### 3. Pip install dependencies from requirements.txt
```bash
pip install -r requirements.txt
```

## Developer One-Time Setup Steps 
<b>This is already done but its good to document this here for future reference.</b>


### 1. Navigate to python directory location
```bash
# Navigate to project directory
cd /path/to/Python-Utils
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment (using virtualenv).
# NOTE: may have to first pip install virtualenv
python3 -m venv venv
```

## Developer Upkeep Steps
### 1. Adding libraries to requirements.txt
To add libaries to requirements.txt, simply add the name of the library and then a version constraint to abide by. For example if the project relies on numpy and sympy and they both must be version 1.0.0 or greater, add the following to the file:
```bash
numpy>=1.0.0
sympy>=1.0.0
```
