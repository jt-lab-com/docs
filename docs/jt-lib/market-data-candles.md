---
id: market-data-candles
title: Market Data (Candles)
sidebar_label: Market Data
---

# Market Data (Candles)

JT-LIB provides a powerful system for working with market data, including historical candle retrieval, data buffering, and market analysis. The system is built around `CandlesBuffer` for efficient data management and `getHistory` for historical data retrieval.

## Getting Candles - Historical Data

### getHistory Function

**`getHistory`** is the main function for retrieving historical candle data.

```typescript
getHistory(symbol: string, timeframe: TimeFrame, startTime: number, limit?: number): Promise<OHLC[]>
```

**Parameters:**
- `symbol` — trading symbol (e.g., 'BTC/USDT')
- `timeframe` — candle timeframe ('1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M')
- `startTime` — start time in milliseconds
- `limit` — number of candles (default: maximum available)

**Returns:** Array of candles in format `[timestamp, open, high, low, close, volume]`

### Usage Examples

```typescript
// Get last 100 candles for 1 hour
const timeFrom = tms() - 1000 * 60 * 60 * 24 * 7; // 7 days ago
const candles = await getHistory('BTC/USDT', '1h', timeFrom, 100);

// Get daily candles for last month
const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
const dailyCandles = await getHistory('ETH/USDT', '1d', monthAgo, 30);

// Get minute candles for analysis
const minuteCandles = await getHistory('BTC/USDT', '1m', Date.now() - 60 * 60 * 1000, 60);
```

### Candle Data Format

```typescript
// Each candle is represented as an array:
type OHLC = [number, number, number, number, number, number];
// [timestamp, open, high, low, close, volume]

// Example:
const candle = [1614556800000, 50000, 51000, 49000, 50500, 1000];
// timestamp: 1614556800000 (candle open time)
// open: 50000 (open price)
// high: 51000 (maximum price)
// low: 49000 (minimum price)
// close: 50500 (close price)
// volume: 1000 (trading volume)
```

## CandlesBuffer - Data Buffering

**`CandlesBuffer`** is a class for efficient candle buffer management with automatic updates. In JT-LIB, buffers are managed through the global `CandlesBufferService`, which prevents creating duplicate buffers for the same symbol and timeframe combinations.

### Key Features

- **Global Caching** — one buffer per symbol+timeframe combination
- **Automatic Updates** — subscription to `onTick` events for data updates
- **Data Preloading** — automatic historical data loading on initialization
- **Buffer Size Management** — limiting maximum buffer size
- **OHLC Data Access** — methods for getting open, high, low, close, volume

### Getting Buffer Through Global Service

```typescript
// Get buffer through global service (recommended way)
const buffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1h',
  preloadCandlesCount: 250, // number of candles to preload
  maxBufferLength: 1000     // maximum buffer size
});

// Buffer is automatically initialized and cached
// On repeated request with same parameters, existing buffer is returned
```

### CandlesBufferOptions Parameters

```typescript
interface CandlesBufferOptions {
  symbol: string;                    // trading symbol
  timeframe: string | number;        // timeframe
  preloadCandlesCount?: number;      // number of candles to preload (default: 250)
  maxBufferLength?: number;          // maximum buffer size (default: 1000)
}
```

### How Caching Works

The `CandlesBufferService` creates a unique key for each buffer: `${symbol}-${timeframe}`. On first request, a new buffer is created; on repeated requests with the same parameters, the existing buffer is returned.

### CandlesBuffer Methods

```typescript
// Get all candles
const candles = buffer.getCandles();

// Get specific candle (shift = 0 - last candle)
const lastCandle = buffer.getCandle(0);
const prevCandle = buffer.getCandle(1);

// Get OHLC data of last candle
const close = buffer.close();
const high = buffer.high();
const low = buffer.low();
const open = buffer.open();
const volume = buffer.volume();
const timestamp = buffer.tms();

// Clear buffer
buffer.clear();

// Get last update time
const lastUpdate = buffer.getLastTimeUpdated();
```

## Time Intervals - Working with Timeframes

### Supported Timeframes

JT-LIB supports the following timeframes:

| Timeframe | Minutes | Description |
|-----------|---------|-------------|
| `'1m'` | 1 | 1 minute |
| `'5m'` | 5 | 5 minutes |
| `'15m'` | 15 | 15 minutes |
| `'1h'` | 60 | 1 hour |
| `'4h'` | 240 | 4 hours |
| `'1d'` | 1440 | 1 day |
| `'1w'` | 10080 | 1 week |
| `'1M'` | 43200 | 1 month |

### Timeframe Conversion

```typescript
import { convertTimeframeToString, convertTimeframeToNumber } from 'jt-lib';

// Convert to string
const tfString = convertTimeframeToString(60); // '1h'
const tfString2 = convertTimeframeToString('m60'); // '1h'

// Convert to number (minutes)
const tfNumber = convertTimeframeToNumber('1h'); // 60
const tfNumber2 = convertTimeframeToNumber('1d'); // 1440
```

### Time Rounding by Timeframe

```typescript
import { roundTimeByTimeframe } from 'jt-lib';

const timestamp = Date.now();
const roundedTime = roundTimeByTimeframe(timestamp, '1h');
// Rounds time to start of hour
```

## Market Data Processing - How to Analyze Market

### CandlesBufferService - Global Buffer Management

