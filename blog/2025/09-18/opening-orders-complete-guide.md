---
slug: opening-orders-complete-guide
title: Complete Guide to Opening Orders in JT-Lib
authors: [jt-lab-team]
tags: [tutorial, jt-lib, trading]
draft: false
date: 2025-09-18
---

<!-- truncate -->

# Complete Guide to Opening Orders in JT-Lib

[GitHub](https://github.com/jt-lab) | [Documentation](https://docs.jt-lab.com) | [JT-Lib](https://github.com/jt-lab/jt-lib)

## Introduction

Opening orders is the foundation of any trading strategy. In JT-Lib, this process is maximally simplified thanks to the **OrdersBasket** class, which provides a universal interface for working with various types of orders on cryptocurrency exchanges.

:::info
**Important:** This guide covers working with futures contracts - derivative instruments from underlying crypto assets. Unlike spot trading, futures allow trading with leverage, opening short positions, and using more complex trading strategies.
:::

### Features of Futures Trading

On cryptocurrency exchanges, futures have specific parameters that can be obtained through `symbolInfo`:

- **Contract size** (`contractSize`) — minimum trading unit (e.g., 0.001 BTC)
- **Amount precision** (`precision.amount`) — minimum step for changing position size
- **Limits** (`limits`) — minimum and maximum values for size, price, and cost
- **Margin trading** — ability to trade with leverage using collateral
- **Funding** — periodic payments between long and short positions
- **Position mode** — ability to open positions in both directions simultaneously (hedge mode)

```typescript
// Getting symbol information
const symbolInfo = await symbolInfo('BTC/USDT:USDT');

// Extract key parameters into constants for further use
const contractSize = symbolInfo.contractSize;
const amountPrecision = symbolInfo.precision.amount;
const minAmount = symbolInfo.limits.amount.min;
const maxAmount = symbolInfo.limits.amount.max;

log('SymbolInfo', 'Futures contract parameters', {
  contractSize,
  amountPrecision,
  minAmount,
  maxAmount
});
```

### Position Mode (Hedge Mode)

On some exchanges, you can open positions in both directions simultaneously (long and short). To do this, you need to configure the position mode:

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  hedgeMode: true  // Enables hedging mode
});
await basket.init();

// Now you can open positions in both directions
await basket.buyMarket(contracts);   // Long position
await basket.sellMarket(contracts);  // Short position
```

:::info
**Important:** When enabling `hedgeMode: true` in OrdersBasket, all necessary `positionMode` settings on the exchange will be performed automatically. On different exchanges, this parameter may be called differently, but OrdersBasket unifies this logic.
:::

### symbolInfo Function Signature

```typescript
function symbolInfo(symbol: string): Promise<SymbolInfo>;
```

**Parameters:**
- `symbol` - trading symbol (e.g., 'BTC/USDT:USDT')

**Returns:** `Promise<SymbolInfo>` - object with symbol information

### SymbolInfo Structure

```typescript
interface SymbolInfo {
  // Basic information
  id: string;                    // Unique symbol ID (e.g., "BTCUSDT")
  symbol: string;                // Trading symbol (e.g., "BTC/USDT:USDT")
  base: string;                  // Base currency (e.g., "BTC")
  quote: string;                 // Quote currency (e.g., "USDT")
  settle: string;                // Settlement currency (e.g., "USDT")
  
  // Contract type
  type: string;                  // Type: "spot", "swap", "future", "option"
  spot: boolean;                 // Spot trading
  swap: boolean;                 // Swap contracts (futures)
  future: boolean;               // Futures
  option: boolean;               // Options
  contract: boolean;             // Is it a contract
  
  // Contract characteristics
  linear: boolean;               // Linear contract (true) or inverse (false)
  inverse: boolean;              // Inverse contract
  contractSize: number;          // Contract size (e.g., 0.0001 for BTC)
  
  // Precision and limits
  precision: {
    amount: number;              // Amount precision (e.g., 1 or 0.001)
    price: number;               // Price precision (e.g., 0.1)
    base: number;                // Base currency precision
    quote: number;               // Quote currency precision
  };
  
  limits: {
    amount: {
      min: number;               // Minimum position size
      max: number;               // Maximum position size
    };
    price: {
      min: number;               // Minimum price
      max: number;               // Maximum price
    };
    cost: {
      min: number;               // Minimum order cost
      max: number;               // Maximum order cost
    };
    leverage: {
      min: number;               // Minimum leverage
      max: number;               // Maximum leverage
    };
  };
  
  // Fees
  taker: number;                 // Taker fee (e.g., 0.0006 = 0.06%)
  maker: number;                 // Maker fee (e.g., 0.0001 = 0.01%)
  
  // Status
  active: boolean;               // Is symbol active for trading
  margin: boolean;               // Supports margin trading
  tierBased: boolean;            // Uses tiered plans
}
```

These parameters are critically important when calculating position size and opening orders, as all values must comply with exchange requirements.

### Practical Examples of Contract Calculation

Let's consider how to calculate the number of contracts to open a $100 position on different exchanges:

#### Gate.io (BTC/USDT:USDT)
```typescript
// Gate.io parameters
const contractSize = 0.0001;  // 1 contract = 0.0001 BTC
const amountPrecision = 1;    // minimum step = 1 contract

