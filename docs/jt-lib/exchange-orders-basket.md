---
id: exchange-orders-basket
title: Exchange Operations (OrdersBasket)
sidebar_label: Exchange Operations (OrdersBasket)
---

# Exchange Operations (OrdersBasket)

**OrdersBasket** is a universal class for working with exchange orders, designed to simplify and automate trading. It combines functionality for creating, modifying, and canceling various types of orders, including market, limit, stop-loss, take-profit, and trigger orders.

## Key Features

- **Order Creation and Management** — supports market, limit, reduce-only, stop-loss, and take-profit orders
- **Trigger Orders** — ability to locally store and activate orders when specified price is reached
- **Automatic Stop Management** — automatically cancels related stop orders (SL/TP) when one of them is executed
- **Hedge Mode** — supports opening positions in both directions simultaneously when hedge mode is enabled
- **Simplified Trading Methods** — `buyMarket`, `sellMarket`, `buyLimit`, `sellLimit` functions with automatic SL/TP setup
- **Volume Calculations** — converts USD amounts to contracts and vice versa
- **Market Data Access** — getting bid/ask prices, volumes, high/low/open/close values
- **Order Modification and Cancellation** — changing price, size, and other parameters of existing orders
- **Subscription Management** — unsubscribing from global events and canceling all active triggers

## Events

- **`onOrderChange`** — called when order status changes (created, filled, canceled, modified)
- **`onPnlChange`** — called when unrealized or realized profit/loss changes for position
- **`onTick`** — called when new market data tick arrives

## Exchange Connection

### Constructor

```typescript
const ordersBasket = new OrdersBasket({
  symbol: 'ETH/USDT',
  connectionName: 'binance',
  hedgeMode: true,
  prefix: 'myBot',
  triggerType: 'script',
  leverage: 10
});
```

**Parameters:**
- `symbol` — trading symbol (e.g., 'ETH/USDT') **[required]**
- `connectionName` — exchange connection name (default taken from global arguments)
- `hedgeMode?` — determines if bidirectional position opening mode is enabled (default: `false`)
- `prefix?` — prefix for clientOrderId generation (default: random 4-character ID)
- `triggerType?` — method for creating stop orders ('script' or 'exchange') (default: `'script'`)
- `leverage?` — exchange leverage (default: `1`)

### Default Values

OrdersBasket uses the following default values:

- **`hedgeMode`**: `false` — normal trading mode (one position per symbol)
- **`prefix`**: random 4-character ID — unique prefix for all orders
- **`triggerType`**: `'script'` — stop orders managed locally
- **`leverage`**: `1` — no leverage (spot trading)
- **`connectionName`**: taken from global arguments — JT-Trader settings

### Initialization

```typescript
await ordersBasket.init();
```

After initialization, OrdersBasket is ready to work with the exchange.

### BaseScript Integration

OrdersBasket is typically used inside trading scripts that inherit from `BaseScript`:

```typescript
class Script extends BaseScript {
  async onInit() {
    // Create OrdersBasket for first symbol from list
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // first symbol from JT-Trader settings
      connectionName: getArgString('connectionName'), // connection from global arguments
      leverage: getArgNumber('leverage', 1),
      hedgeMode: getArgBoolean('hedgeMode', false)
    });
    
    await this.basket.init();
  }

  async onTick() {
    // Use basket for trading
    const price = this.basket.close();
    // ... trading logic
  }
}
```

**Important points:**
- **`this.symbols[0]`** — first symbol from list passed to JT-Trader
- **`getArgString('connectionName')`** — exchange connection name from global arguments
- **JT-Trader** automatically passes all parameters through global variable `ARGS`

### How JT-Trader Launches Scripts

JT-Trader searches for a class inheriting from `BaseScript` in the script file and launches it:

```typescript
// File: my-strategy.ts
class Script extends BaseScript {  // ← JT-Trader looks for exactly this class
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // symbols from Runtime/Tester settings
      connectionName: getArgString('connectionName'), // connection from global arguments
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
  }

  async onTick() {
    // Trading logic
  }
}
```

**Parameters from JT-Trader:**
- **Runtime** — parameters passed through "Create Runtime" interface
- **Tester** — parameters passed through "New Scenario" interface
- **All parameters** available through `getArgString()`, `getArgNumber()`, `getArgBoolean()` functions

## Calculations and Conversions

### Importance of Correct Calculations

**Critically important** to understand the difference between spot trading and futures trading:

- **Spot trading** — uses coins (e.g., 0.1 BTC)
- **Futures trading** — uses contracts with contract size (contractSize)

### Contract Size (contractSize)

Each futures symbol has its own contract size:
- **BTC/USDT:USDT** — contractSize = 0.001 (1 contract = 0.001 BTC)
- **ETH/USDT:USDT** — contractSize = 0.01 (1 contract = 0.01 ETH)
- **XRP/USDT:USDT** — contractSize = 10 (1 contract = 10 XRP)

