---
id: trading-scripts
title: Trading Scripts (Script)
sidebar_label: Trading Scripts
---

# Trading Scripts (Script)

Trading scripts are the foundation for creating trading strategies in `jt-lib`. They provide a structured approach to developing algorithmic trading systems with a clear lifecycle and market event handling.


## Your First Trading Script - DCA Strategy

**DCA (Dollar Cost Averaging)** is a strategy of regular purchases for a fixed amount regardless of price. This reduces the impact of volatility and allows gradual asset accumulation.

Here's a concise DCA strategy example using modern `jt-lib` capabilities:
### DCA Strategy Workflow

```
DCA Script Launch
    ↓
Get parameters: symbols, sizeUsd, intervalHours
    ↓
Initialize global services (triggers, report, events)
    ↓
onInit():
    ├─ Create StandardReportLayout
    ├─ Initialize OrdersBasket for symbol
    ├─ Register 'dcaPurchase' trigger
    └─ Setup periodic purchases
    ↓
┌────────────────────────────────────────────┐
│         Main Operation Loop                │
│                                            │
│  Every intervalHours hours:                │
│  ├─ 'dcaPurchase' trigger fires            │
│  ├─ buyDCA() is called                     │
│  ├─ Contract calculation: sizeUsd → amount │
│  ├─ Purchase execution: buyMarket()        │
│  └─ Result logging                         │
└────────────────────────────────────────────┘
    ↓
onStop() - cancel all orders
    ↓
Work completion
```

```typescript
class Script extends BaseScript {
  static definedArgs = [
    { key: 'symbols', defaultValue: 'BTC/USDT:USDT' },
    { key: 'sizeUsd', defaultValue: 100 },
    { key: 'intervalHours', defaultValue: 168 },
  ];

  dcaBasket: OrdersBasket;
  sizeUsd = getArgNumber('sizeUsd', 100);
  intervalHours = getArgNumber('intervalHours', 168); // 168 hours = 1 week
  private reportLayout: StandardReportLayout;

  async onInit() {
    // Initialize standard report
    this.reportLayout = new StandardReportLayout();

    // Create basket
    this.dcaBasket = new OrdersBasket({
      symbol: this.symbols[0],
    });
    await this.dcaBasket.init();

    // Register purchase trigger
    globals.triggers.registerTimeHandler('dcaPurchase', this.buyDCA, this);
    
    // Start regular purchases
    globals.triggers.addTaskByTime({
      name: 'dcaPurchase',
      triggerTime: currentTime() + 60 * 1000, // In 1 minute
      interval: this.intervalHours * 60 * 60 * 1000, // Repeat every intervalHours hours
      canReStore: true,
    });

    globals.report.setTitle('DCA Bot');
  }

  // Purchase function
  buyDCA = async () => {
    const amount = this.dcaBasket.getContractsAmount(this.sizeUsd);
    await this.dcaBasket.buyMarket(amount);
    log('DCA purchase completed', `amount: ${amount}, price: ${this.dcaBasket.close()}`);
  };
}
```

**Key features of this example:**
1. **`static definedArgs`** - automatic parameter generation in JT-Trader
2. **Modern triggers** - `registerTimeHandler()` and `addTaskByTime()`
3. **Automatic restoration** - `canReStore: true` for restart after failures
4. **Built-in reporting** - `StandardReportLayout` for monitoring
5. **Simplified initialization** - OrdersBasket without extra parameters
6. **Concise code** - minimum lines, maximum functionality

## BaseScript - Base Class for Trading Strategies

`BaseScript` is the fundamental class from which all trading strategies inherit. It provides:

### Main Properties

- **`connectionName`** - exchange connection name (required parameter)
- **`symbols`** - array of trading pairs for strategy operation
- **`interval`** - timer interval in milliseconds (if set, uses `onTimer` instead of `onTick`)
- **`hedgeMode`** - position hedging mode
- **`isInitialized`** - script initialization flag
- **`balanceTotal`** and **`balanceFree`** - total and free account balance