// Calculation for $100 position at $50,000 price
const usdAmount = 100;
const currentPrice = 50000;

// Formula: number_of_contracts = usd_amount / (price * contract_size)
const contracts = usdAmount / (currentPrice * contractSize);
// contracts = 100 / (50000 * 0.0001) = 100 / 5 = 20 contracts

// Round to whole number (precision.amount = 1)
const finalContracts = Math.floor(contracts); // 20 contracts

log('Gate.io', 'Contract calculation', {
  usdAmount,
  currentPrice,
  contractSize,
  calculatedContracts: contracts,
  finalContracts,
  actualUsdValue: finalContracts * currentPrice * contractSize // $100
});
```

#### Bybit (BTC/USDT:USDT)
```typescript
// Bybit parameters
const contractSize = 1;       // 1 contract = 1 USD
const amountPrecision = 0.001; // minimum step = 0.001 contract

// Calculation for $100 position at $50,000 price
const usdAmount = 100;
const currentPrice = 50000;

// Formula: number_of_contracts = usd_amount / (price * contract_size)
const contracts = usdAmount / (currentPrice * contractSize);
// contracts = 100 / (50000 * 1) = 100 / 50000 = 0.002 contract

// Round to 3 decimal places (precision.amount = 0.001)
const finalContracts = Math.floor(contracts * 1000) / 1000; // 0.002 contract

log('Bybit', 'Contract calculation', {
  usdAmount,
  currentPrice,
  contractSize,
  calculatedContracts: contracts,
  finalContracts,
  actualUsdValue: finalContracts * currentPrice * contractSize // $100
});
```

### Key Exchange Differences
BTC = $50,000

| Parameter | Gate.io | Bybit |
|-----------|---------|-------|
| **contractSize** | 0.0001 (BTC) | 1 (BTC) |
| **amountPrecision** | 1 contract | 0.001 contract |
| **Minimum position** | 1 contract (~$5) | 0.001 contract (~$50) |

:::info
**Minimum position grows with asset price!** This is critically important to consider in trading robots.

**Example:** If you started with a minimum position of $5 at BTC price $50,000, then when the price rises to $100,000, your minimum position will already be $10. This can lead to errors in robot operation if it doesn't account for dynamic changes in minimum limits.
:::

```typescript

const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

const usdAmount = 100; // Want to buy for $100
let contracts = basket.getContractsAmount(usdAmount); // for current price
await basket.buyMarket(contracts);

// Limit order - executes at specified price
const limitPrice = basket.price()*0.7 // 30% below
let contracts = basket.getContractsAmount(usdAmount,limitPrice); // for trigger price
await basket.buyLimit(contracts, limitPrice);

```

## Market Orders

Market orders are executed immediately at the current market price.

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

// Buy
const usdAmount = 100;
const contracts = basket.getContractsAmount(usdAmount);
await basket.buyMarket(contracts);

// Sell
await basket.sellMarket(contracts);
```

## Limit Orders

Limit orders are executed only at the specified price or better.

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

const usdAmount = 100;
const currentPrice = basket.price();

// Buy at price below current
const buyPrice = currentPrice * 0.98; // -2%
const contracts = basket.getContractsAmount(usdAmount, buyPrice);
await basket.buyLimit(contracts, buyPrice);

// Sell at price above current
const sellPrice = currentPrice * 1.02; // +2%
await basket.sellLimit(contracts, sellPrice);
```

## Stop-Losses and Take-Profits

Stop Loss and Take Profit are trigger orders that automatically activate when certain price levels are reached and close the position.

### How Trigger Orders Work

1. **Waiting for trigger** — order waits for specified price to be reached
2. **Activation** — when trigger price is reached, order activates
3. **Automatic placement** — system automatically creates market order in opposite direction
4. **Position closure** — market order executes at best available price

:::warning
**Important to understand:** When opening stop-loss and take-profit simultaneously, when one order triggers, the second one needs to be cancelled manually. The exchange doesn't track this itself.

**Critical limitation:** The `'exchange'` trigger type is not unified between exchanges. Each exchange works with trigger orders differently:

- **Some exchanges** don't consider stop-losses and take-profits as regular orders
- **Different exchange APIs** return trigger orders in different formats or don't return them in the general order list at all
- **Trigger logic** can be fundamentally different between platforms
- **For each exchange** you need to write your own handler for working with stop-losses and take-profits

Therefore, when choosing `triggerType: 'exchange'`, be prepared for the need to adapt code to the specifics of a particular exchange.
:::

:::info
**triggerType** — trigger type for stop-losses and take-profits:

- **`'exchange'`** — orders are created on the exchange
- **`'script'`** — triggers are handled by the client (JT-Lib)
:::

**Recommendation:** Choose trigger type depending on the task:

**Use `'script'` when** there's complex logic when closing positions and you need to reopen orders after triggers activate. This type is suitable when the robot should be active to perform additional actions and requires full control over the position closing process.

**Use `'exchange'` when** maximum reliability is needed and the robot can be disabled. This type is suitable for simple strategies without complex logic when closing positions, when it's critically important to limit losses. Triggers will activate on the exchange even when the client is disabled.

### Opening Stop-Loss and Take-Profit

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  triggerType: 'exchange' // Triggers handled by exchange
});
await basket.init();

// First open position
const usdAmount = 100;
const contracts = basket.getContractsAmount(usdAmount);

// Calculate stop-loss and take-profit
const currentPrice = basket.price();
const stopLossPercent = 5; // 5% loss
const takeProfitPercent = 4; // 4% profit

const sl = currentPrice * (1 - stopLossPercent / 100); // Stop-loss
const tp = currentPrice * (1 + takeProfitPercent / 100); // Take-profit

// Market order with automatic stop-loss and take-profit
const order = await basket.buyMarket(contracts, sl, tp);

```