### Volume Conversion

```typescript
// USD to contracts
const contracts = ordersBasket.getContractsAmount(100, 2200); // 100 USD at price 2200
// Result: number of contracts to buy for 100 USD

// Contracts to USD  
const usdAmount = ordersBasket.getUsdAmount(1, 2200); // 1 contract at price 2200
// Result: cost of 1 contract in USD
```

### Calculation Examples

```typescript
// For BTC/USDT:USDT (contractSize = 0.001, price = 50000)
const contracts = ordersBasket.getContractsAmount(100, 50000);
// Result: 2 contracts (100 / 50000 / 0.001 = 2)

const usdValue = ordersBasket.getUsdAmount(2, 50000);  
// Result: 100 USD (2 * 50000 * 0.001 = 100)

// For XRP/USDT:USDT (contractSize = 10, price = 0.5)
const contracts = ordersBasket.getContractsAmount(100, 0.5);
// Result: 20 contracts (100 / 0.5 / 10 = 20)

const usdValue = ordersBasket.getUsdAmount(20, 0.5);
// Result: 100 USD (20 * 0.5 * 10 = 100)
```

### Proper Usage in Trading

```typescript
// ❌ INCORRECT - working with coins directly
await ordersBasket.buyMarket(0.1); // 0.1 of what? BTC or contracts?

// ✅ CORRECT - convert USD to contracts
const usdAmount = 100; // want to buy for 100 USD
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
await ordersBasket.buyMarket(contracts);
```

## Trading Operations

### Order Creation

#### Market Orders

```typescript
// Buy at market for 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
const buyOrder = await ordersBasket.buyMarket(contracts, 2150, 2300); // contracts, SL, TP

// Sell at market for 50 USD
const sellContracts = ordersBasket.getContractsAmount(50, ordersBasket.close());
const sellOrder = await ordersBasket.sellMarket(sellContracts, 2300, 2150); // contracts, SL, TP
```

#### Limit Orders

```typescript
// Buy at limit for 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, 2200);
const buyLimitOrder = await ordersBasket.buyLimit(contracts, 2200, 2150, 2300); // contracts, price, SL, TP

// Sell at limit for 50 USD
const sellContracts = ordersBasket.getContractsAmount(50, 2200);
const sellLimitOrder = await ordersBasket.sellLimit(sellContracts, 2200, 2300, 2150); // contracts, price, SL, TP
```

#### Universal Order Creation

```typescript
// Create any type of order for 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
const order = await ordersBasket.createOrder('market', 'buy', contracts, ordersBasket.close(), {
  tp: 2300,  // Take Profit
  sl: 2150   // Stop Loss
});
```

### Order Management

#### Cancel Order

```typescript
await ordersBasket.cancelOrder(order.id);
```

#### Modify Order

```typescript
const modifiedOrder = await ordersBasket.modifyOrder(
  order.id, 
  'limit', 
  'buy', 
  1.5,    // new size
  2250    // new price
);
```

#### Cancel All Orders

```typescript
await ordersBasket.cancelAllOrders();
```

### Special Order Types

#### Reduce-only Orders (position closing)

```typescript
// Close long position for 50 USD
const closeAmount = 50;
const contracts = ordersBasket.getContractsAmount(closeAmount, ordersBasket.close());
const reduceOrder = await ordersBasket.createReduceOrder(
  'market', 
  'long',  // close long position
  contracts, // size in contracts
  ordersBasket.close() // price
);
```

#### Stop Loss Orders

```typescript
// Stop Loss for position of 100 USD
const positionSize = 100;
const contracts = ordersBasket.getContractsAmount(positionSize, ordersBasket.close());
const slOrder = await ordersBasket.createStopLossOrder(
  'buy',   // order side for closing
  contracts, // size in contracts
  2150     // trigger price
);
```

#### Take Profit Orders

```typescript
// Take Profit for position of 100 USD
const positionSize = 100;
const contracts = ordersBasket.getContractsAmount(positionSize, ordersBasket.close());
const tpOrder = await ordersBasket.createTakeProfitOrder(
  'buy',   // order side for closing
  contracts, // size in contracts
  2300     // trigger price
);
```

#### Trigger Orders

```typescript
// Trigger order to buy for 100 USD when price reaches 2150
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, 2200);
const triggeredOrder = await ordersBasket.createTriggeredOrder(
  'market', 
  'buy', 
  contracts, // size in contracts
  2200,     // order price
  2150      // trigger price
);
```

## Data Retrieval

### Market Data

```typescript
// Current prices
const currentPrice = ordersBasket.close();
const askPrice = ordersBasket.ask();
const bidPrice = ordersBasket.bid();

// Volumes
const askVolume = ordersBasket.askVolume();
const bidVolume = ordersBasket.bidVolume();

// OHLC data
const high = ordersBasket.high();
const low = ordersBasket.low();
const open = ordersBasket.open();
const volume = ordersBasket.volume();
```

