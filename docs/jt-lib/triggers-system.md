---
id: triggers-system
title: Triggers System
sidebar_label: Triggers System
---

# Triggers System

**TriggerService** manages the triggers system, which automatically executes actions when certain conditions are met. Triggers are integrated with the storage system and can be restored after strategy restart.

## ⚠️ Important: Ways to Register Callbacks

**There are two ways to pass an executable function to a trigger:**

### 1. Direct Callback Passing (Arrow Function)
```typescript
// ✅ Correct - arrow function
trigger.addTask({
  name: 'myTask',
  triggerPrice: 50000,
  callback: async (args) => {
    log('PriceTrigger', 'Trigger activated!', { args }, true);
  }
});
```

### 2. Callback Registration by Name (Regular Function)
```typescript
// ✅ Correct - regular function registration
class Script extends BaseScript {
  async onInit() {
    // Register function by name
    this.triggerService.registerHandler('myTask', this.onPriceTrigger, this);
    
    // Add task without callback
    trigger.addTask({
      name: 'myTask',
      triggerPrice: 50000,
      canReStore: true // ⚠️ IMPORTANT: only for registered functions!
    });
  }
  
  // Regular function (not arrow!)
  async onPriceTrigger(args: any) {
    log('PriceTrigger', 'Trigger activated!', { args }, true);
  }
}

// ❌ INCORRECT - arrow functions cannot be registered
class Script extends BaseScript {
  async onInit() {
    // ❌ Error! Arrow functions are not supported for registration
    this.triggerService.registerHandler('myTask', (args) => {
      log('PriceTrigger', 'This won\'t work!', { args }, true);
    }, this);
  }
}
```

### 🔄 Trigger Restoration on Reload

**Key Difference:** Only registered callbacks can be restored when the script is reloaded!

- ✅ **Registered functions** (`canReStore: true`) — restored automatically
- ❌ **Arrow functions** — NOT restored on reload

## Trigger Architecture

- **Centralized Management** - all triggers are managed through `TriggerService`
- **Automatic Storage** - trigger state is saved in Storage
- **Restoration After Restart** - triggers automatically restore their state
- **Event Integration** - triggers subscribe to appropriate events

## Trigger Types

### Order Triggers

**OrderTrigger** executes actions when order status changes.

**Key Features:**
- React to order status changes (open, filled, canceled)
- Support for both `orderId` and `clientOrderId`
- Automatic task lifecycle management
- Storage system integration

**Usage Examples:**
```typescript
// Register handler
globals.triggers.registerOrderHandler('createSlTp', this.createSlTp, this);

// Create task
globals.triggers.addTaskByOrder({
  name: 'createSlTp',
  orderId: '12345',
  status: 'closed',
  canReStore: true
});
```

### Price Triggers

**PriceTrigger** executes actions when certain price levels are reached.

**Key Features:**
- Support for trigger directions (UpToDown, DownToUp)
- Automatic direction detection based on current price
- Performance optimization through min/max prices
- Multiple symbol support

**Trigger Directions:**
- **`UpToDown`** - triggers when price falls to specified level
- **`DownToUp`** - triggers when price rises to specified level

**Automatic Direction Selection:**
If direction is not specified, the system automatically determines it based on current price:
- If current price is **above** trigger price → `UpToDown` is selected
- If current price is **below** trigger price → `DownToUp` is selected

**Usage Examples:**

```typescript
import { PriceTriggerDirection } from 'jt-lib';

// 1. Automatic direction selection
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'autoDirection',
  triggerPrice: 50000, // Direction will be selected automatically
  canReStore: true
});

// 2. Explicit direction - triggers on price rise
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'sellOnRise',
  triggerPrice: 55000,
  direction: PriceTriggerDirection.DownToUp, // Triggers on rise
  canReStore: true
});

// 3. Explicit direction - triggers on price fall
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'buyOnFall',
  triggerPrice: 45000,
  direction: PriceTriggerDirection.UpToDown, // Triggers on fall
  canReStore: true
});

// Register handlers
globals.triggers.registerPriceHandler('BTC/USDT', 'sellOnRise', this.onPriceRise, this);
globals.triggers.registerPriceHandler('BTC/USDT', 'buyOnFall', this.onPriceFall, this);
```

### Time Triggers

**TimeTrigger** executes actions at specific times or with given intervals.

**Key Features:**
- Execute tasks at specific times
- Recurring tasks with given intervals
- Automatic trigger time validation
- Warnings for incorrect time parameters

**Usage Examples:**
```typescript
// Register handler
globals.triggers.registerTimeHandler('dailyReport', this.generateDailyReport, this);

// Create task for specific time
globals.triggers.addTaskByTime({
  name: 'dailyReport',
  triggerTime: Date.now() + 24 * 60 * 60 * 1000, // tomorrow
  canReStore: true
});

// Recurring task
globals.triggers.addTaskByTime({
  name: 'hourlyCheck',
  triggerTime: Date.now() + 60 * 60 * 1000, // in an hour
  interval: 60 * 60 * 1000, // repeat every hour
  canReStore: true
});
```

## Trigger Storage System

All triggers support automatic saving and restoration:

- **`canReStore: true`** - trigger will be saved to Storage
- **Automatic Restoration** - when strategy restarts, triggers restore their state
- **Persistence** - tasks continue working after restart

## Trigger Management

### Handler Registration
```typescript
// Register handlers for all trigger types
globals.triggers.registerOrderHandler('taskName', this.handler, this);
globals.triggers.registerPriceHandler('BTC/USDT', 'taskName', this.handler, this);
globals.triggers.registerTimeHandler('taskName', this.handler, this);
```