### Global Services Initialization

When creating a `BaseScript` instance, all global services are automatically initialized:

```typescript
// Automatically created in BaseScript constructor
globals.script = this;
globals.events = new EventEmitter();
globals.triggers = new TriggerService();
globals.report = new Report();
globals.storage = new Storage();
globals.candlesBufferService = new CandlesBufferService();
globals.indicators = new Indicators();

// OrdersBasket is created manually for each symbol
// import { OrdersBasket } from 'jt-lib';
```

## Script Lifecycle

### 1. Constructor

```typescript
constructor(args: GlobalARGS) {
  // Get parameters from ARGS
  this.connectionName = getArgString('connectionName', undefined, true);
  this.hedgeMode = getArgBoolean('hedgeMode', false);
  
  // Define symbols for trading
  if (isTester()) {
    this.symbols.push(args.symbol);
  } else {
    // Parse symbols from parameter string
    let symbolsLine = getArgString('symbols', '');
    // ... symbol processing
  }
}
```

### 2. onInit()

Called after instance creation and balance retrieval. Here happens:

- Trading component initialization
- Indicator setup
- Initial order creation
- Event subscription

```typescript
async onInit() {
  // Initialize your strategy
  log('Script', 'Strategy initialized', {}, true);
  
  // Get balance
  log('Script', 'Total balance', { balanceTotal: this.balanceTotal }, true);
  log('Script', 'Free balance', { balanceFree: this.balanceFree }, true);
}
```

### 3. onTick()

Called on each new tick (price change) **only for the first symbol** in the `symbols` list. When working with multiple symbols, use `EventEmitter` to subscribe to ticks of specific symbols.

**Important:** The `onTick()` method doesn't accept parameters. For market data retrieval, use native functions.

```typescript
async onTick() {
  // Get market data through native functions
  const currentPrice = close(); // Close price of first symbol
  const askPrice = ask()[0];    // Buy price from order book
  const bidPrice = bid()[0];    // Sell price from order book
  const volume = volume();      // Trading volume
  
  // Trading strategy logic
  trace('Script', 'New tick', { currentPrice, volume, askPrice, bidPrice }, true);
}
```

### 4. onOrderChange()

Called when any order status changes:

```typescript
async onOrderChange(order: Order) {
  log('OrderManager', 'Order status changed', { orderId: order.id, status: order.status }, true);
  
  if (order.status === 'filled') {
    log('OrderManager', 'Order filled', { orderId: order.id, filled: order.filled, amount: order.amount }, true);
  }
}
```

### 5. onStop()

Called when stopping the script for resource cleanup:

```typescript
async onStop() {
  log('Script', 'Strategy stopped', {}, true);
  // Close positions, cancel orders, etc.
}
```

## Tick Processing - Market Data Retrieval

### Important Limitation

**`onTick()` works only with the first symbol!**

When running a script on multiple symbols (`symbols: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT']`), the `onTick()` method will be called **only for the first symbol** (`BTC/USDT`).

### Working with Multiple Symbols

To get ticks for all symbols, use `EventEmitter`:

```typescript
async onInit() {
  // Subscribe to ticks for each symbol
  for (const symbol of this.symbols) {
    globals.events.subscribeOnTick(() => this.onSymbolTick(symbol), this, symbol, 1000);
  }
}

async onSymbolTick(symbol: string) {
  // Process tick for specific symbol
  const currentPrice = close(symbol); // Use native function with symbol
  trace('MultiSymbol', 'Tick for symbol', { symbol, currentPrice }, true);
}
```

### Operation Modes

**Tick mode** (default):
- `onTick()` is called on each new tick of **first symbol**
- For other symbols, use `EventEmitter`
- Use native functions `close()`, `ask()`, `bid()` for data retrieval

**Timer mode**:
- If `interval` is set, uses `onTimer()`
- `onTick()` is not called
- Useful for scheduled strategies
- In `onTimer()` also use native functions for data retrieval

