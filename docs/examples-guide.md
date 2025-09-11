---
id: examples-guide
title: JT-Lib Examples
sidebar_label: Examples Guide
---

# JT-Lib Examples

Examples of using the jt-lib library with descriptions of functionality and used classes.

## List of Examples

### Gainers & Losers Example

**File:** [Gainers-Losers-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Gainers-Losers-Example.ts)

**Description:** Scans USDT-swap markets and finds symbols with strong daily movements (>30%).

**Used Classes:**
- [BaseScript](/jt-lib/trading-scripts) - base class for trading scripts
- [StandardReportLayout](/jt-lib/reporting-system) - reporting system
- [BaseError](/jt-lib/core-fundamentals) - error handling

**Functionality:**
- Historical candle data analysis
- Price movement percentage calculation
- Creating report tables with results

### Grid Bot Example

**File:** [GridBot-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/GridBot-Example.ts)

**Description:** Multi-currency grid strategy with automatic position management.

**Used Classes:**
- [BaseScript](/jt-lib/trading-scripts) - base class for trading scripts
- [OrdersBasket](/jt-lib/exchange-orders-basket) - order and position management
- [StandardReportLayout](/jt-lib/reporting-system) - reporting system

**Functionality:**
- Creating grid of limit orders
- Automatic position management
- Multi-currency trading

### Indicators Example

**File:** [Indicators-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Indicators-Example.ts)

**Description:** Demonstration of working with technical indicators (SMA, ATR).

**Used Classes:**
- [BaseScript](/jt-lib/trading-scripts) - base class for trading scripts
- [SimpleMovingAverageIndicator](/jt-lib/technical-indicators) - SMA indicator
- [AverageTrueRange](/jt-lib/technical-indicators) - ATR indicator
- [CandlesBuffer](/jt-lib/market-data-candles) - candles buffer
- [StandardReportLayout](/jt-lib/reporting-system) - reporting system

**Functionality:**
- Creating and initializing indicators
- Real-time data display
- Working with historical data

### RSI Bot Example

**File:** [RsiBot-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/RsiBot-Example.ts)

**Description:** Trading strategy based on RSI indicator with automatic signals.

**Used Classes:**
- [BaseScript](/jt-lib/trading-scripts) - base class for trading scripts
- [OrdersBasket](/jt-lib/exchange-orders-basket) - order and position management
- [RelativeStrengthIndex](/jt-lib/technical-indicators) - RSI indicator
- [StandardReportLayout](/jt-lib/reporting-system) - reporting system

**Functionality:**
- RSI signal analysis (buy when RSI < 30, sell when RSI > 70)
- Automatic position management
- Stop-loss and take-profit orders

### Trading API Example

**File:** [Trading-Api-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Trading-Api-Example.ts)

**Description:** Trading API demonstration with callback functions and action buttons.

**Used Classes:**
- [BaseScript](/jt-lib/trading-scripts) - base class for trading scripts
- [OrdersBasket](/jt-lib/exchange-orders-basket) - order and position management
- [StandardReportLayout](/jt-lib/reporting-system) - reporting system

**Functionality:**
- Interactive buttons for trading operations
- Market data and account information retrieval
- Creating, modifying and canceling orders
- Callback functions for action handling

## 🔗 Official Resources

- **🌐 [Official JT-Lab Website](https://jt-lab.com)** - Main platform page
- **📦 [JT-Trader on GitHub](https://github.com/jt-lab-com/jt-trader)** - Trading platform source code
- **📚 [JT-Lib on GitHub](https://github.com/jt-lab-com/jt-lib)** - Development library source code
- **📖 [Complete Documentation](/intro)** - Detailed guides for all components
- **🚀 [Quick Start](/quick-start)** - Get started in 5 minutes