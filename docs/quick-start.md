---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

Try JT-Trader in 5 minutes! This guide will show you how to quickly launch the system and test a trading robot.

## What You'll Try

In the **JT-Trader** system, you'll try:

1. **Runtime Mode** - Launch a trading script on Mock exchange (simulation) through the Runtime section
2. **Tester Mode** - Backtesting a grid strategy with a report through the Tester section

> **Note about Mock Exchange:** This is a built-in virtual trading environment in JT-Trader that fully emulates the functionality of real cryptocurrency exchanges. All trading operations are performed within the system without connecting to external exchanges, ensuring safe strategy testing using simulated market data and virtual balance.

## Installation 

If you haven't installed JT-LAB yet, follow the instructions in [JT-Trader Installation](/docs/installation).

## Runtime - Trading on Mock Exchange

### Using the Ready Example Trading API Callback Example

Open the JT-Trader web interface (`http://localhost:8080`) and go to the Runtime section. The [Trading-Api-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Trading-Api-Example.ts) example will be launched (already available in the system). This example demonstrates all basic API calls, order creation (market, limit), data retrieval (prices, balance, positions), and order management (modification, cancellation).

### Running the Example

Go to the Runtime section, click the "Create Runtime" button and fill in the parameters: Name `Trading API Demo`, Prefix `demo`, Strategy select `Trading-Api-Example.ts`, Exchange select Mock exchange (simulation), Type `Market`. In the Parameters section set: symbols `XRP/USDT:USDT`, sizeUsd `5`, isDebug `True`. Click "Create", and after creation click the "Start" button in the scripts list.

### What Happens

The script creates interactive buttons in the report that demonstrate all the main capabilities of the trading API. You can click on the buttons and see the results in the table below. Prices, time, bid/ask are updated in real time.

**Buttons for working with market data:**
- **Symbol Info** - get trading pair information (minimum order size, price step, trading status)
- **Current Time** - current server time
- **Current Price** - current closing price
- **Volume** - trading volume
- **Ask Price** - sell price (ask)
- **Bid Price** - buy price (bid)

**Buttons for working with account:**
- **Get Positions** - get all open positions
- **Get Orders** - get all orders
- **Get Balance** - get account balance
- **Get Profit** - get total profit/loss
- **Get History** - get trade history for the last 7 days

**Buttons for trading operations:**
- **Buy Market** - market buy order
- **Buy Limit** - create limit buy order
- **Create Order** - create order with settings
- **Modify Order** - modify existing order
- **Cancel Order** - cancel order

**Buttons for order management:**
- **Get Open Orders** - get active orders
- **Get Closed Orders** - get executed orders

## Testing - Backtesting Grid Strategy

### Using the Ready Example Grid Strategy

The `GridBot-Example.ts` example will be launched (already available in the system). This example demonstrates a multi-currency grid strategy, automatic creation of baskets for each symbol, position opening logic and grid order creation, as well as profit taking when reaching the target level.

### Running the Test

Go to the Tester section, click the "New Scenario" button and configure the main parameters: Symbols `BTC/USDT,ETH/USDT` (or leave default), Start Date select start date (e.g., 1 month ago), End Date select end date (today), Balance `10000` (initial balance), Exchange select exchange for testing. In the Parameters section set: sizeUsd `100` (first position size in USD), gridStepPercent `5` (step between orders in %), tpPercent `2` (minimum profit for closing). Select Strategy `GridBot-Example.ts` and click "Start Test".

### Results Analysis

After testing, you will see a P&L chart (profit/loss dynamics), statistics (total profit, number of trades), metrics (Sharpe ratio, maximum drawdown) and trade details (list of all operations).

## Other Examples

The system has even more ready-made strategies: `RsiBot.ts` (RSI strategy with order basket), `GridBasket.ts` (grid logic implementation), `RsiBasket.ts` (RSI indicator with trading logic).

## What's Next?

### For Developers

[Study JT-LIB](/docs/jt-lib/introduction-architecture) (library architecture), [development basics](/docs/jt-lib/core-fundamentals) (basic components) and [creating strategies](/docs/jt-lib/trading-scripts) (advanced techniques).

### For Traders

[Exchange Setup](/docs/jt-trader/configuration) (connecting real exchanges), [usage](/docs/jt-trader/getting-started) (platform interface) and [Runtime](/docs/jt-trader/runtime-overview) (launching trading robots).

## Useful Tips

### 🚀 **For Quick Start**

Start with Mock exchange - safe and fast. Use small amounts for testing. Study logs - they show how the robot works.

### 📊 **For Analysis**

Test on different periods. Compare different parameters. Pay attention to drawdowns.

### 🔧 **For Development**

Use TypeScript for type safety. Log important events. Test before running on real money.

---

**Congratulations! You have successfully launched your first trading robot in JT-LAB!** 🎉

Now you can experiment with parameters, create new strategies and explore the platform's capabilities.

## 🔗 Useful Links

- **🌐 [JT-Lab Official Website](https://jt-lab.com)** - Platform main page
- **📦 [JT-Trader on GitHub](https://github.com/jt-lab-com/jt-trader)** - Trading platform source code
- **📚 [JT-Lib on GitHub](https://github.com/jt-lab-com/jt-lib)** - Development library source code
- **📖 [Full Documentation](/docs/intro)** - Detailed guides for all components
- **💡 [Code Examples](/docs/examples-guide)** - Ready-made trading strategy examples