### Positions

```typescript
// Get all positions
const positions = await ordersBasket.getPositions();

// Get position by side
const longPosition = await ordersBasket.getPositionBySide('long');
const shortPosition = await ordersBasket.getPositionBySide('short');

// Close position for 50 USD
const closeAmount = 50;
const contracts = ordersBasket.getContractsAmount(closeAmount, ordersBasket.close());
await ordersBasket.closePosition('long', contracts); // side, size in contracts
```

### Orders

```typescript
// Open orders
const openOrders = await ordersBasket.getOpenOrders();

// Closed orders
const closedOrders = await ordersBasket.getClosedOrders();

// All orders
const allOrders = await ordersBasket.getOrders();

// Extended order information
const extendedOrders = ordersBasket.getExtendedOrders();
```

### Market Information

```typescript
// Brief market information
const marketInfo = await ordersBasket.marketInfoShort();
// Returns: symbol, close, buyContracts, buySizeUsd, sellContracts, sellSizeUsd, leverage
```



## Test Exchange

### Mock Exchange for Testing

OrdersBasket supports working with Mock exchange for strategy testing:

```typescript
const testBasket = new OrdersBasket({
  symbol: 'BTC/USDT',
  connectionName: 'mock',  // Mock exchange
  hedgeMode: false
});

await testBasket.init();
```

### Testing Features

- **Execution Simulation** — orders are executed instantly at current price
- **Position Emulation** — automatic position tracking
- **Logging** — detailed logs of all operations
- **Safety** — no real money is used

### Strategy Testing Example

```typescript
class Script extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: 'BTC/USDT',
      connectionName: 'mock'
    });
    await this.basket.init();
  }

  async onTick() {
    const price = this.basket.close();
    
    // Simple strategy: buy on decline, sell on rise
    if (price < 50000) {
      await this.basket.buyMarket(0.1, 49000, 52000);
    } else if (price > 55000) {
      await this.basket.sellMarket(0.1, 56000, 53000);
    }
  }
}
```

## Trigger Management

### Trigger Types

OrdersBasket supports two types of stop order management:

#### Script Triggers (default)
- Stop orders stored locally
- Activated when price is reached
- More control and flexibility

#### Exchange Triggers
- Stop orders created immediately on exchange
- Managed by exchange
- Guaranteed execution when connected

```typescript
// Script triggers (default)
const scriptBasket = new OrdersBasket({
  symbol: 'ETH/USDT',
  triggerType: 'script'
});

// Exchange triggers
const exchangeBasket = new OrdersBasket({
  symbol: 'ETH/USDT', 
  triggerType: 'exchange'
});
```

## Resource Cleanup

```typescript
// Unsubscribe from events and cancel triggers
ordersBasket.unsubscribe();
```

## Practical Examples

### Grid Strategy

```typescript
class Script extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // first symbol from JT-Trader settings
      connectionName: getArgString('connectionName'), // connection from global arguments
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
    
    this.gridStep = getArgNumber('gridStep', 100); // grid step from parameters
    this.gridSize = getArgNumber('gridSize', 5);   // number of levels from parameters
  }

  async onTick() {
    const price = this.basket.close();
    const openOrders = await this.basket.getOpenOrders();
    
    // Create grid orders for 10 USD each
    const orderSize = 10;
    for (let i = 1; i <= this.gridSize; i++) {
      const buyPrice = price - (this.gridStep * i);
      const sellPrice = price + (this.gridStep * i);
      
      const buyContracts = this.basket.getContractsAmount(orderSize, buyPrice);
      const sellContracts = this.basket.getContractsAmount(orderSize, sellPrice);
      
      await this.basket.buyLimit(buyContracts, buyPrice);
      await this.basket.sellLimit(sellContracts, sellPrice);
    }
  }
}
```

### DCA Strategy

```typescript
class Script extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // first symbol from JT-Trader settings
      connectionName: getArgString('connectionName'), // connection from global arguments
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
    
    this.dcaLevels = getArgString('dcaLevels', '2000,1900,1800,1700').split(',').map(Number);
    this.positionSize = getArgNumber('positionSize', 100); // position size in USD
  }

  async onTick() {
    const price = this.basket.close();
    const longPosition = await this.basket.getPositionBySide('long');
    
    // Buy at each DCA level
    for (const level of this.dcaLevels) {
      if (price <= level && longPosition.contracts === 0) {
        const contracts = this.basket.getContractsAmount(this.positionSize, price);
        await this.basket.buyMarket(contracts, level * 0.95, level * 1.1);
        break;
      }
    }
  }
}
```

OrdersBasket provides a powerful and flexible tool for working with exchanges, combining all necessary functions for creating complex trading strategies.