# Project Setup Instructions

## Step 1: Install Node.js

- Download and install Node.js from the official site: https://nodejs.org/
- After installation, open a terminal (PowerShell or Command Prompt) and verify the installation by running:

  ```powershell
  node -v
````

This should print the Node.js version, for example: `v22.16.0`

## Step 2: Open PowerShell as Administrator

* Search for **PowerShell** in the Start menu.
* Right-click **Windows PowerShell** and select **Run as administrator**.

## Step 3: Allow script execution

* In the admin PowerShell window, run the following command to allow script execution:

  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```

* When prompted, type `Y` and press Enter.

## Step 4: Install Yarn globally

* In the same admin PowerShell window, install Yarn by running:

  ```powershell
  npm install -g yarn
  ```

## Step 5: Use Yarn in the project

* Navigate to your project folder:

  ```powershell
  cd path\to\your\project
  ```

* Install project dependencies:

  ```powershell
  yarn
  ```

* Start the development server:

  ```powershell
  yarn dev
  ```

---