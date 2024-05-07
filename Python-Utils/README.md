# Python Utilities

This section of the repository utilizes a virtual environment to manage Python dependencies and ensure consistent development and runtime environments for users. Below are instructions for setting up and using the virtual environment.

## Initial Setup (One time step)
If you do not already have Python installed, do as follows:
- Go to https://www.python.org/downloads/ and download the most recent version of Python
- When it is downloading, check the box to add it to your PATH. This will ensure that you can `pip` install and use python from the PowerShell in Windows. Note: steps may be different for Mac or Linux.
- If `pip install` is not working as intended, you likely do not have Python downloaded, or do not have it being referenced in your PATH.
  
## Workflow Steps
<b>What to do to source the correct libraries and get started using the tools or developing!</b>

### 1. Navigate to python directory location
```bash
cd /path/to/Python-Utils
```

### 2. Source the Virtual Environment
Windows
```bash
venv\Scripts\activate
```
-OR-
macOS/Linux
```bash
source venv/bin/activate
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
Run the following to create the virtual environment in your current folder. NOTE: you may have to first pip install virtualenv by running `pip install virtualenv`. 
```bash
python -m venv venv
```
If this does not work, you may not have Python installed. See above `Initial Setup` section for details. It could also be that you need to call `python3` instead of `python` in the command above.

## Developer Upkeep Steps
### 1. Adding libraries to requirements.txt
To add libaries to requirements.txt, simply add the name of the library and then a version constraint to abide by. For example if the project relies on numpy and sympy and they both must be version 1.0.0 or greater, add the following to the file:
```bash
numpy>=1.0.0
sympy>=1.0.0
```