```typescript
class Script extends BaseScript {
  interval = 60000; // 1 minute - switch to timer mode
  
  async onTimer() {
    // Called every minute
    const currentPrice = close(); // Use native function
    const askPrice = ask()[0];
    const bidPrice = bid()[0];
    
    log('TimerStrategy', 'Timer triggered', { currentPrice, askPrice, bidPrice }, true);
  }
}
```

### Native Functions for Market Data Retrieval

For market data retrieval, use native functions:

```typescript
// Main OHLC functions
const currentPrice = close();     // Close price (current price)
const openPrice = open();         // Open price
const highPrice = high();         // Maximum price
const lowPrice = low();           // Minimum price
const volume = volume();          // Trading volume
const timestamp = tms();          // Timestamp

// Order book functions
const askData = ask();            // [price, volume] - buy price
const bidData = bid();            // [price, volume] - sell price
const askPrice = ask()[0];        // Only buy price
const bidPrice = bid()[0];        // Only sell price

// For specific symbol (when working with multiple symbols)
const btcPrice = close('BTC/USDT');
const ethAsk = ask('ETH/USDT')[0];
```

## Script Parameters - Strategy Configuration

### Global ARGS Variable

When launching a script in JT-Trader, a global variable `ARGS` is created, which contains all parameters passed at launch. This variable is accessible in all parts of the code through `getArg*()` functions.

### GlobalARGS Type

```typescript
type GlobalARGS = {
  // Required parameters
  connectionName: string;        // Exchange connection name
  symbols: string;              // "BTC/USDT,ETH/USDT" - symbol list
  symbol: string;               // "BTC/USDT" - first symbol
  
  // Tester parameters (only in testing mode)
  start: string;                // "2021-01" - start date
  end: string;                  // "2021-12" - end date
  startDate: Date;              // "2021-01-01T00:00:00.000Z"
  endDate: Date;                // "2021-12-31T23:59:59.999Z"
  timeframe: string;            // Timeframe for testing
  optimizerIteration: number;   // Optimizer iteration number
  makerFee: number;             // Maker fee
  takerFee: number;             // Taker fee
  marketOrderSpread: number;    // Spread for market orders
  balance: number;              // Initial balance
  leverage: number;             // Leverage
  
  // User parameters
} & Record<string, string | number | boolean>;
```

### Launch Modes

**1. Runtime Mode (real-time trading)**
- Only required parameters and user parameters available
- Tester parameters absent
- Script works with real data

**2. Tester Mode (testing on historical data)**
- All parameters available, including tester parameters
- Script works with historical data
- Parameter optimization supported

### Required Parameters

When creating a script in JT-Trader, you must specify:

- **connectionName** - exchange connection name
- **symbols** - list of trading pairs (comma-separated)
- **interval** - timeframe for strategy (optional)

### User Parameters

Additional parameters are configured through JT-Trader interface and added to `ARGS`:

```typescript
class Script extends BaseScript {
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private isTestMode: boolean;
  
  async onInit() {
    // Get user parameters
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.isTestMode = getArgBoolean('isTestMode', false);
    
    // Check operation mode
    if (getArgString('start')) {
      log('Script', 'Launch in tester mode', { 
        start: getArgString('start'), 
        end: getArgString('end'),
        balance: getArgNumber('balance')
      }, true);
    } else {
      log('Script', 'Launch in Runtime mode', {}, true);
    }
    
    log('Script', 'Strategy parameters', {
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      volume: this.volume,
      isTestMode: this.isTestMode
    }, true);
  }
}
```

## Advanced Strategy Examples

### 1. Multi-Symbol Strategy with OrdersBasket

**Advantages of using OrdersBasket:**

- **Automatic contract management** — proper USD to contracts conversion for each symbol
- **Built-in SL/TP** — automatic stop-loss and take-profit order creation
- **Position management** — get information about current positions and their sizes
- **Reduce-only orders** — safe position closing without opening new ones
- **Centralized management** — all orders for symbol managed through one object
- **Error handling** — built-in parameter validation and exchange error handling

