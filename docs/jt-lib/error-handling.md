---
id: error-handling
title: Error Handling
sidebar_label: Error Handling
---

# Error Handling

The error handling system in JT-LIB is built around the **BaseError** class - an extended error class that provides detailed information about the context of error occurrence and automatically integrates with the logging system.

## BaseError - Extended Error Handling System

**BaseError** is an extended error class that provides detailed information about the context of error occurrence and automatically integrates with the logging system.

### Key Features

- **Unique Identification** - each error gets a unique ID
- **Multiple Context** - ability to add multiple contexts to one error
- **Automatic Call Stack** - saving complete call stack
- **Logging Integration** - automatic recording in logging system
- **Debug Information** - detailed logging in debug mode

### Key Properties

- **`id: string`** - unique error identifier (2 characters)
- **`allContext: any[]`** - array of all contexts added to the error
- **`internalStack: string[]`** - internal call stack
- **`message: string`** - error message (inherited from Error)
- **`stack: string`** - call stack (inherited from Error)

### Constructors

**BaseError** supports two creation methods:

```typescript
// Creation from string message
const error1 = new BaseError('Exchange connection error', { 
  exchange: 'Binance', 
  timeout: 5000 
});

// Creation from existing error
const originalError = new Error('Network timeout');
const error2 = new BaseError(originalError, { 
  url: 'https://api.binance.com',
  retryCount: 3 
});

// Creation from BaseError (copying)
const error3 = new BaseError(existingBaseError, additionalContext);
```

### Methods

#### addContext(line: string, context?: any)
Adds additional context to the error. Useful for accumulating information about system state at the time of error.

```typescript
const error = new BaseError('Order processing error', { orderId: '12345' });

// Adding additional context
error.addContext('OrderManager::processOrder', { 
  symbol: 'BTC/USDT', 
  amount: 0.001 
});

error.addContext('ExchangeAPI::placeOrder', { 
  response: 'timeout', 
  latency: 5000 
});
```

### Automatic System Integration

**BaseError** automatically integrates with the logging system:

```typescript
// In BaseObject.error()
error('OrderManager', 'Order creation error', { 
  symbol: 'BTC/USDT',
  amount: 0.001 
});

// BaseError is automatically created and recorded in logs
// In logs will appear:
// {
//   date: "2024-01-15 10:30:45",
//   event: "OrderManager",
//   msg: "🚫 Order creation error",
//   context: {
//     stack: [...],
//     allContext: [...],
//     internalStack: [...]
//   }
// }
```

### Debug Information

In debug mode (`ARGS.isDebug = true`), BaseError automatically saves additional information:

```typescript
// In globals.userData.glAllContext is saved:
[
  {
    time: "2024-01-15 10:30:45",
    line: "OrderManager::createOrder (line 123)",
    context: { orderId: "12345", symbol: "BTC/USDT" }
  },
  {
    time: "2024-01-15 10:30:46", 
    line: "ExchangeAPI::placeOrder (line 456)",
    context: { response: "timeout", latency: 5000 }
  }
]
```

## BaseObject Integration

**BaseObject** automatically uses BaseError for error handling:

```typescript
class MyStrategy extends BaseObject {
  async processOrder(order: Order) {
    try {
      // Order processing logic
    } catch (e) {
      // Automatic BaseError creation with object context
      this.error(e, { 
        orderId: order.id,
        symbol: order.symbol 
      });
    }
  }
  
  checkBalance() {
    if (this.balance < 100) {
      // Error creation with automatic object context
      this.error('Insufficient funds', {
        balance: this.balance,
        required: 100,
        objectId: this.id
      });
    }
  }
}
```

**Automatic BaseObject.error() capabilities:**
- BaseError creation with unique ID
- Automatic object ID addition to context
- Event formation in `ClassName::methodName symbol` format
- Logging system integration
- Calling `onError()` for additional processing

## Practical Usage Examples

### In Trading Strategies

