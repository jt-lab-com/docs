---
id: events-system
title: Event System (Events)
sidebar_label: Event System
---

# Event System (Events)

The JT-LIB event system provides reactive programming and automation of trading strategies. It consists of EventEmitter for event management and a trigger system for automatic execution of actions based on conditions.

## EventEmitter - How the Event System Works

**EventEmitter** is the central component of the event system, inheriting from `BaseObject`. It manages event subscriptions, their execution, and automatic resource cleanup.


### Key Features

- **Event Subscription** - registration of handlers for various event types
- **Automatic Lifecycle Management** - unsubscription when objects are destroyed
- **Specialized Events** - `onTick`, `onOrderChange` with symbol support
- **Handler Validation** - checking correctness of functions and owners
- **Interval Management** - configuring tick execution frequency

### Key Methods

#### subscribe()
Main method for event subscription. Provides safe handler registration with full typing.

**New typing capabilities:**
- **Generic typing** - `subscribe<T extends EventName>(eventName: T, handler: TypedEventHandler<T>, owner: BaseObject)`
- **Automatic type inference** - TypeScript automatically determines data type for handler
- **Compile-time type checking** - preventing errors with incorrect data types

**Important limitations:**
- Doesn't support anonymous arrow functions (must be named function)
- Handler must be a method of class inheriting from `BaseObject`
- Owner must be an instance of `BaseObject`

#### subscribeOnTick()
Specialized method for tick subscription with configurable interval.

```typescript
// Subscribe to ticks with 30 second interval
globals.events.subscribeOnTick(this.onTick, this, 'BTC/USDT', 30*1000);

// Subscribe with default interval (1000ms)
globals.events.subscribeOnTick(this.onTick, this, 'BTC/USDT');
```

#### subscribeOnOrderChange()
Subscribe to order changes for specific symbol.

```typescript
// Subscribe to BTC/USDT order changes
globals.events.subscribeOnOrderChange(this.onOrderChange, this, 'BTC/USDT');
```

#### emit()
Event generation with full data typing.

**New capabilities:**
- **Generic typing** - `emit<T extends EventName>(eventName: T, data?: GetEventData<T>)`
- **Automatic type checking** - TypeScript checks data type compliance with event type
- **IntelliSense support** - autocompletion for data types

```typescript
// Typed event generation
const order: Order = { /* order data */ };
await globals.events.emit('onPnlChange', {
  type: 'pnl',
  amount: 100.50,
  symbol: 'BTC/USDT',
  order: order
});

// TypeScript will automatically check type compliance
```

### Event Management System

EventEmitter automatically manages event lifecycle:
- Automatically unsubscribes objects from all events when destroyed
- Prevents memory leaks through incorrect subscriptions
- Ensures proper resource cleanup

## Event Subscription - How to Listen to System Changes

### Event Types

#### System Events with Full Typing
- **`onTick`** - executed at specified interval (type: `TickEventData`)
- **`onOrderChange`** - order status changes (type: `OrderChangeEventData`)
- **`onPnlChange`** - profit/loss changes (type: `PnlChangeEventData`)
- **`onArgsUpdate`** - strategy argument updates (type: `ArgsUpdateEventData`)
- **`onTimer`** - timer events (type: `TimerEventData`)
- **`onTickEnded`** - tick completion (type: `TickEndedEventData`)
- **`onRun`** - strategy launch (type: `RunEventData`)
- **`onStop`** - strategy stop (type: `StopEventData`)
- **`onReportAction`** - report actions (type: `ReportActionEventData`)

#### Dynamic Symbol Events
- **`onTick_${symbol}`** - ticks for specific symbol
- **`onOrderChange_${symbol}`** - order changes for specific symbol

#### Custom Events
- **`emit()`** - custom event generation (type: `CustomEventData`)
- **`subscribe()`** - custom event subscription

### Event Subscription Examples

```typescript
// Subscribe to order changes for specific symbol
globals.events.subscribeOnOrderChange(this.handleOrderChange, this, 'BTC/USDT');

// Subscribe to ticks for specific symbol with 5 second interval
globals.events.subscribeOnTick(this.processTick, this, 'BTC/USDT', 5000);

// Subscribe to system events
globals.events.subscribe('onPnlChange', this.onPnlChange, this);
globals.events.subscribe('onArgsUpdate', this.onArgsUpdate, this);
globals.events.subscribe('onReportAction', this.onReportAction, this);

// Subscribe to tester events
globals.events.subscribe('onAfterStop', this.onStopTester, this);

// Subscribe to runtime events
globals.events.subscribe('onOrderChange', this.collectOrdersRuntime, this);
```

### Event Handler Examples

