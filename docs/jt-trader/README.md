# JT-Trader

[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![CCXT](https://img.shields.io/badge/CCXT-4.0+-orange.svg)](https://github.com/ccxt/ccxt)
[![JT-Lib](https://img.shields.io/badge/JT--Lib-0.0+-purple.svg)](https://github.com/jt-lab-com/jt-lib)

<!-- TOC -->
* [License](#license)
* [Platform Overview](#platform-overview)
* [Key Features](#key-features)
* [Web Interface](#web-interface)
* [Installation](#installation)
* [Quick Start](#quick-start)
* [Strategy Management](#strategy-management)
* [Reporting System](#reporting-system)
* [Strategy and Bundle Management](#strategy-and-bundle-management)
* [Risk Management](#risk-management)
* [Documentation](#documentation)
* [Support](#support)
<!-- TOC -->

## License

JT-LAB has a dual license:

- 🟢 **Free** for personal, educational, and open-source use under [AGPLv3](LICENSE) license.
- 🔒 **Commercial use** requires a [paid license](mailto:am@jt-lab.com).

Professional trading platform for creating, testing, and launching algorithmic trading strategies. Combines a powerful engine for executing trading algorithms, comprehensive strategy testing system, and intuitive web interface for managing trading operations.

## Platform Overview

JT-Trader is built on the JT-Lib library and provides a complete ecosystem for algorithmic trading. The platform allows developers to create complex trading strategies, test them on historical data, and launch them in real-time on various cryptocurrency exchanges.

### System Architecture

JT-Trader is an environment for running trading robots where users independently configure exchange connections and launch trading scripts. The system provides unified operation both in testing mode and in real-time.

**Main system components:**

- **Script Runtime Environment** - unified platform for launching trading algorithms
- **Exchange Connection System** - configuration and management of connections via WebSocket
- **Monitoring and Management** - control of script state, their launch and stop
- **Reporting System** - collection and visualization of trading activity data
- **Unified Trading Functions** - proprietary APIs on top of CCXT for consistent operation

## Key Features

### Unified Trading Strategy Development

JT-Trader provides a single framework for creating trading algorithms based on TypeScript. A key feature is API unification - what works in the tester will work in real trading.

### Testing and Optimization System

The platform includes an advanced strategy tester that allows backtesting on historical data with high accuracy. The system supports multi-currency testing, strategy parameter optimization, and detailed results analysis.

### Trading Operations Management

The Runtime module provides full control over the lifecycle of trading strategies. Users can launch, stop, and monitor bot operation in real-time.

### Exchange Integration via CCXT

JT-Trader uses the CCXT library for working with cryptocurrency exchanges but provides proprietary unified functions on top of it. This ensures consistent operation with various trading platforms.

### Reporting and Monitoring System

JT-Trader includes a powerful reporting system that allows trading scripts to send data via the `updateReport()` function for visualization in the web interface.

## Web Interface

JT-Trader provides a unified web application with an intuitive interface accessible through any browser. The application is organized in tabs:

### Main Tabs

**Runtime** - central module for managing trading bots in real-time. Allows creating configurations, launching and stopping trading strategies, monitoring their operation, and viewing logs.

**Tester** - comprehensive tool for testing strategies on historical data. Includes testing parameter configuration, strategy optimization, and backtesting results analysis.

**Strategy Files** - system for managing trading strategies and their distribution. Allows creating strategy bundles, publishing them to the cloud, and managing versions of trading algorithms.

**Configuration** - setting up exchange connections and system configuration. Here users configure API keys, WebSocket connections, and other parameters for connecting to trading platforms.

## Installation

JT-Trader can be installed in several ways depending on your needs:

### 🚀 Launcher - for users
- [Installation via Launcher](installation#1-installation-via-launcher) - automatic installation and configuration

### 🐳 Docker - for server deployments  
- [Installation via Docker](installation#2-installation-via-docker) - Docker installation instructions

### 📦 GitHub - for developers

Clone the repository along with the [jt-lib](https://github.com/jt-lab-com/jt-lib) submodule:

```bash
git clone --recurse-submodules https://github.com/jt-lab-com/jt-trader.git
```

#### Installing Dependencies

Navigate to the project folder and install dependencies:

```bash
cd jt-trader && yarn
```

#### Environment Setup

Create a `.env` file in the project root directory, copying the contents of `.env.example`, and specify values for the following environment variables:

```env
# Main settings
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

#### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port on which the application will run | `8080` |
| `SITE_API_HOST` | Base API URL of the site | `https://jt-lab.com` |
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

#### ⚠️ Important: Path Configuration

**Replace `/path/to/your/project/` with real paths to your project:**

- `DATABASE_URL` - specify full path to database file
- `STRATEGY_FILES_PATH` - specify path to strategy source code folder  
- `ARTIFACTS_DIR_PATH` - specify path to reports and artifacts folder

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

#### Build and Run

To build the project, run:

```bash
yarn build:prod
```

To run the application in production mode:

```bash
yarn start:prod
```

## Quick Start

- [Quick Start](getting-started) - step-by-step guide to getting started with JT-Trader

## Strategy Management

- [Creating and Launching Strategies](runtime-overview) - detailed instructions for creating and launching trading bots
- [Required Parameters](runtime-overview#required-parameters) - runtime configuration setup

## Reporting System

JT-Trader provides a powerful reporting system with various types of visualization:

- **Charts** - displaying price data and indicators
- **Tables** - detailed information about trades and orders
- **Metrics** - key performance indicators
- **Optimization Results** - strategy parameter analysis

## Strategy and Bundle Management

The platform includes a powerful tool for managing trading strategies - Strategy Files. This module allows developers to:

- Collect strategies into bundles
- Publish them to the cloud
- Manage versions of trading algorithms
- Distribute strategies between servers

### Bundle Building Process

1. In the **Select strategy** field, choose the desired strategy bundle
2. Click the **Build Bundle** button to build the package
3. After completion, you'll see: ✅ *"Build completed successfully"*

Scripts compiled using the **Build Bundle** command can be deployed on any user server without the need to copy source code to the server.

## Risk Management

Built-in risk management system allows:

- Setting position limits
- Controlling maximum drawdown
- Automatically stopping trading when critical levels are reached
- Supporting various types of stop-losses and take-profits

## Documentation

- [Introduction](getting-started) - Platform overview
- [Runtime](runtime-overview) - Trading bot management
- [Tester](tester-overview) - Strategy testing
- [Strategy Files](strategy-files-overview) - Strategy management
- [Configuration](configuration) - System setup
- [Global Functions](global-native-functions) - API functions

## Support

For help and support:

- Study the documentation
- Contact the community
- Report bugs

---

JT-Trader opens wide possibilities for algorithmic trading, combining professional development tools with a convenient management interface. Regardless of your trading experience level, the platform provides all necessary tools for creating and launching effective trading strategies.