### Direct Creation of Stop-Loss and Take-Profit on Exchange

```typescript
// Stop-loss order (created directly on exchange)
await basket.createStopLossOrder('sell', contracts, sl);

// Take-profit order (created directly on exchange)
await basket.createTakeProfitOrder('sell', contracts, tp);
```

### Limit Order with Trigger Orders

When using limit orders, the logic for working with trigger orders (stop-loss and take-profit) differs from market orders:

1. **Limit order is created** — waits for execution at specified price
2. **Task is created** — to set stop-loss and take-profit orders after execution
3. **When limit order executes** — stop-loss and take-profit are automatically set

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  triggerType: 'exchange'
});
await basket.init();

const usdAmount = 100;
const currentPrice = basket.price();

// Price for limit order (2% below current)
const limitPrice = currentPrice * 0.98;

// Calculate trigger orders from limit order price
const stopLossPercent = 5; // 5% loss from entry price
const takeProfitPercent = 4; // 4% profit from entry price

const sl = limitPrice * (1 - stopLossPercent / 100); // Stop-loss
const tp = limitPrice * (1 + takeProfitPercent / 100); // Take-profit

const contracts = basket.getContractsAmount(usdAmount, limitPrice);

// Limit order with automatic trigger orders
const order = await basket.buyLimit(contracts, limitPrice, sl, tp);

log('LimitOrder', 'Limit order with protection', {
  currentPrice,
  limitPrice,
  stopLoss: sl,
  takeProfit: tp,
  stopLossPercent: `${stopLossPercent}%`,
  takeProfitPercent: `${takeProfitPercent}%`,
  contracts,
  orderId: order.id
});
```

:::info
**Important:** With limit orders, trigger orders (stop-loss and take-profit) are set only after the main order executes. Until then, the position doesn't exist, so protective orders cannot be active.
:::

:::info
**Important:** Stop-losses and take-profits only work when there's an open position. If the position is closed, these orders are automatically cancelled.
:::

## Closing Positions

### Special OrdersBasket Functions

```typescript
// Close position by side
await basket.closePosition('long', contracts);  // close long position
await basket.closePosition('short', contracts); // close short position

// Get positions
const longPosition = await basket.getPositionBySide('long');
const shortPosition = await basket.getPositionBySide('short');
```

### Reduce-only Orders for Closing

```typescript
// Market close of long position
const reduceOrder = await basket.createReduceOrder(
  'market', 
  'long',  // close long position
  contracts,
  basket.close()
);

// Market close of short position
const reduceOrderShort = await basket.createReduceOrder(
  'market', 
  'short',  // close short position
  contracts,
  basket.close()
);

// Limit close of long position
const limitCloseOrder = await basket.createReduceOrder(
  'limit', 
  'long',
  contracts,
  basket.close() * 1.01  // +1% from current price
);
```

## Cancelling Orders

### Cancel Specific Order

```typescript
// Cancel order by ID
await basket.cancelOrder(orderId);
```

### Cancel All Orders

```typescript
// Cancel all open orders
await basket.cancelAllOrders();
```

## Universal createOrder Function

All the orders discussed above can be created through the universal `createOrder` function with special parameters:

```typescript
// Market buy order
await basket.createOrder('market', 'buy', contracts, basket.ask());

// Limit sell order
await basket.createOrder('limit', 'sell', contracts, basket.bid());

// Reduce-only order to close position
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  reduceOnly: true
});

// Stop-loss order via createOrder
await basket.createOrder('market', 'sell', contracts, basket.price(), {
  tp:stopLossPrice
});

// Take-profit order via createOrder
await basket.createOrder('market', 'sell', contracts, basket.price(), {
  sl:takeProfitPrice
});

// Trigger market order (executes when price is reached)
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  triggerPrice: 50000  // trigger activation price
});

// Trigger limit order (placed at specified price when triggered)
await basket.createOrder('limit', 'buy', contracts, 49500, {
  triggerPrice: 50000  // trigger activation price
});

// Order with protective levels (internal OrdersBasket parameters)
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  sl: stopLossPrice,  // will automatically create linked stop-loss
  tp: takeProfitPrice // will automatically create linked take-profit
});
```

In this guide, we've covered all aspects of working with orders in detail: from basic market orders to complex trigger systems.