```typescript
class MyService extends BaseObject {
  constructor() {
    super();
    // Subscribe to events in constructor
    globals.events.subscribe('onOrderChange', this.onOrderChange, this);
    globals.events.subscribe('onTick', this.onTick, this);
  }

  // Order change handler
  async onOrderChange(order: Order) {
    log('OrderHandler', 'Order status changed', { orderId: order.id, status: order.status }, true);
    if (order.status === 'closed') {
      log('OrderHandler', 'Order filled', { orderId: order.id, filled: order.filled, amount: order.amount }, true);
    }
  }

  // Tick handler
  async onTick(data: Tick) {
    trace('TickHandler', 'Price tick', { price: data.close, volume: data.volume }, true);
  }

  // PnL change handler
  async onPnlChange(data: PnlChangeEventData) {
    log('PnLHandler', 'PnL changed', { type: data.type, amount: data.amount, symbol: data.symbol }, true);
  }
}



## Integration with Other Components

The event system in JT-LIB is integrated with the main library components. EventEmitter is created in the BaseScript constructor and then used throughout the system. The main event providers are BaseScript and OrdersBasket.

### Event Providers

#### BaseScript - Main Event Provider

**BaseScript** generates the following events:
- **`onTick`** - on each market data tick (via emitOnTick)
- **`onTickEnded`** - tick completion
- **`onTimer`** - timer events
- **`onOrderChange`** - on order status change
- **`onArgsUpdate`** - on strategy argument updates
- **`onEvent`** - events from exchange websockets
- **`onRun`** - strategy launch
- **`onBeforeStop`** - before strategy stop
- **`onStop`** - on strategy stop
- **`onAfterStop`** - after strategy stop
- **`onReportAction`** - report actions

#### OrdersBasket - Trading Event Provider

**OrdersBasket** generates the following events:
- **`onPnlChange`** - on profit/loss changes (realized and unrealized)


### Event Subscriptions

#### TriggerService
When created in constructor, subscribes to events:
- **`onTick`** - for time-based task execution
- **`onOrderChange`** - for order status-based task execution

#### OrdersBasket
When created in constructor, subscribes to events:
- **`onOrderChange_${symbol}`** - for specific symbol
- **`onTick_${symbol}`** - for specific symbol

#### StandardReportLayout
When created in constructor, subscribes to events:
- **`onArgsUpdate`** - for argument update handling
- **`onAfterStop`** - for tester stop handling
- **`onOrderChange`** - for order change recording in runtime
- **`onReportAction`** - for report action handling

#### ReportStatistics
When created in constructor, subscribes to events:
- **`onOrderChange`** - for order statistics collection
- **`onTick`** - for data collection

#### ReportActionButton
When created in constructor, subscribes to events:
- **`onReportAction`** - for button action handling

**Important:** BaseScript and all script examples do NOT subscribe to events directly. They only override event handling methods (`onTick`, `onOrderChange`, `onInit`, `onStop`, `onEvent`), which are called automatically by the system.

### Automatic Lifecycle Management

The JT-LIB event system provides automatic subscription management to prevent memory leaks and incorrect handler calls.

**Critical security issue:**
In JavaScript, when an object is destroyed, its methods (callback functions) remain in memory if there are references to them in EventEmitter. This leads to two serious problems:

1. **Memory leaks** - objects are not freed from memory
2. **Critical security threat** - callback functions may be called after object destruction, which is especially dangerous in trading systems where this can lead to unexpected trading operations

**Especially critical in trading strategies:**
- User may destroy an object, but callback functions continue to work
- Strategy continues to work even after destroying the callback function owner object
- This can lead to unpredictable financial losses
- Therefore, it's critically important to check if the object is destroyed when calling callback functions

**Solution through `owner` parameter:**
When subscribing to events, an `owner` parameter is passed (usually `this`), which allows the system to track the state of the handler owner object.

**BaseObject provides:**
- Automatic unsubscription from all events when `destroy()` is called
- Setting `_isDestroyed = true` flag when destroyed
- Recursive destruction of child objects
- Calling `unsubscribe()` to clean up all subscriptions

**EventEmitter provides:**
- **Checking `_isDestroyed` flag before calling handlers:**
  ```typescript
  if (listener.owner?._isDestroyed === true) {
    error('EventEmitter::emit()', 'The owner of the listener is destroyed', {
      ...listener,
      owner: undefined,
      data,
    });
    // Do NOT call listener.handler(data) - prevent trading operations!
  } else {
    let result = await listener.handler(data); // Safe call
  }
  ```
- Automatic subscription removal via `unsubscribeByObjectId()`
- Logging attempts to call methods of destroyed objects
- **Critically important:** preventing trading operations by destroyed objects
- Error handling in event handlers

**Automatic cleanup example:**
```typescript
class TradingService extends BaseObject {
  constructor() {
    super();
    // Subscription with passing this as owner
    globals.events.subscribe('onTick', this.onTick, this);
  }
  
  async onTick(data: Tick) {
    // DANGEROUS: without checking _isDestroyed, this method can
    // execute even after object destruction!
    await this.createOrder('buy', 100); // Trading operation!
  }
  
  // When destroy() is called, automatically:
  // 1. _isDestroyed = true is set
  // 2. unsubscribe() is called
  // 3. EventEmitter removes all subscriptions of this object
  // 4. onTick will NO LONGER be called - trading operations stopped
}
```

**Without lifecycle management system:**
```typescript
// DANGEROUS CODE - DO NOT USE!
class DangerousService {
  constructor() {
    // Subscription WITHOUT owner - object is not tracked!
    globals.events.subscribe('onTick', this.onTick, null);
  }
  
  async onTick(data: Tick) {
    // This method will be called even after object destruction!
    await this.createOrder('buy', 100); // CRITICAL ERROR!
  }
}
```

This architecture ensures reliable memory management and prevents leaks when working with events in trading strategies.