**Important:** OrdersBasket is created separately for each symbol, as each symbol has its own parameters (contract size, minimum volumes, fees).

```typescript
class Script extends BaseScript {
  private baskets: Record<string, OrdersBasket> = {};
  private positions: Record<string, number> = {};
  private buyPrices: Record<string, number> = {};
  private sellPrices: Record<string, number> = {};
  private usdAmount: number = 100; // Position size in USD
  
  async onInit() {
    log('MultiSymbolStrategy', 'Multi-symbol strategy with OrdersBasket launched', {}, true);
    
    // Setup prices for each symbol
    this.buyPrices['BTC/USDT'] = 50000;
    this.sellPrices['BTC/USDT'] = 55000;
    this.buyPrices['ETH/USDT'] = 3000;
    this.sellPrices['ETH/USDT'] = 3300;
    
    // Create OrdersBasket for each symbol
    for (const symbol of this.symbols) {
      this.baskets[symbol] = new OrdersBasket({
        symbol: symbol,
        connectionName: this.connectionName,
        leverage: getArgNumber('leverage', 1),
        hedgeMode: this.hedgeMode
      });
      
      await this.baskets[symbol].init();
      this.positions[symbol] = 0;
      
      // Subscribe to ticks for each symbol
      globals.events.subscribeOnTick(() => this.onSymbolTick(symbol), this, symbol, 1000);
      
      log('MultiSymbolStrategy', 'OrdersBasket initialized', { symbol }, true);
    }
  }
  
  async onSymbolTick(symbol: string) {
    const basket = this.baskets[symbol];
    const currentPrice = close(symbol); // Use native function with symbol
    const buyPrice = this.buyPrices[symbol];
    const sellPrice = this.sellPrices[symbol];
    
    if (!basket || !buyPrice || !sellPrice) return;
    
    // Buy when target price reached
    if (currentPrice <= buyPrice && this.positions[symbol] === 0) {
      // Convert USD to contracts
      const contracts = basket.getContractsAmount(this.usdAmount, currentPrice);
      
      // Create market order with automatic SL/TP
      const slPrice = currentPrice * 0.95; // Stop Loss 5% below
      const tpPrice = currentPrice * 1.05; // Take Profit 5% above
      
      const order = await basket.buyMarket(contracts, tpPrice, slPrice);
      this.positions[symbol] = 1;
      
      log('MultiSymbolStrategy', 'Bought contracts', { 
        symbol, contracts, currentPrice, slPrice, tpPrice, orderId: order.id 
      }, true);
    }
    
    // Sell when target price reached
    if (currentPrice >= sellPrice && this.positions[symbol] === 1) {
      // Get current position
      const position = await basket.getPosition();
      if (position && position.size > 0) {
        // Close position through reduce-only order
        const closeOrder = await basket.createReduceOrder(
          'market',
          'long', // close long position
          Math.abs(position.size), // position size
          currentPrice
        );
        
        this.positions[symbol] = 0;
        log('MultiSymbolStrategy', 'Closed position', { 
          symbol, currentPrice, closeOrderId: closeOrder.id 
        }, true);
      }
    }
  }
  
  async onStop() {
    // Close all positions when stopping
    for (const symbol of this.symbols) {
      const basket = this.baskets[symbol];
      if (basket) {
        await basket.cancelAllOrders();
        log('MultiSymbolStrategy', 'All orders cancelled', { symbol }, true);
      }
    }
  }
}
```

### 2. Timer-Based Strategy

