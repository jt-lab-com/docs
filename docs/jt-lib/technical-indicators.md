---
id: technical-indicators
title: Technical Indicators (Indicators)
sidebar_label: Technical Indicators
---

# Technical Indicators (Indicators)

**Indicators** is a system of technical indicators for market data analysis. JT-LIB provides built-in indicators and the ability to create custom ones.

## Indicator Architecture

### BaseIndicator - Base Class

All indicators inherit from `BaseIndicator`, which provides:

- **CandlesBuffer Integration** — automatic candlestick data retrieval
- **Result Buffering** — caching of computed values
- **Performance Optimization** — recalculation of only new data
- **Lifecycle Management** — automatic resource cleanup

### Main Methods

```typescript
class BaseIndicator {
  // Get last value
  getValue(shift = 0): number;
  
  // Get all values
  getIndicatorValues(): BufferIndicatorItem[];
  
  // Clear buffer
  clear(): void;
  
  // Indicator information
  getInfo(): IndicatorInfo;
}
```

## Built-in Indicators

### 1. RSI (Relative Strength Index)

**RSI** — relative strength indicator, shows market overbought/oversold conditions.

```typescript
// Create RSI indicator
const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);

// Get current value
const currentRsi = rsi.getValue();

// Get value with offset
const previousRsi = rsi.getValue(1);

// Get all values
const allValues = rsi.getIndicatorValues();
```

**Parameters:**
- `symbol` — trading symbol
- `timeframe` — timeframe ('1m', '5m', '1h', '1d', etc.)
- `period` — calculation period (default 14)

**Interpretation:**
- **RSI > 70** — overbought (sell signal)
- **RSI < 30** — oversold (buy signal)

### 2. SMA (Simple Moving Average)

**SMA** — simple moving average, smooths price fluctuations.

```typescript
// Create SMA indicator
const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);

// Get current value
const currentSma = sma.getValue();

// Compare price with SMA
const currentPrice = this.basket.close();
if (currentPrice > currentSma) {
  log('Strategy', 'Price above SMA - uptrend', { currentPrice, smaValue: currentSma }, true);
}
```

**Parameters:**
- `symbol` — trading symbol
- `timeframe` — timeframe
- `period` — calculation period (default 14)

### 3. ATR (Average True Range)

**ATR** — average true range, shows market volatility.

```typescript
// Create ATR indicator
const atr = await globals.indicators.atr('BTC/USDT', '1h', 14);

// Get current volatility
const currentAtr = atr.getValue();

// Use ATR for stop-loss calculation
const stopLossDistance = currentAtr * 2; // 2 ATR
const stopLoss = currentPrice - stopLossDistance;
```

**Parameters:**
- `symbol` — trading symbol
- `timeframe` — timeframe
- `period` — calculation period (default 14)

## Usage in Trading Strategies

### Example: RSI Strategy

```typescript
class Script extends BaseScript {
  private rsi: RelativeStrengthIndex;
  private sma: SimpleMovingAverageIndicator;
  private isPositionOpened = false;

  async onInit() {
    // Create indicators
    this.rsi = await globals.indicators.rsi(this.symbols[0], '1h', 14);
    this.sma = await globals.indicators.sma(this.symbols[0], '1h', 20);
  }

  async onTick() {
    if (this.isPositionOpened) return;

    const currentPrice = this.basket.close();
    const rsiValue = this.rsi.getValue();
    const smaValue = this.sma.getValue();

    // Buy signal
    if (rsiValue < 30 && currentPrice > smaValue) {
      const amount = this.basket.getContractsAmount(100);
      await this.basket.buyMarket(amount);
      this.isPositionOpened = true;
    }

    // Sell signal
    if (rsiValue > 70 && currentPrice < smaValue) {
      const amount = this.basket.getContractsAmount(100);
      await this.basket.sellMarket(amount);
      this.isPositionOpened = true;
    }
  }

  async onOrderChange(order: Order) {
    if (order.status === 'closed') {
      this.isPositionOpened = false;
    }
  }
}
```

### Example: Multi-Timeframe Analysis

```typescript
class Script extends BaseScript {
  private rsi1h: RelativeStrengthIndex;
  private rsi4h: RelativeStrengthIndex;
  private sma1h: SimpleMovingAverageIndicator;
  private sma4h: SimpleMovingAverageIndicator;

  async onInit() {
    const symbol = this.symbols[0];
    
    // Indicators on different timeframes
    this.rsi1h = await globals.indicators.rsi(symbol, '1h', 14);
    this.rsi4h = await globals.indicators.rsi(symbol, '4h', 14);
    this.sma1h = await globals.indicators.sma(symbol, '1h', 20);
    this.sma4h = await globals.indicators.sma(symbol, '4h', 20);
  }

  async onTick() {
    // Trend analysis on higher timeframe
    const trend4h = this.getTrend4h();
    
    // Entry analysis on lower timeframe
    const entry1h = this.getEntry1h();

    if (trend4h === 'bullish' && entry1h === 'buy') {
      // Buy in trend direction
      const amount = this.basket.getContractsAmount(100);
      await this.basket.buyMarket(amount);
    }
  }

  private getTrend4h(): 'bullish' | 'bearish' | 'neutral' {
    const price = this.basket.close();
    const sma4hValue = this.sma4h.getValue();
    
    if (price > sma4hValue) return 'bullish';
    if (price < sma4hValue) return 'bearish';
    return 'neutral';
  }

  private getEntry1h(): 'buy' | 'sell' | 'hold' {
    const rsi1hValue = this.rsi1h.getValue();
    
    if (rsi1hValue < 30) return 'buy';
    if (rsi1hValue > 70) return 'sell';
    return 'hold';
  }
}
```

## System Integration

### Access through globals

```typescript
// Automatically available in BaseScript
class Script extends BaseScript {
  async onInit() {
    // Create indicators
    const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);
    const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);
  }
}
```

Technical indicators in JT-LIB provide powerful tools for market analysis and creating complex trading strategies. Proper use of built-in indicators is critical for successful trading.