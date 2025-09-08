---
id: core-fundamentals
title: Core Fundamentals
sidebar_label: Core Fundamentals
---

# Core Fundamentals

The JT-LIB core represents the fundamental components on which the entire library is built. These components provide basic functionality for all other parts of the system.


## BaseObject - Base Class for All Objects

**BaseObject** is the root class for all objects in JT-LIB. It provides basic functionality for managing object lifecycle.

### Key Features

- **Unique Identification** - each object gets a unique ID
- **Lifecycle Management** - creation, destruction, restoration
- **Child Object System** - hierarchical object structure
- **Error Handling** - built-in error logging system
- **Event Subscription** - automatic unsubscription on destruction

### Key Methods

- **`id: string`** - unique object identifier
- **`addChild(child: BaseObject): void`** - adding child object for proper lifecycle management
- **`async call(functionName: string, data?: any): Promise<any>`** - calling method by name
- **`destroy(): void`** - proper destruction of object and all children
- **`error(msg: string | Error, context?: any): void`** - error handling with context

### Lifecycle Management System

**BaseObject** automatically registers in the global storage `globals` when created. This ensures centralized management of all objects in the system.

**Important to understand**: In TypeScript, you cannot simply "destroy" an object - it retains active event subscriptions that can cause errors. Therefore, to properly terminate an object's operation, you must call the `destroy()` method.

**The `addChild()` function** serves to ensure that when the parent object is destroyed, all child objects are properly unsubscribed from all subscriptions. This prevents memory leaks and incorrect system behavior.

## Globals - Global System State

**Globals** manages the global application state and provides access to all main services.

### Main Services

- **Script** - current trading script (formerly Strategy)
- **Events** - event system (EventEmitter)
- **Triggers** - trigger service with automatic storage
- **Report** - reporting system
- **Storage** - data storage
- **CandlesBufferService** - candlestick data management
- **Indicators** - technical indicators

### Key Properties

- **`script: BaseScript`** - current trading script (formerly strategy)
- **`events: EventEmitter`** - event system
- **`triggers: TriggerService`** - trigger service with automatic storage
- **`report: Report`** - reporting system
- **`storage: Storage`** - data storage
- **`candlesBufferService: CandlesBufferService`** - candlestick data management
- **`indicators: Indicators`** - technical indicators
- **`isTradeAllowed: boolean`** - permission for trading operations
- **`_objects: Record<string, BaseObject>`** - global storage of all objects
- **`userData: Map<string, any>`** - user data
- **`IS_NO_LOGS: number`** - logging control
- **`isDebug: boolean`** - debug mode

### Centralized Object Management

**Globals** provides centralized management of all objects in the system. When creating any object that inherits from `BaseObject`, it is automatically registered in `globals._objects` with a unique identifier.

This allows the system to track all active objects, manage their lifecycle, and ensure proper resource cleanup when terminating.

## Base - Utilities for Working with Arguments

**Base** provides a set of utility functions for working with the global variable `ARGS`, which contains parameters passed when launching a script from JT-Trader.

**Important to understand**: All `getArg*` functions work with the global variable `ARGS`, which is automatically populated with parameters specified by the user in the JT-Trader interface when launching a trading strategy.

### Main Functions

#### uniqueId()
Generates a unique identifier of specified length. By default creates an ID of 4 characters, but you can specify any length.

#### getArgNumber()
Safely extracts a numeric argument from the global variable `ARGS` with type checking. Supports default values and required arguments. Automatically checks for argument duplication in the scenario - if the same parameter is passed twice, the function will throw an error.

#### getArgString()
Safely extracts a string argument from the global variable `ARGS`. Ensures proper handling of string values with support for required arguments. If a required argument is not found, the function will throw an error indicating the parameter name.

#### getArgBoolean()
Safely extracts a boolean argument from the global variable `ARGS`. Supports both boolean and string values ('true'/'false'). Automatically converts strings to corresponding boolean values. If a required argument is not found, the function will throw an error.

#### isIterable()
Checks if an object is iterable. Recognizes arrays, Map, Set and other iterable data structures.

### How the ARGS System Works in JT-Trader

When launching a trading strategy in JT-Trader, a global variable `ARGS` is created, which contains all parameters passed at launch. The system supports two modes:

**Runtime Mode (real-time trading):**
```typescript
ARGS = {
  connectionName: 'Binance',
  symbols: 'BTC/USDT,ETH/USDT',
  amount: 0.001,
  stopLoss: 45000,
  takeProfit: 55000,
  isDebug: true
}
```

**Tester Mode (testing on historical data):**
```typescript
ARGS = {
  connectionName: 'Binance',
  symbols: 'BTC/USDT,ETH/USDT',
  symbol: 'BTC/USDT',
  // Tester parameters
  start: '2021-01',
  end: '2021-12',
  startDate: new Date('2021-01-01T00:00:00.000Z'),
  endDate: new Date('2021-12-31T23:59:59.999Z'),
  timeframe: '1h',
  optimizerIteration: 1,
  makerFee: 0.001,
  takerFee: 0.001,
  marketOrderSpread: 0.0001,
  balance: 10000,
  leverage: 1,
  // User parameters
  amount: 0.001,
  stopLoss: 45000,
  takeProfit: 55000,
  isDebug: true
}
```

**Usage in strategy:**
```typescript
const symbol = getArgString('symbol', 'ETH/USDT');        // 'BTC/USDT'
const amount = getArgNumber('amount', 0.001, true);      // 0.001 (required)
const stopLoss = getArgNumber('stopLoss', 0);            // 45000
const isDebug = getArgBoolean('isDebug', false);         // true
```

## Storage - Data Storage System

**Storage** provides persistent storage of objects and their state between strategy launches.

### Main Features

- **Object Caching** - storing object references
- **State Persistence** - automatic saving of object properties
- **State Restoration** - restoring objects on restart
- **Complex Type Support** - Array, Date, Map, Set, RegExp
- **Debugging** - detailed operation logging

### Key Methods

- **`addObject(key: string, obj: BaseObject | object, props?: string[]): void`** - adding object for tracking with specified properties to save
- **`removeObject(key: string): void`** - removing object from tracking system
- **`saveState(): Promise<void>`** - saving state of all tracked objects
- **`loadState(): Promise<void>`** - loading saved state
- **`reStoreState(key: string, obj: object): void`** - restoring state of specific object

### Supported Data Types

Storage automatically handles and saves the following data types:
- **Array** - arrays
- **Date** - dates and time
- **Map** - Map objects
- **Set** - Set objects
- **Object** - regular objects
- **RegExp** - regular expressions

### Automatic State Management

When adding an object to Storage, the system automatically tracks changes in specified properties and saves their state. When restarting the strategy, all objects are restored with saved values.

## Log - Logging and Debugging System

**Log** provides a comprehensive logging system for debugging and monitoring strategy operation.

### Event System in Logs

**Critically important feature**: Each logging function accepts an `event` parameter - this is the name of the event or component from which the log is called. This allows in complex systems with multiple objects to easily identify the source of each message.

**Why this is important:**
- In trading robots, many objects work simultaneously (strategies, indicators, triggers, orders)
- Without an event system, it's impossible to understand where a specific message came from
- When debugging, you can quickly find all logs from a specific component
- Simplifies real-time system analysis

**Log format:**
```
2024-01-15 10:30:45| StrategyManager | Launching new BTC/USDT strategy
2024-01-15 10:30:46| OrderManager | Created buy order for 0.001 BTC
2024-01-15 10:30:47| TriggerService | Activated stopLoss trigger
2024-01-15 10:30:48| IndicatorService | Updated RSI: 65.4
```

### Logging Levels

#### log()
Main logging level for informational messages. Used for recording important events in strategy operation.

**Syntax:** `log(event: string, msg: string, context?: object, showInConsole?: boolean)`

#### trace()
Detailed logging for debugging. Provides detailed information about operation execution.

**Syntax:** `trace(event: string, msg: string, context?: object, showInConsole?: boolean)`

#### warning()
Warnings that don't stop strategy execution but require developer attention.

**Syntax:** `warning(event: string, msg: string, context?: object, showInConsole?: boolean)`

#### error()
Errors with detailed context and call stack. Automatically increments error counter and may lead to strategy termination.

**Syntax:** `error(event: string, msg: string, context?: any)` or `error(error: Error, context?: any)`

#### debug()
Debug information, available only in debug mode. In tester, disabled for performance improvement.

**Syntax:** `debug(event: string, msg: string, context?: object)`

### Special Logging Functions

#### logOnce()
Records a message only once for a certain period of time. Useful for avoiding log spam from repeating events.