```typescript
class Script extends BaseScript {
  interval = 300000; // 5 minutes
  private basket: OrdersBasket;
  private lastAction: number = 0;
  private usdAmount: number = 100;
  
  async onInit() {
    log('TimerStrategy', 'Timer-based strategy launched', {}, true);
    
    // Create OrdersBasket for first symbol
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName,
      leverage: getArgNumber('leverage', 1),
      hedgeMode: this.hedgeMode
    });
    
    await this.basket.init();
  }
  
  async onTimer() {
    const now = Date.now();
    
    // Action every 5 minutes
    if (now - this.lastAction > 300000) {
      log('TimerStrategy', 'Execute timer action', {}, true);
      
      // Get market data through native functions
      const currentPrice = close();
      const askPrice = ask()[0];
      const bidPrice = bid()[0];
      
      trace('TimerStrategy', 'Market data', { currentPrice, askPrice, bidPrice }, true);
      
      // Strategy logic
      const balance = await getBalance();
      log('TimerStrategy', 'Current balance', { balance: balance.total.USDT }, true);
      
      // Example timer-based trading
      const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
      log('TimerStrategy', 'Contract calculation', { contracts, usdAmount: this.usdAmount }, true);
      
      this.lastAction = now;
    }
  }
}
```

### 3. Order-Based Strategy

```typescript
class Script extends BaseScript {
  private basket: OrdersBasket;
  private pendingOrders: string[] = [];
  private usdAmount: number = 100;
  
  async onInit() {
    log('OrderBasedStrategy', 'Order-based strategy launched', {}, true);
    
    // Create OrdersBasket for first symbol
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName,
      leverage: getArgNumber('leverage', 1),
      hedgeMode: this.hedgeMode
    });
    
    await this.basket.init();
    
    // Create initial order
    const currentPrice = close();
    const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
    const limitPrice = currentPrice * 0.9; // 10% below current price
    
    const order = await this.basket.buyLimit(contracts, limitPrice);
    this.pendingOrders.push(order.id);
    log('OrderBasedStrategy', 'Created buy limit order', { contracts, limitPrice, orderId: order.id }, true);
  }
  
  async onOrderChange(order: Order) {
    log('OrderBasedStrategy', 'Order status changed', { orderId: order.id, status: order.status }, true);
    
    if (order.status === 'filled') {
      // Order filled
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
      
      if (order.side === 'buy') {
        // After purchase, create sell order
        const currentPrice = close();
        const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
        const sellPrice = order.price * 1.02; // 2% above purchase price
        
        const sellOrder = await this.basket.sellLimit(contracts, sellPrice);
        this.pendingOrders.push(sellOrder.id);
        log('OrderBasedStrategy', 'Created sell limit order', { contracts, sellPrice, orderId: sellOrder.id }, true);
      }
    }
    
    if (order.status === 'cancelled') {
      // Order cancelled
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
      log('OrderBasedStrategy', 'Order cancelled', { orderId: order.id }, true);
    }
  }
}
```

## Additional Methods

### Error Handling

```typescript
onError = async (e: any): Promise<never | void> => {
  console.error('Strategy error:', e);
  // Custom error handling
  throw e;
};
```

### Parameter Updates

```typescript
async onArgsUpdate(args: GlobalARGS) {
  log('Script', 'Strategy parameters updated', { args }, true);
  // Update logic when parameters change
}
```

### Exchange Event Handling

```typescript
async onEvent(event: string, data: any) {
  log('ExchangeEvents', 'Exchange event', { event, data }, true);
  // Handle WebSocket events
}
```

## Best Practices

1. **Use `onInit()` for initialization** - don't perform heavy operations in constructor
2. **Use OrdersBasket for trading** - don't use direct trading methods, always work through OrdersBasket
3. **Use native functions for data** - `close()`, `ask()`, `bid()` instead of parameters in `onTick()`
4. **Properly convert volumes** - use `getContractsAmount()` to convert USD to contracts
5. **Handle errors** - override `onError()` for custom error handling
6. **Manage resources** - use `onStop()` for cleanup and order cancellation
7. **Check initialization** - use `isInitialized` flag
8. **Log actions** - use `log()`, `warning()`, `error()` functions

## Next Steps

- **[Event System](/jt-lib/events-system)** - In-depth study of EventEmitter
- **[Core Fundamentals](/jt-lib/core-fundamentals)** - Basic system components
- **[Introduction and Architecture](/jt-lib/introduction-architecture)** - Library overview
