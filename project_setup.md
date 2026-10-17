# Project Setup Guide

How to install and run the Financial Asset Manager on your computer.

## 1. Install first (one time)

1. **Node.js**, any recent LTS version, from nodejs.org. It includes `npm`.
2. **Java JDK 21**. See the installation steps in section 2.
3. **No Maven needed.** The project includes its own wrapper (`mvnw`) and downloads Maven by itself.
4. **Internet on the first run.** Maven and npm download their packages then.
5. **Ports 5174 and 8081 free.** Close anything else using them.

## 2. Installing Java JDK 21

### Windows

1. Go to **adoptium.net** and click the **Latest LTS Release** button (choose version **21** if it offers another).
2. Pick **Windows**, **x64** and **.msi**, then run the installer.
3. On the "Custom Setup" screen, turn on **"Set JAVA_HOME variable"** and **"Add to PATH"**. This is the step people most often miss.
4. Close any open terminal windows and open a new one.

Or, if you have the winget tool, one command does it:

```bash
winget install EclipseAdoptium.Temurin.21.JDK
```

### Mac

With Homebrew:

```bash
brew install openjdk@21
```

Homebrew's Java is not found automatically, so also run this one-time step to link it:

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

Without Homebrew, download the **.pkg** installer from **adoptium.net** instead. It sets everything up by itself and is the easier option.

### Linux (Ubuntu or Debian)

```bash
sudo apt install openjdk-21-jdk
```

### Check that it worked

In a new terminal window:

```bash
java -version
```

It should say version 21. If it says a different version, or "command not found", the PATH or `JAVA_HOME` step was skipped. On Windows, redo the installer with those two options turned on.

Notes:

- Get the **JDK**, not the **JRE**. Maven needs the JDK.
- A newer JDK such as 22 or 23 will probably work, but 21 is the version the project was tested with.

## 3. Run the project

Use two separate terminal windows. Start the backend first.

### Backend

Mac or Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

### Frontend

The same on any system:

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5174** in your browser.

### Good to know

- **Starting order:** if the frontend runs without the backend, the pages show "Could not load data. Is the backend running?"
- **Java setup:** if `./mvnw` says Java is not found, `JAVA_HOME` must point at the JDK 21 install. Running `java -version` should show 21.
- **Data resets:** the data lives in an H2 database that is kept in memory, so it goes back to the 10 starting assets each time the backend restarts.
- **Stopping:** press `Ctrl + C` in each terminal window.

## 4. Run the tests (optional)

Backend tests, in the `backend` folder:

```bash
./mvnw test
```

Frontend tests, in the `frontend` folder:

```bash
npm test
```

## 5. Before sending the project to someone

- **Leave out `frontend/node_modules`.** It is large, and `npm install` recreates it. The `backend/target` folder is already deleted.
- **Include the whole `Project 1` folder.** That means `README.md`, `docs/`, `frontend/` and `backend/`. The README also has the run steps.
- **Fix the About page first.** It still shows placeholder names and IDs until the real team members are added, so do that before recording the demo video.
