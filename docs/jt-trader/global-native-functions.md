---
id: global-native-functions
title: JT-Trader System Native Functions
sidebar_label: Native Functions
---

# JT-Trader System Native Functions

This documentation describes the native functions available in the global scope when developing trading strategies in JT-Trader. These functions provide direct access to trading operations, market data, and system capabilities of the platform.

## Function Architecture

JT-Trader native functions are closely related to the CCXT (CryptoCurrency eXchange Trading) library. Some functions are direct calls to CCXT methods, while others have been rewritten and adapted to ensure interface unification.

This architecture was implemented so that functionality works the same way in both the tester and runtime, ensuring consistent behavior of trading operations regardless of execution mode.

## Runtime Environment Functions

### getArtifactsKey()

Returns a unique artifact key for the current script, used for storing report data.

```typescript
function getArtifactsKey(): string;
```

**Usage Example:**
```typescript
let artifactsKey = getArtifactsKey();
let reportUrl = "https://env1.jtnodes.one/report/" + artifactsKey;
```

### registerCallback()

Registers a callback function for trading operations (development mode only).

```typescript
function registerCallback(funcName: string, callback: (...args: any[]) => void): void;
```

**Parameters:**
- `funcName` - function name (createOrder, cancelOrder, modifyOrder, getOrders, getPositions, getBalance)
- `callback` - callback function (asynchronous only)

### isTester()

Determines if the script is running in testing mode.

```typescript
function isTester(): boolean;
```

**Usage Example:**
```typescript
if (isTester()) {
  // Logic only for tester
  log('Script', 'Running in testing mode', {}, true);
}
```

### updateReport()

Updates the report for the current script. Maximum update frequency - once per second. Maximum report size - 1MB.

```typescript
function updateReport(data: ReportData): Promise<void>;
```

**Important:** Avoid calling in loops without execution interval control (especially in onTick, onTimer).

### getCache() / setCache()

Functions for working with data cache.

```typescript
function setCache(key: string, value: any): Promise<void>;
function getCache<T>(key: string): Promise<T>;
```

### getPrefix()

Returns the prefix of the current script scenario. Used for generating clientOrderId.

```typescript
function getPrefix(): string;
```

**clientOrderId generation logic:**
- If user provided clientOrderId: `{prefix}.{userClientOrderId}`
- If not provided: `{prefix}.{hashOfTimestamp}`

### setLeverage()

Sets leverage for futures trading.

```typescript
function setLeverage(leverage: number, symbol: string): Promise<any>;
```

**CCXT function:** `setLeverage(leverage, symbol)`

**Parameters:**
- `leverage` - leverage value (1-125)
- `symbol` - symbol name (spot: BTC/USDT or futures: BTC/USDT:USDT)

## Market Data Functions

### symbolInfo()

Returns information about a trading symbol.

```typescript
function symbolInfo(symbol: string): Promise<SymbolInfo>;
```

**CCXT source:** `ccxt.markets[symbol]`

### OHLC Data Functions

```typescript
function tms(symbol?: string): number;    // Current candle timestamp
function open(symbol?: string): number;   // Open price
function high(symbol?: string): number;   // Maximum price
function low(symbol?: string): number;    // Minimum price
function close(symbol?: string): number;  // Close price
function volume(symbol?: string): number; // Trading volume
```

### ask() / bid()

Return buy and sell prices from the order book.

```typescript
function ask(symbol?: string, index: number = 0): [number, number];
function bid(symbol?: string, index: number = 0): [number, number];
```

**Return value:** `[price, volume]`

### getHistory()

Gets historical candle data.

```typescript
function getHistory(symbol: string, timeframe: TimeFrame, startTime: number, limit?: number): Promise<OHLC[]>;
```

**CCXT function:** `fetchOHLCV(symbol, timeframe, since, limit)`

**Parameters:**
- `symbol` - symbol name
- `timeframe` - candle timeframe ('1m', '5m', '15m', '1h', '1d')
- `startTime` - start time (timestamp)
- `limit` - number of candles

**Usage Example:**
```typescript
let candles = await getHistory('BTC/USDT', '1h', 1614556800000, 10);
// Result: [timestamp, open, high, low, close, volume]
```

## Trading Functions

### getPositions()

Returns an array of open positions.

```typescript
function getPositions(symbols?: string[], options = {}): Promise<Position[]>;
```

**CCXT function:** 
- By default: system subscribes to events and positions are returned from WebSocket connections
- With `isForce = true`: `fetchPositions(symbols, params)`

**Usage Example:**
```typescript
let positions = await getPositions();
for (let position of positions) {
  log('PositionManager', 'Position info', { 
    symbol: position.symbol, 
    size: position.contracts, 
    entryPrice: position.entryPrice 
  }, true);
}
```

### getBalance()

Returns account balance information.

