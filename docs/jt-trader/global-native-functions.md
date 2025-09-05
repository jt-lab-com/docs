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

### getConnectionName()

Returns the name of the current connection (exchange).

```typescript
function getConnectionName(): string;
```

**Usage Example:**
```typescript
let connectionName = getConnectionName();
console.log(`Current connection: ${connectionName}`);
```

### getSymbol()

Returns the current trading symbol.

```typescript
function getSymbol(): string;
```

**Usage Example:**
```typescript
let symbol = getSymbol();
console.log(`Current symbol: ${symbol}`);
```

## Trading Functions

### buyMarket()

Executes a market buy order.

```typescript
function buyMarket(amount: number): Promise<Order>;
```

**Parameters:**
- `amount` - Amount to buy (in quote currency)

**Returns:**
- `Order` - Order object with execution details

**Usage Example:**
```typescript
try {
  let order = await buyMarket(100); // Buy $100 worth
  console.log(`Order executed: ${order.id}`);
} catch (error) {
  console.error(`Buy failed: ${error.message}`);
}
```

### sellMarket()

Executes a market sell order.

```typescript
function sellMarket(amount: number): Promise<Order>;
```

**Parameters:**
- `amount` - Amount to sell (in base currency)

**Returns:**
- `Order` - Order object with execution details

**Usage Example:**
```typescript
try {
  let order = await sellMarket(0.1); // Sell 0.1 BTC
  console.log(`Order executed: ${order.id}`);
} catch (error) {
  console.error(`Sell failed: ${error.message}`);
}
```

### buyLimit()

Places a limit buy order.

```typescript
function buyLimit(amount: number, price: number): Promise<Order>;
```

**Parameters:**
- `amount` - Amount to buy (in quote currency)
- `price` - Limit price

**Returns:**
- `Order` - Order object with execution details

**Usage Example:**
```typescript
try {
  let order = await buyLimit(100, 45000); // Buy $100 at $45,000
  console.log(`Limit order placed: ${order.id}`);
} catch (error) {
  console.error(`Limit buy failed: ${error.message}`);
}
```

### sellLimit()

Places a limit sell order.

```typescript
function sellLimit(amount: number, price: number): Promise<Order>;
```

**Parameters:**
- `amount` - Amount to sell (in base currency)
- `price` - Limit price

**Returns:**
- `Order` - Order object with execution details

**Usage Example:**
```typescript
try {
  let order = await sellLimit(0.1, 50000); // Sell 0.1 BTC at $50,000
  console.log(`Limit order placed: ${order.id}`);
} catch (error) {
  console.error(`Limit sell failed: ${error.message}`);
}
```

### cancelOrder()

Cancels an existing order.

```typescript
function cancelOrder(orderId: string): Promise<Order>;
```

**Parameters:**
- `orderId` - ID of the order to cancel

**Returns:**
- `Order` - Cancelled order object

**Usage Example:**
```typescript
try {
  let order = await cancelOrder('12345');
  console.log(`Order cancelled: ${order.id}`);
} catch (error) {
  console.error(`Cancel failed: ${error.message}`);
}
```

## Market Data Functions

### fetchTicker()

Fetches current ticker data for a symbol.

```typescript
function fetchTicker(symbol?: string): Promise<Ticker>;
```

**Parameters:**
- `symbol` - Trading symbol (optional, uses current symbol if not provided)

**Returns:**
- `Ticker` - Ticker data object

**Usage Example:**
```typescript
try {
  let ticker = await fetchTicker('BTC/USDT');
  console.log(`Price: ${ticker.last}`);
  console.log(`Volume: ${ticker.volume}`);
} catch (error) {
  console.error(`Ticker fetch failed: ${error.message}`);
}
```

### fetchOrderBook()

Fetches order book data for a symbol.

```typescript
function fetchOrderBook(symbol?: string, limit?: number): Promise<OrderBook>;
```

**Parameters:**
- `symbol` - Trading symbol (optional)
- `limit` - Number of orders to fetch (optional)

**Returns:**
- `OrderBook` - Order book data object

**Usage Example:**
```typescript
try {
  let orderBook = await fetchOrderBook('BTC/USDT', 20);
  console.log(`Best bid: ${orderBook.bids[0][0]}`);
  console.log(`Best ask: ${orderBook.asks[0][0]}`);
} catch (error) {
  console.error(`Order book fetch failed: ${error.message}`);
}
```

### fetchOHLCV()

Fetches OHLCV (candlestick) data for a symbol.

```typescript
function fetchOHLCV(symbol?: string, timeframe?: string, since?: number, limit?: number): Promise<OHLCV[]>;
```

