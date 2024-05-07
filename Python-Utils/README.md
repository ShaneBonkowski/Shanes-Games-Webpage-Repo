# Python Utilities

This section of the repository utilizes a virtual environment to manage Python dependencies and ensure consistent development and runtime environments for users. Below are instructions for setting up and using the virtual environment. Note that the Python tools may not function properly if this step is not completed.

## Initial Setup (one-time steps)
### 1. Install Python
If you do not already have Python installed, do as follows:
- Go to https://www.python.org/downloads/ and download the most recent version of Python
- When it is downloading, check the box to add it to your PATH. This will ensure that you can `pip` install and use python from the PowerShell in Windows. Note: steps may be different for Mac or Linux.
- If `pip install` is not working as intended, you likely do not have Python downloaded, or do not have it being referenced in your PATH.

### 2. Install virtualenv library
```bash
pip install virtualenv
```

### 3. Set Up Virtual Environment
Navigate to the project directory.
```bash
cd /path/to/Python-Utils
```

Run the following to create the virtual environment in your current folder.
```bash
python -m venv venv
```
If this does not work, you may not have Python installed. See above sections for details. It could also be that you need to call `python3` instead of `python` in the command above.
  
### 4. Source the Virtual Environment
Windows
```bash
venv\Scripts\activate
```
-OR-<br><br>
macOS/Linux
```bash
source venv/bin/activate
```

### 3. Pip install dependencies from requirements.txt
```bash
pip install -r requirements.txt
```

## Developer Upkeep Steps
### 1. Adding libraries to requirements.txt
To add libaries to requirements.txt, simply add the name of the library and then a version constraint to abide by. For example if the project relies on numpy and sympy and they both must be version 1.0.0 or greater, add the following to the file:
```bash
numpy>=1.0.0
sympy>=1.0.0
```

## Developer One-time Steps
</b>This has already been completed, but is left here for future reference when creating Python projects.<b>
### 1. Create .gitignore if this has not been created already!
Navigate to the main directory for the project.
```bash
cd /path/to/ShanesGames
```

Create .gitignore file
```bash
New-Item .gitignore -type file
```

Add files or patterns for files to not be included in pushes to GitHub.
- Specifically for the case of Python and Virtual Environments, add `venv/` (or whatever you named your virtual environment) to the .gitignore file. This is so that a new user or developer can create their own fresh environment.

### 2. Create requirements.txt
Navigate to the project directory.
```bash
cd /path/to/Python-Utils
```

Create a new text file called `requirements.txt`
```bash
New-Item requirements.txt -type file
```

See `Developer Upkeep Steps` for how to add dependencies to this file.
