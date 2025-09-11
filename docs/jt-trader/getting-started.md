---
id: getting-started
title: Introduction
sidebar_label: Introduction
---

# Introduction

<div className="thumbnail-container">
  <div className="thumbnail-item">
    <a href="/docs/images/runtime-intro.png" target="_blank">
      <img src="/docs/images/thumbnails/runtime-intro-thumb.png" alt="Runtime Overview" className="thumbnail-image" />
    </a>    
  </div>

  <div className="thumbnail-item">
    <a href="/docs/images/create-runtime-intro.png" target="_blank">
      <img src="/docs/images/thumbnails/create-runtime-intro-thumb.png" alt="Create Runtime" className="thumbnail-image" />
    </a>    
  </div>

  <div className="thumbnail-item">
    <a href="/docs/images/tester-intro.png" target="_blank">
      <img src="/docs/images/thumbnails/tester-intro-thumb.png" alt="Tester Overview" className="thumbnail-image" />
    </a>    
  </div>

   <div className="thumbnail-item">
    <a href="/docs/images/create-scenarion-tester-intro.png" target="_blank">
      <img src="/docs/images/thumbnails/create-scenarion-tester-intro-thumb.png" alt="Create Scenario Tester" className="thumbnail-image" />
    </a>    
  </div>

  

</div>

JT-Trader is a professional trading platform designed for creating, testing, and launching algorithmic trading strategies. The platform combines a powerful engine for executing trading algorithms, a comprehensive strategy testing system, and an intuitive web interface for managing trading operations.

## Platform Overview

JT-Trader is built on the JT-Lib library and provides a complete ecosystem for algorithmic trading. The platform allows developers to create complex trading strategies, test them on historical data, and run them in real-time on various cryptocurrency exchanges.

### System Architecture

JT-Trader is an environment for running trading robots where users independently configure connections to exchanges and run trading scripts. The system ensures unified operation in both testing and real-time modes.

**Main System Components:**

- **Script Execution Environment** - unified platform for running trading algorithms
- **Exchange Connection System** - configuration and management of WebSocket connections
- **Monitoring and Management** - control of script state, their launch and stop
- **Reporting System** - collection and visualization of trading activity data
- **Unified Trading Functions** - custom APIs on top of CCXT for consistent operation

**Operating Principle:**

Users configure connections to exchanges, create trading scripts, and run them in the JT-Trader environment. The system ensures monitoring of all operations, statistics collection, and provision of detailed reports on trading algorithm performance.

## Key Features

### Unified Strategy Development

JT-Trader provides a unified framework for creating trading algorithms based on TypeScript. A key feature is API unification - what works in the tester will work in real trading. Developers use a unified set of functions from `global.d.ts` for working with market data, order management, and handling trading events, ensuring full compatibility between testing and real trading modes.

### Testing and Optimization System

The platform includes an advanced strategy tester that allows backtesting on historical data with high accuracy. The system supports multi-currency testing, strategy parameter optimization, and detailed results analysis. The tester accounts for fees, spreads, and other realistic trading conditions.

### Trading Operations Management

The Runtime module provides complete control over the lifecycle of trading strategies. Users can start, stop, and monitor bot operation in real-time. The system provides detailed logs, performance reports, and tools for analyzing trading activity.

### Exchange Integration via CCXT

JT-Trader uses the CCXT library for working with cryptocurrency exchanges but provides its own unified functions on top of it. This ensures consistent operation with various trading platforms, including Binance, Bybit, OKX, and others. Users independently configure connections to exchanges through Configuration, while the system ensures stable WebSocket connections, real-time market data processing, and reliable trade order execution.

### Reporting and Monitoring System

JT-Trader includes a powerful reporting system that allows trading scripts to send data through the `updateReport()` function for visualization in the web interface. The system supports various report types: charts, tables, metric cards, and optimization results. Reports are automatically generated in both testing and real trading modes, ensuring complete control over strategy performance.

### Risk Management

The built-in risk management system allows setting position limits, controlling maximum drawdown, and automatically stopping trading when critical levels are reached. The system supports various types of stop-losses and take-profits.

### Strategy and Bundle Management

The platform includes a powerful tool for managing trading strategies - Strategy Files. This module allows developers to collect strategies into bundles and publish them to the cloud. After publication, strategies become available for use on any JT-Trader servers through a centralized server, ensuring convenient distribution and updating of trading algorithms.

## Web Interface

JT-Trader provides a unified web application with an intuitive interface accessible through any browser. The application is organized into tabs, each responsible for a specific aspect of working with trading strategies:

### Main Tabs

**Runtime** - central module for managing trading bots in real-time. Allows creating configurations, starting and stopping trading strategies, monitoring their operation, and viewing logs.

**Tester** - comprehensive tool for testing strategies on historical data. Includes testing parameter configuration, strategy optimization, and backtesting results analysis.

**Strategy Files** - system for managing trading strategies and their distribution. Allows creating strategy bundles, publishing them to the cloud, and managing versions of trading algorithms.

**Configuration** - setting up connections to exchanges and system configuration. Here users configure API keys, WebSocket connections, and other parameters for connecting to trading platforms.

### Component Integration

All tabs are closely integrated with each other, ensuring a unified workflow: from creating and testing strategies to their publication and launch in real trading. Strategies tested in Tester can be easily transferred to Runtime, and bundles created in Strategy Files are available for use in all system modules.

## Licensing Types

JT-Trader is available under dual license:

- **AGPLv3** - free license for personal, educational, and open source use
- **Commercial License** - for commercial use and SaaS solutions

## Quick Start

After installing JT-Trader, you will be able to:

1. **Configure exchange connections** - add API keys for trading platforms
2. **Create your first strategy** - use ready-made examples or write your own
3. **Test the strategy** - run backtesting on historical data
4. **Launch in real-time** - activate the strategy for live trading
5. **Monitor results** - track performance through the web interface

## Next Steps

To get started with JT-Trader, it's recommended to study the following documentation sections:

- **[Runtime Overview](/docs/jt-trader/runtime-overview)** - Runtime tab overview
- **[Tester Overview](/docs/jt-trader/tester-overview)** - Tester tab overview
- **[Strategy Files Overview](/docs/jt-trader/strategy-files-overview)** - Strategy Files tab overview
- **[Configuration](/docs/jt-trader/configuration)** - system and connection configuration

JT-Trader opens wide possibilities for algorithmic trading, combining professional development tools with a convenient management interface. Regardless of your trading experience level, the platform will provide all necessary tools for creating and launching effective trading strategies.
