---
id: script-launch
title: Script Launch
sidebar_label: Script Launch
---

# Script Launch

To launch a trading script in JT-Trader, you need to create a scenario (runtime) that will launch the Script class defined in the strategy file.

## How It Works

1. **In JT-Trader** you create a scenario (runtime) with settings
2. **Scenario** points to a file with Script class
3. **On launch** JT-Trader executes the Script class from the specified file
4. **Script class** inherits from BaseScript and contains trading strategy logic

## Creating a Scenario in JT-Trader

### 1. Navigate to Runtime Tab

In the JT-Trader interface, go to the Runtime tab, where all running and stopped trading scripts are displayed.

### 2. Creating a New Scenario

Click the **Create Runtime** button to create a new script launch scenario.

![Create Runtime Screenshot](/images/create-scanerio-runtime-intro.jpg)

### 3. Scenario Parameter Configuration

When creating a scenario, you must specify the following required parameters:

**Main parameters:**
- **Name** - Scenario name for identification
- **Script** - Trading script file

**Connection parameters:**
- **Connection** - Select exchange connection from the list of available connections
- **Symbols** - List of trading pairs, comma-separated (e.g.: `BTC/USDT:USDT,ETH/USDT:USDT,ADA/USDT:USDT`)

### 4. User Parameters

In the **Parameters** section, you can add user parameters that will be passed to the script. These parameters are configured by the script developer and may include buy/sell prices, trading volumes, stop-loss settings, and other strategy parameters.

#### Parameter Types

JT-Trader supports three parameter types:

- **String** - string values (e.g., names, descriptions)
- **Number** - numeric values (prices, volumes, percentages)
- **Boolean** - logical values (enable/disable functions)

#### User Parameter Examples

```typescript
// Strategy parameters
buyPrice: 50000          // Buy price
sellPrice: 55000         // Sell price
volume: 0.001           // Trading volume
stopLoss: 45000         // Stop loss
takeProfit: 60000       // Take profit
isDebug: true           // Debug mode
strategyName: "SMA"     // Strategy name
leverage: 10            // Leverage for futures
```

### 5. User Parameter Configuration

In the **Parameters** section, add parameters that will be passed to the script. Each parameter must have:

- **Name** - parameter name (must match the name in script code)
- **Type** - parameter type (String, Number, Boolean)
- **Value** - parameter value
- **Description** - parameter description (optional)

#### Parameter Configuration Example

| Name | Type | Value | Description |
|------|------|-------|-------------|
| buyPrice | Number | 50000 | Buy price |
| sellPrice | Number | 55000 | Sell price |
| volume | Number | 0.001 | Trading volume |
| stopLoss | Number | 45000 | Stop loss |
| takeProfit | Number | 60000 | Take profit |
| isDebug | Boolean | true | Debug mode |
| strategyName | String | "SMA Strategy" | Strategy name |

### 6. Save and Launch

After configuring all parameters, click the **Save** button to save the scenario, then click the **Run** button to launch the script. When launching, all specified connection parameters will be passed to the script, as well as user parameters if they were added.

## What Happens on Launch

After clicking the **Run** button, JT-Trader performs the following actions:

1. **Connects to exchange** - Establishes WebSocket connection with selected exchange
2. **Subscribes to events** - Subscribes to the following events:
   - **Balance changes** - Getting account status updates
   - **Quote arrivals** - Getting new ticks for specified symbols
   - **Position changes** - Tracking open positions
   - **Order changes** - Monitoring status of all orders
3. **Loads file** - Reads the specified file  
4. **Finds Script class** - Searches for the class and creates it in the environment
5. **Creates instance** - Creates an object of this class
6. **Passes parameters** - Passes all scenario settings to the script
7. **Starts execution** - Begins execution of lifecycle methods

## Arguments and Parameters System

### Global ARGS Variable

When launching a script, JT-Trader automatically creates a global variable `ARGS` that contains all parameters passed when creating the scenario. This variable is accessible in all parts of the code through special functions.

### Functions for Working with Arguments

JT-Trader provides a set of functions for safely extracting parameters from the global variable `ARGS`:

#### getArgNumber(name, defaultValue?, required?)
Safely extracts a numeric argument with type checking:
```typescript
const buyPrice = getArgNumber('buyPrice', 50000);        // With default value
const volume = getArgNumber('volume', undefined, true);  // Required parameter
```

#### getArgString(name, defaultValue?, required?)
Safely extracts a string argument:
```typescript
const strategyName = getArgString('strategyName', 'DefaultStrategy');
const connectionName = getArgString('connectionName', undefined, true);
```

#### getArgBoolean(name, defaultValue?, required?)
Safely extracts a boolean argument:
```typescript
const isDebug = getArgBoolean('isDebug', false);
const enableLogging = getArgBoolean('enableLogging', true);
```

### Required Parameters

JT-Trader automatically passes the following required parameters:

- **connectionName** - exchange connection name
- **symbols** - list of trading pairs (comma-separated string)
- **symbol** - first symbol from the list (for compatibility)

### Tester Parameters (only in testing mode)

When running in testing mode, the following are additionally available:

- **start** - testing start date (e.g.: "2021-01")
- **end** - testing end date (e.g.: "2021-12")
- **timeframe** - timeframe for testing
- **balance** - initial balance
- **leverage** - leverage
- **makerFee** - maker fee
- **takerFee** - taker fee

### Argument Usage Example

```typescript
class Script extends BaseScript {
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private isDebug: boolean;
  private strategyName: string;

  async onInit() {
    // Get required parameters
    const connectionName = getArgString('connectionName', undefined, true);
    const symbols = getArgString('symbols', undefined, true);
    
    // Get user parameters
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.isDebug = getArgBoolean('isDebug', false);
    this.strategyName = getArgString('strategyName', 'DefaultStrategy');
    
    // Logging received parameters
    log('Script', 'Strategy parameters', {
      connectionName,
      symbols,
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      volume: this.volume,
      isDebug: this.isDebug,
      strategyName: this.strategyName
    }, true);
  }
}
```

## Script Class in Strategy File

The strategy file must define a Script class that inherits from BaseScript. This class contains all the trading strategy logic.

### Script Class Structure

```typescript
class Script extends BaseScript {
  // Strategy parameters
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private stopLoss: number;
  private takeProfit: number;
  private isDebug: boolean;
  private strategyName: string;

  // Strategy initialization
  async onInit() {
    // Get required parameters
    const connectionName = getArgString('connectionName', undefined, true);
    const symbols = getArgString('symbols', undefined, true);
    
    // Get user parameters
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.stopLoss = getArgNumber('stopLoss', 45000);
    this.takeProfit = getArgNumber('takeProfit', 60000);
    this.isDebug = getArgBoolean('isDebug', false);
    this.strategyName = getArgString('strategyName', 'SimpleStrategy');
    
    // Parameter logging
    log('Script', 'Strategy initialized', {
      strategyName: this.strategyName,
      connectionName,
      symbols,
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      volume: this.volume,
      stopLoss: this.stopLoss,
      takeProfit: this.takeProfit,
      isDebug: this.isDebug
    }, true);
  }

  // Handle new ticks (only for first symbol)
  async onTick(data: Tick) {
    const currentPrice = data.close;
    
    // Trading strategy logic
    if (currentPrice <= this.buyPrice) {
      await this.buyMarket(this.volume);
      log('TradingStrategy', 'Bought at price', { 
        currentPrice, 
        volume: this.volume,
        stopLoss: this.stopLoss,
        takeProfit: this.takeProfit
      }, this.isDebug);
    }
    
    if (currentPrice >= this.sellPrice) {
      await this.sellMarket(this.volume);
      log('TradingStrategy', 'Sold at price', { 
        currentPrice, 
        volume: this.volume 
      }, this.isDebug);
    }
  }

  // Handle order changes
  async onOrderChange(order: Order) {
    log('OrderManager', 'Order status changed', { 
      orderId: order.id, 
      status: order.status,
      symbol: order.symbol,
      side: order.side
    }, this.isDebug);
  }

  // Work completion
  async onStop() {
    log('Script', 'Strategy stopped', {
      strategyName: this.strategyName
    }, true);
  }
}
```

## Best Practices for Working with Parameters

### Parameter Validation

Always check the correctness of received parameters:

```typescript
async onInit() {
  // Numeric parameter validation
  this.buyPrice = getArgNumber('buyPrice', 50000);
  if (this.buyPrice <= 0) {
    throw new Error('Buy price must be greater than 0');
  }
  
  // Volume validation
  this.volume = getArgNumber('volume', 0.001);
  if (this.volume <= 0 || this.volume > 1) {
    throw new Error('Volume must be from 0 to 1');
  }
  
  // Boolean parameter validation
  this.isDebug = getArgBoolean('isDebug', false);
}
```

### Using Default Values

Always specify reasonable default values for all parameters:

```typescript
// Good - has default value
const buyPrice = getArgNumber('buyPrice', 50000);

// Bad - may cause error
const buyPrice = getArgNumber('buyPrice'); // undefined if parameter not passed
```

### Required Parameters

Use the `required: true` flag only for critically important parameters:

```typescript
// Required parameters
const connectionName = getArgString('connectionName', undefined, true);
const symbols = getArgString('symbols', undefined, true);

// User parameters with default values
const buyPrice = getArgNumber('buyPrice', 50000);
const volume = getArgNumber('volume', 0.001);
```

### Parameter Logging

Always log received parameters for debugging:

```typescript
async onInit() {
  // Get all parameters
  const params = {
    buyPrice: getArgNumber('buyPrice', 50000),
    sellPrice: getArgNumber('sellPrice', 55000),
    volume: getArgNumber('volume', 0.001),
    isDebug: getArgBoolean('isDebug', false)
  };
  
  // Logging for debugging
  log('Script', 'Strategy parameters', params, true);
}
```

### Error Handling

Handle parameter retrieval errors:

```typescript
try {
  this.buyPrice = getArgNumber('buyPrice', 50000);
} catch (error) {
  log('Script', 'Error getting buyPrice parameter', { error: error.message }, true);
  this.buyPrice = 50000; // Use default value
}
```