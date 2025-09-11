# JT-LIB

[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

TypeScript library for creating trading robots on the JT-Trader platform. Provides a simplified interface for interacting with exchanges and implementing trading strategies.

## Features

- **Trading operations** - buying, selling, placing orders
- **Market data** - getting prices, volumes, order book
- **Event system** - reacting to market changes in real time
- **Data storage** - saving state and operation history
- **Triggers** - automatic execution of actions by conditions
- **Reporting** - detailed analytics of trading operations
- **Technical indicators** - built-in indicators for analysis
- **Candle management** - buffering and processing candle data

## Installation

```bash
# JT-LIB is installed together with JT-Trader
git clone https://github.com/your-org/jt-trader.git
cd jt-trader
npm install
```

## Quick Start

### Your first trading script - DCA strategy

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

  async onInit() {
    // Create basket for trading
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
  }

  // Purchase function
  buyDCA = async () => {
    const amount = this.dcaBasket.getContractsAmount(this.sizeUsd);
    await this.dcaBasket.buyMarket(amount);
    log('DCA purchase executed', `amount: ${amount}, price: ${this.dcaBasket.close()}`);
  };
}
```

## Main Components

### BaseScript - Base class for trading strategies

```typescript
class Script extends BaseScript {
  async onInit() {
    // Strategy initialization
  }

  async onTick() {
    // Process each tick
  }

  async onOrderChange(order: Order) {
    // Handle order changes
  }

  async onStop() {
    // Clean up resources on stop
  }
}
```

### OrdersBasket - Trading operations management

```typescript
// Create basket for trading
const basket = new OrdersBasket({
  symbol: 'BTC/USDT',
  connectionName: 'Binance',
  leverage: 1,
  hedgeMode: false
});

await basket.init();

// Trading operations
const amount = basket.getContractsAmount(100); // 100 USD to contracts
await basket.buyMarket(amount); // Market buy
await basket.sellLimit(amount, 50000); // Limit sell
```

### Technical Indicators

```typescript
// Create indicators
const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);
const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);

// Get values
const currentRsi = rsi.getValue();
const currentSma = sma.getValue();

// Use in strategy
if (currentRsi < 30 && currentPrice > currentSma) {
  // Buy signal
}
```

## Reporting System

```typescript
// Create standard report
const reportLayout = new StandardReportLayout();

// Send data to report
updateReport('chart', {
  type: 'line',
  data: priceData,
  title: 'BTC/USDT Price'
});

updateReport('metric', {
  value: profit,
  title: 'Profit',
  color: profit > 0 ? 'green' : 'red'
});
```

## Event System and Triggers

```typescript
// Subscribe to events
globals.events.subscribeOnTick(() => this.onSymbolTick('BTC/USDT'), this, 'BTC/USDT', 1000);

// Register triggers
globals.triggers.registerTimeHandler('myTrigger', this.myFunction, this);
globals.triggers.addTaskByTime({
  name: 'myTrigger',
  triggerTime: currentTime() + 60000,
  interval: 300000, // every 5 minutes
  canReStore: true
});
```

## Logging

```typescript
// Different logging levels
log('Strategy', 'Information message', { data: 'value' }, true);
trace('Strategy', 'Detailed information', { data: 'value' }, true);
warning('Strategy', 'Warning', { data: 'value' }, true);
error('Strategy', 'Error', { data: 'value' });
debug('Strategy', 'Debug information', { data: 'value' });
```

## Library Structure

```
jt-lib-source/
├── src/
│   └── lib/
│       ├── core/                    # System core
│       │   ├── base-object.ts      # Base object
│       │   ├── base-script.ts      # Base script
│       │   ├── globals.ts          # Global state
│       │   ├── storage.ts          # Data storage
│       │   └── log.ts              # Logging system
│       ├── events/                  # Event system
│       ├── exchange/                # Exchange interaction
│       ├── candles/                 # Candle management
│       ├── indicators/              # Technical indicators
│       ├── report/                  # Reporting
│       ├── script/                  # Trading scripts
│       └── interfaces/              # TypeScript interfaces
```

## Documentation

- [Introduction and Architecture](introduction-architecture) - Library overview
- [Core Fundamentals](core-fundamentals) - Basic components
- [Trading Scripts](trading-scripts) - Creating strategies
- [Technical Indicators](technical-indicators) - Market analysis
- [Event System](events-system) - EventEmitter and triggers
- [Order Management](exchange-orders-basket) - OrdersBasket
- [Reporting](reporting-system) - Creating reports
- [Error Handling](error-handling) - Error management

## Support

For help and support:

- Study the documentation
- Contact the community
- Report bugs

## License

JT-LIB is available under dual license:

- **AGPLv3** - free license for personal, educational and open source use
- **Commercial license** - for commercial use and SaaS solutions