### Task Creation
```typescript
// Create tasks for each trigger type
const orderTaskId = globals.triggers.addTaskByOrder({...});
const priceTaskId = globals.triggers.addTaskByPrice({...});
const timeTaskId = globals.triggers.addTaskByTime({...});
```

### Task Cancellation
```typescript
// Cancel specific task
globals.triggers.cancelOrderTask(orderTaskId);
globals.triggers.cancelPriceTask(priceTaskId);
globals.triggers.cancelTimeTask(timeTaskId);
```

## Practical Examples

### Automatic Stop Loss and Take Profit Management

```typescript
class Script extends BaseScript {
  async onInit() {
    // Register handler for creating SL/TP
    globals.triggers.registerOrderHandler('createSlTp', this.createSlTp, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
  }

  async onTick() {
    const price = this.basket.close();
    
    // Create order with automatic SL/TP
    const order = await this.basket.buyMarket(
      this.basket.getContractsAmount(100, price),
      0, // SL will be set automatically
      0  // TP will be set automatically
    );

    // Create task for automatic SL/TP creation
    globals.triggers.addTaskByOrder({
      name: 'createSlTp',
      orderId: order.id,
      status: 'closed', // will execute when order is filled
      canReStore: true
    });
  }

  async createSlTp(orderId: string) {
    // Get order information
    const order = await this.basket.getOrder(orderId);
    
    if (order && order.status === 'closed') {
      const currentPrice = this.basket.close();
      const slPrice = currentPrice * 0.95; // SL 5% below
      const tpPrice = currentPrice * 1.1;  // TP 10% above
      
      // Create SL and TP orders
      await this.basket.createStopLossOrder('buy', order.amount, slPrice);
      await this.basket.createTakeProfitOrder('buy', order.amount, tpPrice);
    }
  }
}
```

### Price Triggers for Position Entry

```typescript
class Script extends BaseScript {
  async onInit() {
    // Register handler for position entry
    globals.triggers.registerPriceHandler('BTC/USDT', 'enterLong', this.enterLong, this);
    globals.triggers.registerPriceHandler('BTC/USDT', 'enterShort', this.enterShort, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    const currentPrice = this.basket.close();
    
    // Create triggers for position entry
    globals.triggers.addTaskByPrice({
      symbol: 'BTC/USDT',
      name: 'enterLong',
      triggerPrice: currentPrice * 0.98, // entry 2% below current price
      direction: 'DownToUp',
      canReStore: true
    });
    
    globals.triggers.addTaskByPrice({
      symbol: 'BTC/USDT',
      name: 'enterShort',
      triggerPrice: currentPrice * 1.02, // entry 2% above current price
      direction: 'UpToDown',
      canReStore: true
    });
  }

  async enterLong() {
    const price = this.basket.close();
    const contracts = this.basket.getContractsAmount(100, price);
    
    await this.basket.buyMarket(contracts, price * 0.95, price * 1.1);
    log('PositionManager', 'Long position opened', { price, contracts }, true);
  }

  async enterShort() {
    const price = this.basket.close();
    const contracts = this.basket.getContractsAmount(100, price);
    
    await this.basket.sellMarket(contracts, price * 1.05, price * 0.9);
    log('PositionManager', 'Short position opened', { price, contracts }, true);
  }
}
```

### Time Triggers for Reports

```typescript
class Script extends BaseScript {
  async onInit() {
    // Register handler for daily reports
    globals.triggers.registerTimeHandler('dailyReport', this.generateDailyReport, this);
    globals.triggers.registerTimeHandler('hourlyCheck', this.hourlyCheck, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    // Create daily report at 00:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    globals.triggers.addTaskByTime({
      name: 'dailyReport',
      triggerTime: tomorrow.getTime(),
      interval: 24 * 60 * 60 * 1000, // repeat every day
      canReStore: true
    });
    
    // Create hourly check
    globals.triggers.addTaskByTime({
      name: 'hourlyCheck',
      triggerTime: Date.now() + 60 * 60 * 1000, // in an hour
      interval: 60 * 60 * 1000, // repeat every hour
      canReStore: true
    });
  }

  async generateDailyReport() {
    const positions = await this.basket.getPositions();
    const orders = await this.basket.getOrders();
    
    log('DailyReport', '=== Daily Report ===', {}, true);
    log('DailyReport', 'Positions count', { count: positions.length }, true);
    log('DailyReport', 'Orders count', { count: orders.length }, true);
    log('DailyReport', 'Current P&L', { pnl: positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0) }, true);
  }

  async hourlyCheck() {
    const price = this.basket.close();
    log('HourlyCheck', 'Hourly check - Current price', { price }, true);
    
    // Check trading conditions
    if (price > 50000) {
      log('HourlyCheck', 'Price above 50k - consider taking profit', { price }, true);
    }
  }
}
```

## Integration with Other Components

### TriggerService + EventEmitter
- TriggerService subscribes to events through EventEmitter
- Automatic lifecycle synchronization
- Full typing of all handlers

### Storage + Triggers
- Triggers automatically save their state
- When strategy restarts, state is restored
- Ensures automation continuity

### BaseScript + Triggers
- Strategy registers trigger handlers
- Automatic subscription management on destruction
- Event system integration for automation

## Next Steps

- **[Event System](/docs/jt-lib/events-system)** - EventEmitter for event management
- **[Trading Scripts](/docs/jt-lib/trading-scripts)** - Base class for trading scripts
- **[Exchange Operations](/docs/jt-lib/exchange-orders-basket)** - OrdersBasket for trading operations