**`CandlesBufferService`** is a global service for managing candle buffers. The service is automatically created in `BaseScript` and accessible through `globals.candlesBufferService`.

```typescript
// Get buffer through global service
const buffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1h',
  preloadCandlesCount: 500
});

// Service automatically manages buffer caching
// Buffers are created by key: `${symbol}-${timeframe}`
// On repeated request with same parameters, existing buffer is returned
```

### Integration with Indicators

CandlesBuffer integrates with the indicator system:

```typescript
import { BaseIndicator } from 'jt-lib';

class MyIndicator extends BaseIndicator {
  constructor(symbol: string, timeframe: TimeFrame, buffer: CandlesBuffer) {
    super(symbol, timeframe, buffer);
  }

  calculate() {
    const candles = this.candlesBuffer.getCandles();
    // Indicator calculation logic
  }
}
```

### Practical Analysis Examples

#### Simple Trend Analysis

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Get buffer through global service
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h',
      preloadCandlesCount: 100
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 20) return;

    // Trend analysis on last 20 candles
    const recentCandles = candles.slice(-20);
    const avgHigh = recentCandles.reduce((sum, c) => sum + c.high, 0) / 20;
    const avgLow = recentCandles.reduce((sum, c) => sum + c.low, 0) / 20;
    
    const currentPrice = this.buffer.close();
    
    if (currentPrice > avgHigh) {
      log('TrendAnalysis', 'Uptrend', { currentPrice, avgHigh, avgLow }, true);
    } else if (currentPrice < avgLow) {
      log('TrendAnalysis', 'Downtrend', { currentPrice, avgHigh, avgLow }, true);
    } else {
      log('TrendAnalysis', 'Sideways movement', { currentPrice, avgHigh, avgLow }, true);
    }
  }
}
```

#### Volatility Analysis

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Get buffer through global service
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '4h',
      preloadCandlesCount: 50
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 10) return;

    // Volatility calculation
    const recentCandles = candles.slice(-10);
    const volatilities = recentCandles.map(candle => 
      (candle.high - candle.low) / candle.close
    );
    
    const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / 10;
    
    log('VolatilityAnalysis', `Average volatility: ${(avgVolatility * 100).toFixed(2)}%`, { avgVolatility }, true);
    
    if (avgVolatility > 0.05) {
      log('VolatilityAnalysis', 'High volatility', { avgVolatility }, true);
    } else if (avgVolatility < 0.02) {
      log('VolatilityAnalysis', 'Low volatility', { avgVolatility }, true);
    }
  }
}
```

#### Support and Resistance

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Get buffer through global service
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1d',
      preloadCandlesCount: 100
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 50) return;

    // Find support and resistance levels
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    
    const resistance = Math.max(...highs.slice(-20));
    const support = Math.min(...lows.slice(-20));
    
    const currentPrice = this.buffer.close();
    
    log('SupportResistance', `Support: ${support}, Resistance: ${resistance}`, { support, resistance, currentPrice }, true);
    
    if (currentPrice > resistance * 0.99) {
      log('SupportResistance', 'Resistance breakout', { currentPrice, resistance }, true);
    } else if (currentPrice < support * 1.01) {
      log('SupportResistance', 'Support breakout', { currentPrice, support }, true);
    }
  }
}
```

### Performance Optimization

#### Buffer Size Management

```typescript
// For long-term analysis use large buffers
const longTermBuffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1d',
  preloadCandlesCount: 1000,
  maxBufferLength: 2000
});

// For short-term analysis - smaller buffers
const shortTermBuffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1m',
  preloadCandlesCount: 100,
  maxBufferLength: 500
});
```

#### Automatic Buffer Caching

```typescript
class Script extends BaseScript {
  private hourlyBuffer: CandlesBuffer;
  private dailyBuffer: CandlesBuffer;

  async onInit() {
    // Buffers are automatically cached through global service
    // On repeated request with same parameters, existing buffer is returned
    this.hourlyBuffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h'
    });
    
    this.dailyBuffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1d'
    });
  }
}
```

## Integration with Other Components

### BaseScript + CandlesBuffer

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Get buffer through global service
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: getArgString('timeframe', '1h'),
      preloadCandlesCount: getArgNumber('candlesCount', 250)
    });
  }

  async onTick() {
    // Market data analysis
    const trend = this.analyzeTrend();
    const volatility = this.calculateVolatility();
    
    // Trading decisions based on analysis
    if (trend === 'bullish' && volatility < 0.03) {
      // Buy logic
    }
  }
}
```

### OrdersBasket + Market Data

```typescript
class Script extends BaseScript {
  private basket: OrdersBasket;
  private buffer: CandlesBuffer;

  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    // Get buffer through global service
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h'
    });
  }

  async onTick() {
    const currentPrice = this.basket.close();
    const bufferPrice = this.buffer.close();
    
    // Compare data from different sources
    if (Math.abs(currentPrice - bufferPrice) > currentPrice * 0.001) {
      warning('PriceValidation', 'Price discrepancy between sources', { currentPrice, bufferPrice, difference: Math.abs(currentPrice - bufferPrice) });
    }
  }
}
```

## Next Steps

- **[Trading Scripts](/docs/jt-lib/trading-scripts)** - Base class for trading scripts
- **[Exchange Operations](/docs/jt-lib/exchange-orders-basket)** - OrdersBasket for trading operations
- **[Event System](/docs/jt-lib/events-system)** - EventEmitter for event management