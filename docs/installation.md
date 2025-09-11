---
id: installation
title: JT-LAB Installation
sidebar_label: System Installation
---

# JT-Trader Installation

Complete guide for installing and configuring the JT-Trader platform for algorithmic trading.

<!-- TOC -->
* [License](#license)
* [System Requirements](#system-requirements)
* [Installation Methods](#installation-methods)
* [1. Installation via Launcher](#1-installation-via-launcher)
* [2. Installation via Docker](#2-installation-via-docker)
* [3. Direct Installation from GitHub](#3-direct-installation-from-github)
* [Installation Verification](#installation-verification)
* [Troubleshooting](#troubleshooting)
<!-- TOC -->

## License

JT-LAB has a dual license:

- 🟢 **Free** for personal, educational, and open-source use under [AGPLv3](LICENSE.md) license.
- 🔒 **Commercial use** requires a [paid license](mailto:am@jt-lab.com).


___

## System Requirements

To run JT-LAB, you need:

- **Node.js**: version 18 
- **Git**: for cloning the repository
- **Yarn**: for dependency management
- **Redis**: officially the system can work with file cache

## Installation Methods

JT-Trader can be installed in three ways depending on your needs:

### 🚀 Launcher - for users
If you simply want to use JT-Trader for trading and don't plan to develop your own robots, then **Launcher** is the ideal choice. It will automatically install everything needed and configure the system for you.

### 🐳 Docker - for server deployments  
If you want to deploy JT-Trader on your server or in the cloud, then **Docker** is a convenient way. You can easily scale the system and manage multiple instances.

### 📦 GitHub - for developers
If you plan to develop your own trading robots or make changes to the code, then installing from **GitHub** will give you full control over the source code and customization capabilities.

---

## 1. Installation via Launcher

**Launcher** is the simplest way to install JT-Trader. It automatically downloads all necessary components, configures the environment, and launches the application. Perfect for those who want to quickly start working with the system.

### Downloading Launcher

Choose the version for your operating system:

| Operating System | Download Link |
|------------------|---------------|
| **Windows** | [JT-Trader-Launcher-Setup.exe](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher-Setup.exe) |
| **macOS (Intel)** | [JT-Trader-Launcher.dmg](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher.dmg) * |
| **macOS (Apple Silicon)** | [JT-Trader-Launcher-arm64.dmg](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher-arm64.dmg) * |

:::important macOS Requirements
After installing the application on macOS, you need to remove the quarantine by running the command in the terminal:

```bash
sudo xattr -rd com.apple.quarantine "/Applications/JT-Trader Launcher.app"
```

This is necessary for the application to work correctly on macOS.
:::

### Installation

1. **Download** the appropriate file for your OS
2. **Run** the installer and follow the instructions
3. **Wait** for the automatic configuration to complete
4. **Open** your browser and go to: `http://localhost:8080`

### Launcher Advantages

- ✅ Automatic installation of all dependencies
- ✅ Pre-configured environment
- ✅ Automatic updates
- ✅ Simple management interface
- ✅ Built-in problem diagnostics

---

## 2. Installation via Docker

Docker provides an isolated environment for running JT-Trader without the need to install dependencies on the main system. Great for deployment on servers and cloud environments.

### Installing Docker

Download and install the latest version of [Docker](https://www.docker.com/) for your operating system.

### Quick Installation

#### Windows

1. Create a working directory for the application
2. Download the [setup-windows.bat](https://github.com/jt-lab-com/jt-trader/blob/main/docker/setup-windows.bat) file and place it in the working directory
3. Run `setup-windows.bat`
4. After installation is complete, open your browser and go to: `http://localhost:8080/`

#### Linux / macOS

1. Create a working directory for the application
2. Download the [setup.sh](https://github.com/jt-lab-com/jt-trader/blob/main/docker/setup.sh) file and place it in the working directory
3. Open terminal, navigate to the working directory and run:

```bash
bash setup.sh
```

4. After installation is complete, open your browser and go to: `http://localhost:8080/`

---

## 3. Direct Installation from GitHub
📦 **GitHub repository:** [jt-lab-com/jt-trader](https://github.com/jt-lab-com/jt-trader)

For developers and advanced users who want full control over the installation process. This method is necessary if you plan to develop your own trading robots or modify the source code.

### Cloning the Repository

Clone the repository along with the [jt-lib](https://github.com/jt-lab-com/jt-lib) submodule:

```bash
git clone --recurse-submodules https://github.com/jt-lab-com/jt-trader.git
```

**Alternatively:** If you already have a cloned repository without submodules:

```bash
git clone https://github.com/jt-lab-com/jt-trader.git
cd jt-trader
git submodule update --init --recursive
```

### Installing Dependencies

Navigate to the project folder and install dependencies:

```bash
cd jt-trader && yarn
```

### Environment Configuration

Create a `.env` file in the project root directory, copying the contents of `.env.example`, and specify values for the following environment variables:


### Example .env Configuration

```env
# Basic settings
PORT=8080
SITE_API_HOST=https://jt-lab.com
STANDALONE_APP=1

# Trading engine mode: both, realtime, tester
ENGINE_MODE="both"

# File and directory paths
DATABASE_URL="file:/path/to/your/project/storage.db"
ROLLUP_TS_CONFIG=tsconfig.bundler.json
STRATEGY_FILES_PATH=/path/to/your/project/strategy-source/src
MARKETS_FILE_PATH=markets.json
ARTIFACTS_DIR_PATH=/path/to/your/project/artifacts
HISTORY_BARS_PATH=downloaded-history-bars
LOGS_DIR_PATH=artifacts

# Redis (optional - system can work with file cache)
# REDIS_URL=redis://localhost:6379
```

### Variable Description

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port on which the application will run | `8080` |
| `SITE_API_HOST` | Base URL of the site API | `https://jt-lab.com` |
| `STANDALONE_APP` | Local operation mode (1 = enabled) | `1` |
| `ENGINE_MODE` | Trading engine mode | `"both"`, `"realtime"`, `"tester"` |
| `DATABASE_URL` | **Absolute path** to SQLite database file | `"file:/path/to/your/project/storage.db"` |
| `STRATEGY_FILES_PATH` | **Absolute path** to strategy source code | `/path/to/your/project/strategy-source/src` |
| `ROLLUP_TS_CONFIG` | Path to TypeScript configuration | `tsconfig.bundler.json` |
| `MARKETS_FILE_PATH` | Path to markets configuration file | `markets.json` |
| `ARTIFACTS_DIR_PATH` | Path to strategy reports directory | `/path/to/your/project/artifacts` |
| `HISTORY_BARS_PATH` | Path to historical data directory | `downloaded-history-bars` |
| `LOGS_DIR_PATH` | Path to logs directory | `artifacts` |
| `REDIS_URL` | Redis connection URL (optional) | `redis://localhost:6379` |

### ⚠️ Important: Path Configuration

**Replace `/path/to/your/project/` with actual paths to your project:**

- `DATABASE_URL` - specify the full path to the database file
- `STRATEGY_FILES_PATH` - specify the path to the strategy source code folder  
- `ARTIFACTS_DIR_PATH` - specify the path to the reports and artifacts folder

**Example for Windows:**
```env
DATABASE_URL="file:C:/Users/YourName/jt-trader/storage.db"
STRATEGY_FILES_PATH=C:/Users/YourName/jt-trader/strategy-source/src
ARTIFACTS_DIR_PATH=C:/Users/YourName/jt-trader/artifacts
```

**Example for Linux/macOS:**
```env
DATABASE_URL="file:/home/username/jt-trader/storage.db"
STRATEGY_FILES_PATH=/home/username/jt-trader/strategy-source/src
ARTIFACTS_DIR_PATH=/home/username/jt-trader/artifacts
```

### Build and Run

To build the project, run:

```bash
yarn build:prod
```

To run the application in production mode:

```bash
yarn start:prod
```

---

## Installation Verification

1. **Open the web interface:**
   - Go to: `http://localhost:8080`
   - Make sure the application loads

2. **Check JT-LIB:**
```bash
# Check for jt-lib folder in the project
ls -la jt-lib/
```

3. **Configure exchange connections:**
   - Go to the web interface
   - Navigate to the "Connections" section
   - Add exchange connections

## Troubleshooting

### Common Issues

#### "Module not found" Error
```bash
# Reinstall dependencies
rm -rf node_modules
yarn install
```

#### Port Issues
```bash
# Check which ports are in use
netstat -tulpn | grep :8080
```

#### Exchange Connection Issues
- Check API key correctness
- Make sure IP address is allowed on the exchange
- Check internet connection

## Next Steps

After successful installation:

1. **[JT-Trader Configuration](/jt-trader/configuration)** - Platform setup
2. **[Getting Started](/jt-trader/getting-started)** - Interface learning
3. **[Creating Strategies](/jt-lib/trading-scripts)** - Trading robot development
4. **[Tester Overview](/jt-trader/tester-overview)** - Strategy testing

---

## Useful Links

- **GitHub Repository**: [https://github.com/jt-lab-com/jt-trader](https://github.com/jt-lab-com/jt-trader)
- **JT-Lib Library**: [https://github.com/jt-lab-com/jt-lib](https://github.com/jt-lab-com/jt-lib)
- **Official Website**: [https://jt-lab.com](https://jt-lab.com)

---

**Congratulations! You have successfully installed JT-LAB. Now you can start creating trading strategies!** 🚀