```typescript
function getBalance(): Promise<{
  total: { USDT: number; [coin: string]: number };
  used: { USDT: number; [coin: string]: number };
  free: { USDT: number; [coin: string]: number };
}>;
```

**CCXT function:** `fetchBalance()`

**Usage Example:**
```typescript
let balance = await getBalance();
log('BalanceManager', 'Free balance', { balance: balance.free.USDT }, true);
```

### Order Management Functions

#### getOrders() / getOpenOrders() / getClosedOrders()

```typescript
function getOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
function getOpenOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
function getClosedOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
```

**CCXT functions:**
- `getOrders()` - may combine multiple CCXT methods depending on exchange (e.g., `fetchOrders()`, `fetchOpenOrders()`, `fetchClosedOrders()`)
- `getOpenOrders()` - may contain multiple CCXT functions, as some exchanges separate trigger orders and regular open orders
- `getClosedOrders()` - similarly may combine multiple CCXT methods to get all types of closed orders

#### getOrder()

Gets an order by ID.

```typescript
function getOrder(id: string, symbol = ''): Promise<Order>;
```

**CCXT function:** `fetchOrder(id, symbol)`

### createOrder()

Creates a new order.

```typescript
function createOrder(
  symbol: string,
  type: OrderType,
  side: OrderSide,
  amount: number,
  price: number,
  params: Record<string, unknown>
): Promise<Order>;
```

**CCXT function:** `createOrder(symbol, type, side, amount, price, params)`

**Parameters:**
- `symbol` - trading symbol
- `type` - order type ('limit', 'market')
- `side` - direction ('buy', 'sell')
- `amount` - quantity in base currency
- `price` - price (for limit orders)
- `params` - additional parameters

**Usage Examples:**

```typescript
// Market order
let order = await createOrder('BTC/USDT', 'market', 'buy', 0.01, 10000, {});

// Stop-loss order
let sl = await createOrder('BTC/USDT', 'market', 'sell', 0.01, 9000, {
  stopLossPrice: 9000, 
  reduceOnly: true
});

// Take-profit order
let tp = await createOrder('BTC/USDT', 'market', 'sell', 0.01, 11000, {
  takeProfitPrice: 11000, 
  reduceOnly: true
});
```

### cancelOrder()

Cancels an order.

```typescript
function cancelOrder(id: string, symbol: string): Promise<Order>;
```

**CCXT function:** `cancelOrder(id, symbol)`

### modifyOrder()

Modifies an existing order.

```typescript
function modifyOrder(
  id: string,
  symbol: string,
  type: OrderType,
  side: OrderSide,
  amount: number,
  price: number,
  params = {}
): Promise<Order>;
```

**CCXT function:** `editOrder(id, symbol, type, side, amount, price, params)`

**Usage Example:**
```typescript
let order = await modifyOrder('5203624294025367390', 'BTC/USDT:USDT', 'limit', 'buy', 0.01, 10000);
```

## Testing Functions

### getFee()

Returns total commission for all executed orders (tester only).

```typescript
function getFee(): number;
```

### getProfit()

Returns profit/loss for all closed positions (tester only).

```typescript
function getProfit(): Promise<number>;
```

## System Functions

### SDK Functions

```typescript
async function sdkCall(method: string, args: any[]): Promise<any>;
async function sdkGetProp(property: string): Promise<any>;
async function sdkSetProp(property: string, value: any): Promise<void>;
```

**Purpose:** These functions allow calling any CCXT methods and working with their properties that were not exposed to the global context. This way, you can access the full functionality of the CCXT library, even if specific methods are not represented as separate native functions.

**Usage Examples:**
```typescript
// Call any CCXT method
let result = await sdkCall('fetchTradingFees', ['BTC/USDT']);

// Get CCXT object property
let markets = await sdkGetProp('markets');

// Set CCXT object property
await sdkSetProp('sandbox', true);
```

### forceStop()

Forcibly stops script execution.

```typescript
function forceStop(): void;
```

### systemUsage()

Returns system resource usage information.

```typescript
function systemUsage(): { cpu: number; memory: number };
```

### getErrorTrace()

Gets error trace.

```typescript
function getErrorTrace(stack: string): Promise<string>;
```

### getUserId()

Returns user ID.

```typescript
const getUserId: () => string;
```

## Global Objects

### ARGS

Global constant containing script arguments.

```typescript
const ARGS: GlobalARGS;
```

### axios

Global HTTP client instance for external requests.

```typescript
const axios: any;
```

## Conclusion

JT-Trader native functions provide a powerful and unified interface for developing trading strategies. They abstract the complexity of working with various exchanges and provide a consistent API for all trading operations, market data work, and system functions.

When developing strategies, it's important to consider the features of each function, properly handle errors, and use appropriate checks for different execution modes (testing vs real trading).