**Syntax:** `logOnce(event: string, msg: string, context?: object, ttl?: number)`

#### errorOnce()
Records an error only once for a certain period of time. Prevents log clutter with repeating errors.

**Syntax:** `errorOnce(event: string, msg: string, context?: object, ttl?: number)`

#### warningOnce()
Records a warning only once for a certain period of time.

**Syntax:** `warningOnce(event: string, msg: string, context?: object, ttl?: number)`

**Usage examples:**
```typescript
// Prevent spam from repeating warnings
warningOnce('ConnectionManager', 'Slow exchange connection', { 
  latency: 5000 
}, 60000); // Show only once per minute

// Log connection error only once per hour
errorOnce('ExchangeAPI', 'Authorization error', { 
  error: 'Invalid API key' 
}, 3600000); // TTL = 1 hour
```

### Practical Examples of Event Usage

**In trading strategy:**
```typescript
// In strategy class
log('Strategy', 'Initializing BTC/USDT strategy', { symbol: 'BTC/USDT', timeframe: '1h' });
log('Strategy', 'Trend analysis completed', { trend: 'bullish', confidence: 0.85 });

// In order management class
log('OrderManager', 'Created buy order', { 
  symbol: 'BTC/USDT', 
  amount: 0.001, 
  price: 45000 
});

// In indicator class
log('RSI', 'RSI crossed level 70', { 
  value: 72.5, 
  level: 70, 
  signal: 'overbought' 
});

// In trigger system
log('TriggerService', 'Activated stopLoss trigger', { 
  orderId: '12345', 
  triggerPrice: 44000 
});
```

**Log filtering by events:**
```typescript
// Get all logs from specific component
const strategyLogs = getLogs('log').filter(log => log.event === 'Strategy');
const orderLogs = getLogs('log').filter(log => log.event === 'OrderManager');

// Find all errors from indicators
const indicatorErrors = getLogs('error').filter(log => log.event.includes('Indicator'));
```

### Log Structure and Retrieval

**Log record structure:**
```typescript
{
  date: string,        // Recording time in "YYYY-MM-DD HH:mm:ss" format
  event: string,       // Event/component name
  msg: string,         // Message text
  context: string | object  // Context (JSON string or object)
}
```

**Log retrieval:**
```typescript
// Get all logs of specific type
const allLogs = getLogs('log');        // Informational messages
const allErrors = getLogs('error');    // Errors
const allWarnings = getLogs('warning'); // Warnings
const allDebug = getLogs('debug');     // Debug information

// Get "once" logs
const logOnceMessages = getLogs('logOnce');
```

**System limitations:**
- Maximum 200 messages of each type in memory
- In tester, maximum 200 logging function calls with `showInConsole = true`
- Automatic cleanup of old messages when limits are exceeded

### ⚠️ Important: Using console.log

**In JT-LIB, using `console.log` is NOT recommended!** Instead, use specialized logging functions:

- **`log()`** - for informational messages
- **`trace()`** - for detailed logging
- **`warning()`** - for warnings
- **`error()`** - for errors
- **`debug()`** - for debug information

**Advantages of JT-LIB functions:**
- Structured logging with context
- Automatic output management
- Integration with reporting system
- Performance control

### Where Logs Are Output

**The logging system works in two modes depending on the `showInConsole` parameter:**

#### Mode 1: Console Logs (showInConsole = true)
When logs are output to console, they appear in several places:

**In Runtime (real-time trading):**
- **Browser Console** - all logs are displayed in developer console
- **Runtime Tab** - logs are displayed in JT-Trader interface on "Runtime" tab
- **Server File** - all logs are automatically saved to server file for subsequent analysis

**In Tester (testing on historical data):**
- **Tester Console** - logs are displayed in tester console
- **Tester Report** - logs are included in final testing report
- **Results File** - saved together with testing results

#### Mode 2: Memory Logs (showInConsole = false)
When logs are NOT output to console, they are saved only in memory:

**Memory Storage:**
- **globals.logs** - all logs are saved in global `globals.logs` object
- **Access via getLogs()** - can be retrieved programmatically via `getLogs()` function
- **Strategy Report** - logs are included in final strategy report

**Important to understand:**
- Memory logs are available only during strategy operation
- When restarting strategy, memory logs are lost
- For permanent storage, use console mode

#### Automatic Console Output
Some log types **always** output to console regardless of parameter:
- **error()** - all errors always go to console
- **warning()** - warnings are always shown in console