**Parameters:**
- `symbol` - Trading symbol (optional)
- `timeframe` - Timeframe (e.g., '1m', '5m', '1h', '1d')
- `since` - Start timestamp (optional)
- `limit` - Number of candles to fetch (optional)

**Returns:**
- `OHLCV[]` - Array of candlestick data

**Usage Example:**
```typescript
try {
  let candles = await fetchOHLCV('BTC/USDT', '1h', Date.now() - 86400000, 24);
  console.log(`Fetched ${candles.length} candles`);
} catch (error) {
  console.error(`OHLCV fetch failed: ${error.message}`);
}
```

## Account Functions

### fetchBalance()

Fetches account balance.

```typescript
function fetchBalance(): Promise<Balance>;
```

**Returns:**
- `Balance` - Account balance object

**Usage Example:**
```typescript
try {
  let balance = await fetchBalance();
  console.log(`BTC: ${balance.BTC.free}`);
  console.log(`USDT: ${balance.USDT.free}`);
} catch (error) {
  console.error(`Balance fetch failed: ${error.message}`);
}
```

### fetchPositions()

Fetches current positions.

```typescript
function fetchPositions(symbols?: string[]): Promise<Position[]>;
```

**Parameters:**
- `symbols` - Array of symbols to fetch positions for (optional)

**Returns:**
- `Position[]` - Array of position objects

**Usage Example:**
```typescript
try {
  let positions = await fetchPositions(['BTC/USDT']);
  console.log(`Positions: ${positions.length}`);
} catch (error) {
  console.error(`Positions fetch failed: ${error.message}`);
}
```

### fetchOrders()

Fetches open orders.

```typescript
function fetchOrders(symbol?: string, since?: number, limit?: number): Promise<Order[]>;
```

**Parameters:**
- `symbol` - Trading symbol (optional)
- `since` - Start timestamp (optional)
- `limit` - Number of orders to fetch (optional)

**Returns:**
- `Order[]` - Array of order objects

**Usage Example:**
```typescript
try {
  let orders = await fetchOrders('BTC/USDT');
  console.log(`Open orders: ${orders.length}`);
} catch (error) {
  console.error(`Orders fetch failed: ${error.message}`);
}
```

## Utility Functions

### log()

Logs a message to the system log.

```typescript
function log(category: string, message: string, data?: any): void;
```

**Parameters:**
- `category` - Log category
- `message` - Log message
- `data` - Additional data (optional)

**Usage Example:**
```typescript
log('Strategy', 'Buy order executed', { amount: 100, price: 45000 });
```

### sleep()

Pauses execution for a specified time.

```typescript
function sleep(ms: number): Promise<void>;
```

**Parameters:**
- `ms` - Milliseconds to sleep

**Usage Example:**
```typescript
await sleep(1000); // Sleep for 1 second
```

### getTimestamp()

Gets current timestamp.

```typescript
function getTimestamp(): number;
```

**Returns:**
- `number` - Current timestamp in milliseconds

**Usage Example:**
```typescript
let timestamp = getTimestamp();
console.log(`Current time: ${new Date(timestamp)}`);
```

## Error Handling

### Common Error Types

```typescript
// Network errors
try {
  await fetchTicker();
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    log('Error', 'Network connection failed');
  }
}

// Trading errors
try {
  await buyMarket(100);
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    log('Error', 'Insufficient balance for trade');
  }
}

// Rate limit errors
try {
  await fetchOrderBook();
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    log('Error', 'Rate limit exceeded, waiting...');
    await sleep(1000);
  }
}
```

## Best Practices

### 1. Error Handling

```typescript
async function safeBuy(amount: number) {
  try {
    let order = await buyMarket(amount);
    log('Strategy', 'Buy successful', { orderId: order.id });
    return order;
  } catch (error) {
    log('Strategy', 'Buy failed', { error: error.message });
    throw error;
  }
}
```

### 2. Rate Limiting

```typescript
async function fetchWithRetry(fetchFunction: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (error.code === 'RATE_LIMIT' && i < maxRetries - 1) {
        await sleep(1000 * (i + 1)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}
```

### 3. Data Validation

```typescript
function validateOrderParams(amount: number, price?: number) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (price !== undefined && price <= 0) {
    throw new Error('Price must be positive');
  }
}

// Usage
try {
  validateOrderParams(100, 45000);
  let order = await buyLimit(100, 45000);
} catch (error) {
  log('Error', 'Order validation failed', { error: error.message });
}
```

## Next Steps

- [Getting Started](getting-started) - Learn the basics
- [Runtime Overview](runtime-overview) - Run strategies live
- [Tester Overview](tester-overview) - Test your strategies
- [Configuration](configuration) - Configure the system