```typescript
try {
  await exchange.placeOrder(order);
} catch (e) {
  // Automatic BaseError creation with context
  error(e, { 
    orderId: order.id,
    symbol: order.symbol,
    price: order.price,
    amount: order.amount
  });
}

// Or creating custom error
if (balance < requiredAmount) {
  const error = new BaseError('Insufficient funds', {
    balance: balance,
    required: requiredAmount,
    symbol: symbol
  });
  
  error.addContext('Strategy::checkBalance', { 
    strategyId: this.id,
    timestamp: Date.now() 
  });
  
  throw error;
}
```

### In Indicator System

```typescript
try {
  const rsi = calculateRSI(prices);
} catch (e) {
  const error = new BaseError(e, {
    indicator: 'RSI',
    period: 14,
    pricesLength: prices.length
  });
  
  error.addContext('IndicatorService::calculateRSI', {
    lastPrice: prices[prices.length - 1],
    timeframe: '1h'
  });
  
  throw error;
}
```

### In Order Management System

```typescript
class OrderManager extends BaseObject {
  async createOrder(orderData: OrderData) {
    try {
      // Data validation
      this.validateOrderData(orderData);
      
      // Order creation
      const order = await this.exchange.placeOrder(orderData);
      
      return order;
    } catch (e) {
      // BaseError creation with full context
      const error = new BaseError(e, {
        orderData: orderData,
        exchange: this.exchange.name,
        timestamp: Date.now()
      });
      
      error.addContext('OrderManager::createOrder', {
        managerId: this.id,
        balance: this.balance
      });
      
      // Logging and error propagation
      this.error(error);
      throw error;
    }
  }
}
```

## Comparison with Regular Error

| Capability | Error | BaseError |
|------------|-------|-----------|
| Unique ID | ❌ | ✅ |
| Multiple Context | ❌ | ✅ |
| Automatic Logging | ❌ | ✅ |
| BaseObject Integration | ❌ | ✅ |
| Debug Information | ❌ | ✅ |
| Call Stack | ✅ | ✅ |
| Error Message | ✅ | ✅ |

## BaseError Advantages

1. **Detailed Diagnostics** - complete information about system state
2. **Automatic Logging** - integration with logging system
3. **Unique Identification** - easy to find specific error
4. **Context Accumulation** - ability to add information at different levels
5. **Debug Support** - additional information in debug mode

## Best Practices

### 1. Always Add Context
```typescript
// ❌ Bad
throw new Error('Connection error');

// ✅ Good
const error = new BaseError('Connection error', {
  exchange: 'Binance',
  endpoint: '/api/v3/account',
  timeout: 5000,
  retryCount: 3
});
```

### 2. Use addContext for Information Accumulation
```typescript
const error = new BaseError('Order processing error', { orderId: '12345' });

// Add context from different levels
error.addContext('Strategy::processSignal', { signal: 'BUY', confidence: 0.85 });
error.addContext('OrderManager::validateOrder', { balance: 1000, required: 100 });
error.addContext('ExchangeAPI::placeOrder', { response: 'timeout', latency: 5000 });
```

### 3. Use BaseObject.error() for Automatic Processing
```typescript
class MyStrategy extends BaseObject {
  async executeTrade() {
    try {
      // Trading logic
    } catch (e) {
      // Will automatically create BaseError with object context
      this.error(e, { 
        tradeId: this.currentTrade?.id,
        symbol: this.symbol 
      });
    }
  }
}
```

### 4. Handle Errors at Different Levels
```typescript
// At strategy level
try {
  await this.processMarketData(data);
} catch (e) {
  this.error(e, { 
    dataType: 'tick',
    symbol: data.symbol,
    price: data.price 
  });
}

// At component level
try {
  await this.calculateIndicator(prices);
} catch (e) {
  const error = new BaseError(e, {
    indicator: 'RSI',
    period: 14,
    pricesCount: prices.length
  });
  
  error.addContext('IndicatorService::calculate', {
    lastPrice: prices[prices.length - 1],
    timeframe: '1h'
  });
  
  throw error;
}
```

BaseError makes debugging trading strategies significantly easier, providing all necessary information for quick problem identification and resolution.