#### Practical Recommendations

**For real-time debugging:**
```typescript
// Logs will be visible in console and Runtime tab
log('Strategy', 'Important event', { data: 'value' }, true);
trace('OrderManager', 'Detailed information', { orderId: '123' }, true);
```

**For data collection in report:**
```typescript
// Logs will be saved in memory and included in report
log('Strategy', 'Operation statistics', { trades: 5, profit: 100 });
debug('IndicatorService', 'Indicator calculation', { rsi: 65.4 });
```

**Mixed approach:**
```typescript
// Critical events - to console
error('ConnectionManager', 'Connection error', { error: 'timeout' }); // always to console

// Regular information - to memory for report
log('Strategy', 'Daily statistics', { date: '2024-01-15', profit: 50 });
```

#### Access to Logs in Different Modes

**In Runtime (real-time trading):**
```typescript
// View logs in browser console
// 1. Open Developer Tools (F12)
// 2. Go to Console tab
// 3. All logs with showInConsole=true will be visible in real-time

// View logs in JT-Trader interface
// 1. Open "Runtime" tab in JT-Trader
// 2. Logs are displayed in special log window
// 3. Can filter by type and event

// Programmatic access to memory logs
const allLogs = getLogs('log');
const errors = getLogs('error');
const strategyLogs = getLogs('log').filter(log => log.event === 'Strategy');
```

**In Tester (testing on historical data):**
```typescript
// Logs in tester console
// - Displayed in tester window during execution
// - Saved to testing results file

// Logs in tester report
// - Included in final HTML/PDF report
// - Grouped by type and event
// - Available for analysis after testing completion

// Programmatic access (only during execution)
const testLogs = getLogs('log');
const testErrors = getLogs('error');
```

**Log files on server:**
- Logs with `showInConsole=true` are automatically saved to files
- File location depends on JT-Trader configuration
- Usually located in `logs/` or `runtime/` folder
- Named by date and time of strategy launch

### Logging Settings

- **`ARGS.isNoLogs = 1`** - complete logging disable
- **`ARGS.isDebug = true`** - enable debug mode
- **`ARGS.isDebugStorage = true`** - detailed storage operation logging

## Error Handling

JT-LIB provides a powerful error handling system built around the **BaseError** class. This system provides detailed diagnostics, automatic logging, and integration with library components.

**Main features:**
- **BaseError** - extended error class with unique identification
- **Automatic integration** with BaseObject and logging system
- **Multiple context** - accumulating information about system state
- **Debug support** - detailed information in debug mode

**Detailed documentation:** [Error Handling](./error-handling.md)

#### Brief Summary of Log Output

| Parameter | Runtime | Tester | Server File | Memory | Report |
|-----------|---------|--------|-------------|--------|--------|
| `showInConsole = true` | ✅ Console + Runtime | ✅ Console + Report | ✅ Yes | ✅ Yes | ✅ Yes |
| `showInConsole = false` | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| `error()` | ✅ Always | ✅ Always | ✅ Always | ✅ Yes | ✅ Yes |
| `warning()` | ✅ Always | ✅ Always | ✅ Always | ✅ Yes | ✅ Yes |

**Recommendations:**
- **For debugging** - use `showInConsole = true`
- **For statistics collection** - use `showInConsole = false`
- **Critical events** - use `error()` and `warning()` (always to console)
- **Regular information** - use `log()` without console for reports

### Automatic Error Management

The system automatically tracks error count and may stop strategy when limits are exceeded:
- **In tester**: stop after 20 errors
- **In real-time**: stop after 10 errors
- **Automatic reset**: error counter resets every hour



### Architectural Improvements
- **Simplified script access** - more intuitive API via `globals.script`
- **Enhanced persistence** - triggers save their state between launches
- **Performance optimization** - reduced unnecessary operations

## Component Interaction

All core components are closely interconnected and form a unified ecosystem:

**BaseObject** uses `globals` for automatic registration in global storage. This ensures centralized management of all objects.

**Storage** inherits from `BaseObject`, gaining all lifecycle management capabilities and automatic system registration.

**Log** uses `globals` for logging settings management and access to global parameters.

**Base** provides utilities for all components, ensuring consistent work with arguments and basic operations.

This architecture ensures reliable resource management, prevents memory leaks, and guarantees proper termination of all system components.

