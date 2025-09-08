---
id: introduction-architecture
title: Introduction and Architecture
sidebar_label: Introduction and Architecture
---

# JT-LIB Introduction and Architecture

## What is JT-LIB?

**JT-LIB** is a TypeScript library specifically designed for creating trading robots for the JT-Trader platform. It provides a simplified interface for interacting with exchanges and implementing trading strategies.

### Key Features

- **Trading Operations**: Buying, selling, placing orders
- **Market Work**: Getting price data, volumes, order book
- **Event Management**: Real-time reaction to market changes
- **Data Storage**: Saving state and operation history
- **Triggers**: Automatic execution of actions based on conditions
- **Reporting**: Detailed analytics of trading operations
- **Technical Indicators**: Built-in indicators for analysis
- **Candle Management**: Buffering and processing of candle data

## System Architecture

After studying the source code, JT-LIB has the following architecture:

### 1. System Core (Core)
- **BaseObject** (`src/lib/core/base-object.ts`) - Base class for all library objects
  - Unique object identification
  - Lifecycle management (creation, destruction)
  - Child object system
  - Error handling and logging
  
- **BaseScript** (`src/lib/script/base-script.ts`) - Base class for trading scripts
  - Symbol and connection management
  - Tick and timer handling
  - Order and position management
  - Integration with global services

- **Globals** (`src/lib/core/globals.ts`) - Global application state
  - Centralized object management
  - Access to main services
  - Trading permission management
  - User data and parameters

### 2. Event System (Events)
- **EventEmitter** (`src/lib/events/event-emitter.ts`) - Event system
- **TriggerService** (`src/lib/events/triggers/`) - Trigger service
- **Types** (`src/lib/events/types.ts`) - Event types

### 3. Trading Components
- **OrdersBasket** (`src/lib/exchange/orders-basket.ts`) - Main class for exchange operations
  - Creating and managing orders (market, limit)
  - Automatic Stop Loss and Take Profit creation
  - Position management (long/short)
  - P&L and commission calculation
  - Hedge mode support
  - Integration with trigger system
- **Exchange Types** (`src/lib/exchange/types.ts`) - Types for exchange operations
- **Exchange Helpers** (`src/lib/exchange/heplers.ts`) - Helper functions
- **Candles** (`src/lib/candles/`) - Candle data management
- **Indicators** (`src/lib/indicators/`) - Technical indicators

### 4. Helper Services
- **Storage** (`src/lib/core/storage.ts`) - Data storage and management
- **Report** (`src/lib/report/`) - Report generation
- **Utils** (`src/lib/utils/`) - Utilities (date/time, numbers)

### 5. Interfaces
- **Candle** (`src/lib/interfaces/candle.interface.ts`) - Candle interface
- **Order** (`src/lib/interfaces/order.interface.ts`) - Order interface
- **Position** (`src/lib/interfaces/position.interface.ts`) - Position interface
- **Tick** (`src/lib/interfaces/tick.interface.ts`) - Tick interface
- **Symbol** (`src/lib/interfaces/symbol.interface.ts`) - Symbol interface


## Installation and Setup


JT-LIB is part of the JT-Trader platform and is installed together with it. To work with the library, you need to install JT-Trader.

> 📖 **Installation Guide**: [JT-Trader Installation](/docs/installation)

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
│       │   ├── log.ts              # Logging system
│       │   └── errors.ts           # Error handling
│       ├── events/                  # Event system
│       │   ├── event-emitter.ts    # Event emitter
│       │   └── triggers/           # Triggers
│       ├── exchange/                # Exchange operations
│       ├── candles/                 # Candle management
│       ├── indicators/              # Technical indicators
│       ├── report/                  # Reporting
│       ├── script/                  # Trading scripts
│       ├── utils/                   # Utilities
│       └── interfaces/              # TypeScript interfaces
```

