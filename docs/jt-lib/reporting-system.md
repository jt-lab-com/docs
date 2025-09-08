---
id: reporting-system
title: Reporting System
sidebar_label: Reporting System
---

# Reporting System

The JT-Lib reporting system provides powerful tools for creating, displaying, and analyzing trading strategy results. Reports are displayed in the web interface and allow data visualization in various formats.

## System Overview

The reporting system includes:

- **Widgets** - various types of data display (cards, tables, charts, text)
- **Statistics** - automatic analysis of trading results
- **Data Export** - saving results in various formats
- **Interactivity** - action buttons for real-time strategy management

### Basic Operating Principles

- For the tester, the report should be updated in the `onStop()` function after script completion
- For live trading, the report can be updated at time intervals (recommended no more than every 5 seconds)
- All logs are automatically added to the report by default

## Available Objects and Quick Start

### Global Report Object

The reporting system provides a ready-to-use global object `globals.report`, which is automatically initialized when starting a trading script. All widgets are created automatically on first access to the corresponding methods.

### Quick Start

The reporting system is ready to use immediately after starting a trading script. Below are examples of typical usage:

```typescript
// Report setup
globals.report.setTitle('Grid Bot Example');
globals.report.setDescription('Multi-coin grid strategy example. Strategy logic is based in the GridBasket class.');

// Update cards (widgets are created automatically)
globals.report.cardSetValue('currentPrice', 50000);
globals.report.cardSetValue('profit', 1500, 'max');
globals.report.cardSetValue('totalOrders', 25);

// Update tables (widgets are created automatically)
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed'
});

// Add data to charts (widgets are created automatically)
globals.report.chartAddPointAgg('profit', 'profit', 1500, 'max');
globals.report.chartAddPoint('balance', 'balance', Date.now(), 10000);

// Update report
await globals.report.updateReport();
```

> **Important**: No need to create widget instances manually. All widgets are created automatically on first call to the corresponding methods.

## Main Reporting System Functions

### cardSetValue

The `cardSetValue` function automatically creates a card with the specified name and sets its value. The card is created on first call to the function if it doesn't exist yet.

**Syntax:**
```typescript
globals.report.cardSetValue(name: string, value: number|string, aggType?: AggType)
```

**Parameters:**
- `name` - unique card name
- `value` - value to display (number or string)
- `aggType` - aggregation type (optional): 'last', 'min', 'max', 'sum', 'avg'

**How it works:**
1. If a card with the specified name doesn't exist, a new card with `Number` type is created by default
2. Value is set according to the aggregation type
3. On subsequent calls, the value is updated with aggregation applied

**Usage examples:**
```typescript
// Simple value update
globals.report.cardSetValue('currentPrice', 50000);

// Update with aggregation - maximum value
globals.report.cardSetValue('maxProfit', 2000, 'max');

// Update with aggregation - sum
globals.report.cardSetValue('totalVolume', 1000, 'sum');
```

### tableUpdate

The `tableUpdate` function automatically creates a table with the specified name and updates it with data. The table is created on first call to the function if it doesn't exist yet.

**Syntax:**
```typescript
globals.report.tableUpdate(name: string, data: TableRow|TableRow[])
```

**Parameters:**
- `name` - unique table name
- `data` - object with row data or array of objects for bulk update

**How it works:**
1. If a table with the specified name doesn't exist, a new table is created
2. If an object with an `id` field is passed, the system tries to update an existing record
3. If a record with the specified `id` is not found, a new record is created
4. If an array of objects is passed, bulk update is performed
5. Old records are automatically removed when row limit is exceeded (300 by default)

**Usage examples:**
```typescript
// Add new record
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'open'
});

// Update existing record
globals.report.tableUpdate('orders', {
  id: 1,
  status: 'closed',
  profit: 500
});

// Bulk update
globals.report.tableUpdate('orders', [
  { id: 1, symbol: 'BTC/USDT', side: 'buy', amount: 0.1, price: 50000 },
  { id: 2, symbol: 'ETH/USDT', side: 'sell', amount: 1.0, price: 3000 }
]);
```

### chartAddPointAgg

The `chartAddPointAgg` function automatically creates a chart with the specified name and adds a data point with aggregation. The chart is created on first call to the function if it doesn't exist yet.

**Syntax:**
```typescript
globals.report.chartAddPointAgg(name: string, lineName: string, value: number, aggType: AggType)
```

**Parameters:**
- `name` - unique chart name
- `lineName` - line name on the chart
- `value` - value to add
- `aggType` - aggregation type: 'last', 'min', 'max', 'sum', 'avg'

**How it works:**
1. If a chart with the specified name doesn't exist, a new `Line` type chart is created
2. If a line with the specified name doesn't exist, a new line is created
3. Value is added with the specified aggregation applied
4. Old points are automatically removed when limit is exceeded (5000 by default)
5. Data is aggregated by time periods (1 day by default)

**Usage examples:**
```typescript
// Add point with maximum value
globals.report.chartAddPointAgg('profitChart', 'profit', 1500, 'max');

// Add point with minimum value
globals.report.chartAddPointAgg('drawdownChart', 'drawdown', -200, 'min');

// Add point with average value
globals.report.chartAddPointAgg('balanceChart', 'balance', 10000, 'avg');
```

### chartAddPoint

The `chartAddPoint` function automatically creates a chart with the specified name and adds a data point with exact X and Y coordinates. The chart is created on first call to the function if it doesn't exist yet.

**Syntax:**
```typescript
globals.report.chartAddPoint(name: string, lineName: string, valueX: number, valueY: number)
```

**Parameters:**
- `name` - unique chart name
- `lineName` - line name on the chart
- `valueX` - X coordinate (usually time in milliseconds)
- `valueY` - Y coordinate (value to display)

**How it works:**
1. If a chart with the specified name doesn't exist, a new `Line` type chart is created
2. If a line with the specified name doesn't exist, a new line is created
3. Point is added with exact coordinates without aggregation
4. Old points are automatically removed when limit is exceeded (5000 by default)
5. Data is displayed in original form without time aggregation

**Usage examples:**
```typescript
// Add point with current time
globals.report.chartAddPoint('balanceChart', 'balance', Date.now(), 10000);

// Add point with specific time
const timestamp = new Date('2024-01-01T12:00:00Z').getTime();
globals.report.chartAddPoint('priceChart', 'price', timestamp, 50000);

// Add point with custom X coordinate
globals.report.chartAddPoint('customChart', 'data', 100, 250);
```

### Widgets

#### 1. Cards
```typescript
// Automatic creation and value updates
globals.report.cardSetValue(name: string, value: number|string, aggType?: AggType)

// Manual creation (optional)
globals.report.createCard(name: string, options: CardOptions)
globals.report.addCard(name: string, card: ReportCard)

// Get existing widget
globals.report.getCardByName(name: string): ReportCard
```

#### 2. Tables
```typescript
// Automatic creation and data updates
globals.report.tableUpdate(name: string, data: TableRow|TableRow[])

// Manual creation (optional)
globals.report.createTable(name: string, title: string)
globals.report.addTable(name: string, table: ReportTable)

// Get existing widget
globals.report.getTableByName(name: string): ReportTable
```

#### 3. Charts
```typescript
// Automatic creation and data addition
globals.report.chartAddPointAgg(name: string, lineName: string, value: number, aggType: AggType)
globals.report.chartAddPointAggByDate(name: string, lineName: string, value: number, aggType: AggType)
globals.report.chartAddPoint(name: string, lineName: string, valueX: number, valueY: number)

// Manual creation (optional)
globals.report.createChart(name: string, options: ChartOptions)
globals.report.addChart(name: string, chart: ReportChart)

// Get existing widget
globals.report.getChartByName(name: string): ReportChart
```

#### 4. Text Blocks
```typescript
// Automatic creation
globals.report.createText(name: string, text: string, variant: string, align: string)

// Manual creation (optional)
globals.report.addText(name: string, text: ReportText)

// Get existing widget
globals.report.getTextByName(name: string): ReportText
```

#### 5. Action Buttons
```typescript
// Automatic creation
globals.report.createActionButton(title: string, action: string, value: string, callback?: Function, layoutIndex?: number)

// Manual creation (optional)
globals.report.addActionButton(name: string, button: ReportActionButton)

// Get existing widget
globals.report.getActionButtonByName(name: string): ReportActionButton
```

### Data Types

#### AggType (Aggregation Types)
```typescript
type AggType = 'last' | 'min' | 'max' | 'sum' | 'avg'
```

#### CardVariant (Card Types)
```typescript
enum CardVariant {
  Text = 'text',      // Text values
  Number = 'number',  // Numeric values
  Percent = 'percent' // Percentage values
}
```

#### ChartType (Chart Types)
```typescript
enum ChartType {
  Line = 'line',  // Line chart
  Area = 'area'   // Area chart
}
```

## Detailed Widget Description

### 1. Cards

Cards display individual variable values in a convenient format.

#### Creating a Card

```typescript
// Recommended way - automatic creation when updating value
globals.report.cardSetValue('profit', 1500, 'max');

// Manual creation with settings (if customization is required)
globals.report.createCard('profit', {
  title: 'Profit',
  variant: CardVariant.Number,
  options: {
    format: CardNumberFormat.Currency,
    currency: 'USD',
    icon: 'chart-up'
  }
});

// Create ReportCard instance (for advanced usage)
const profitCard = new ReportCard({
  title: 'Profit',
  variant: CardVariant.Number,
  options: {
    format: CardNumberFormat.Currency,
    currency: 'USD'
  }
});

globals.report.addCard('profit', profitCard);
```

#### Card Types

- **Text** - text values
- **Number** - numeric values  
- **Percent** - percentage values

#### Display Formats

- **Default** - standard display
- **Currency** - currency format
- **Date** - date format
- **Short** - short format

#### Data Aggregation

```typescript
// Last value
globals.report.cardSetValue('profit', 1500, 'last');

// Maximum value
globals.report.cardSetValue('maxProfit', 2000, 'max');

// Minimum value
globals.report.cardSetValue('minProfit', -500, 'min');

// Sum
globals.report.cardSetValue('totalVolume', 10000, 'sum');

// Average value
globals.report.cardSetValue('avgProfit', 150, 'avg');
```

#### Card Options

```typescript
interface CardOptions {
  format?: CardNumberFormat;  // Display format
  currency?: string;          // Currency
  icon?: string;             // Icon
  caption?: string;          // Caption
  isVisible?: boolean;       // Visibility
}
```

### 2. Tables

Tables display structured data in rows and columns.

#### Creating a Table

```typescript
// Recommended way - automatic creation when updating data
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed'
});

// Manual creation with title (if customization is required)
globals.report.createTable('orders', 'Order History');

// Create ReportTable instance (for advanced usage)
const ordersTable = new ReportTable('Order History');
globals.report.addTable('orders', ordersTable);
```

#### Working with Data

```typescript
// Add record
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed',
  profit: 500
});

// Update record
globals.report.tableUpdate('orders', {
  id: 1,
  status: 'closed',
  profit: 750
});

// Bulk update
const orders = [
  { id: 1, symbol: 'BTC/USDT', side: 'buy', amount: 0.1, price: 50000 },
  { id: 2, symbol: 'ETH/USDT', side: 'sell', amount: 1.0, price: 3000 }
];
globals.report.tableUpdate('orders', orders);
```

#### ReportTable Methods

```typescript
const table = globals.report.getTableByName('orders');

// Insert record
table.insert(row: TableRow, idField?: string): boolean

// Update record
table.update(row: TableRow, idField?: string): boolean

// Insert or update
table.upsert(row: TableRow, idField?: string): boolean

// Bulk operations
table.insertRecords(rows: TableRow[], idField?: string)
table.updateRecords(rows: TableRow[], idField?: string)
table.upsertRecords(rows: TableRow[], idField?: string)

// Clear table
table.clear(): boolean

// Set row limit
table.setMaxRows(maxRows: number)
```

#### Table Limitations

- Maximum 300 rows by default (configurable)
- Automatic removal of old records when limit is exceeded

### 3. Charts

Charts visualize data as lines or areas.

#### Creating a Chart

```typescript
// Recommended way - automatic creation when adding data
globals.report.chartAddPointAgg('profitChart', 'profit', 1500, 'max');

// Manual creation with settings (if customization is required)
globals.report.createChart('profitChart', {
  chartType: ChartType.Line,
  maxPoints: 1000,
  aggPeriod: 3600000 // 1 hour
});

// Create ReportChart instance (for advanced usage)
const profitChart = new ReportChart('Profit Chart', {
  chartType: ChartType.Area,
  maxPoints: 5000
});
globals.report.addChart('profitChart', profitChart);
```

#### Chart Types

- **Line** - line chart
- **Area** - area chart

#### Adding Data

```typescript
// Add point with aggregation
globals.report.chartAddPointAgg('profitChart', 'profit', 1500, 'max');

// Add point by date
globals.report.chartAddPointAggByDate('profitChart', 'profit', 1500, 'max');

// Configure lines
const chart = globals.report.getChartByName('profitChart');
chart.setLineInfo('profit', 'max', '#3F51B5');
chart.setLineInfo('drawdown', 'min', '#FD6A6A');
```

#### ReportChart Methods

```typescript
const chart = globals.report.getChartByName('profitChart');

// Configure lines
chart.setLineInfo(name: string, aggType: AggType, color?: string)

// Add points
chart.addPoint(lineName: string, valueX: number, valueY: number, color?: string)
chart.addPointByDate(lineName: string, valueY: number, color?: string)
chart.addPointAggByDate(lineName: string, value: number, aggType: AggType, color?: string)

// Get data
chart.getLine(name: string): number[]
chart.getLength(): number

// Clear
chart.clear()

// Configure aggregation
chart.setAggPeriodByDates(start: number, end: number, dotCount: number)
```

#### Chart Data Aggregation

- **last** - last value
- **max** - maximum value
- **min** - minimum value
- **sum** - sum of values
- **avg** - average value

#### Chart Options

```typescript
interface ReportChartOptions {
  maxPoints?: number;    // Maximum points (default 5000)
  aggPeriod?: number;    // Aggregation period in ms (default 1 day)
  chartType?: ChartType; // Chart type
  layoutIndex?: number;  // Layout index
}
```

### 4. Text Blocks

Text blocks display arbitrary text in the report.

#### Creating a Text Block

```typescript
// Recommended way - direct creation
globals.report.createText('summary', 'Strategy Summary', 'subtitle1', 'center');

// Create ReportText instance (for advanced usage)
const summaryText = new ReportText('Strategy Summary', 'subtitle1', 'center');
globals.report.addText('summary', summaryText);
```

#### Display Variants

- **h1, h2, h3** - different level headings
- **subtitle1, subtitle2** - subtitles
- **body1, body2** - main text
- **caption** - small text

#### Alignment

- **left** - left aligned
- **center** - center aligned
- **right** - right aligned

#### Text Options

```typescript
interface TextOptions {
  variant?: string;  // Display variant
  align?: string;    // Alignment
  isVisible?: boolean; // Visibility
}
```

### 5. Action Buttons

Action buttons allow sending commands to the running runtime.

#### Creating an Action Button

```typescript
// Recommended way - direct creation
globals.report.createActionButton('Close Position', 'closePosition', 'BTC/USDT');

// Create with callback function
globals.report.createActionButton('Start Trading', 'startTrading', '', async (data) => {
  this.isTrading = true;
  await globals.report.updateReport();
});

// Create ReportActionButton instance (for advanced usage)
const closeButton = new ReportActionButton('Close Position', 'closePosition', 'BTC/USDT');
globals.report.addActionButton('closeButton', closeButton);
```

#### Handling Actions

```typescript
async onReportAction(action: string, data: any) {
  switch (action) {
    case 'closePosition':
      await this.closePosition(data);
      break;
    case 'startTrading':
      this.isTrading = true;
      break;
    case 'stopTrading':
      this.isTrading = false;
      break;
  }
  
  await globals.report.updateReport();
}
```

> **Note**: Action buttons are used only for real-time robots, not for the tester.

## Statistics and Analysis

### Automatic Statistics

The system automatically collects statistics on trading operations:

```typescript
class Statistics extends BaseObject {
  ordersOpenedCnt = 0;      // Number of opened orders
  ordersClosedCnt = 0;      // Number of closed orders
  ordersCanceledCnt = 0;    // Number of canceled orders
  ordersModifiedCnt = 0;    // Number of modified orders
  ordersTotalCnt = 0;       // Total number of orders
  volume = 0;               // Total trading volume
  profit = 0;               // Total profit
  bestTrade = 0;            // Best trade
  worstTrade = 0;           // Worst trade
}
```

### Creating Report with Statistics

```typescript
  async onStop() {
    // Set values (cards are created automatically)
    globals.report.cardSetValue('totalOrders', this.statistics.ordersTotalCnt);
    globals.report.cardSetValue('profit', this.statistics.profit);
    globals.report.cardSetValue('winRate', this.calculateWinRate());
    
    // Update report
    await globals.report.updateReport();
  }
```

## Data Export

### Report Update

```typescript
// Update report on server
await globals.report.updateReport();

// Force update (ignores frequency limitations)
await globals.report.updateReport({ isForce: true });
```

### Report Data Structure

```typescript
interface ReportData {
  id: string;           // Unique report identifier
  symbol: string;       // Trading symbol
  description?: string; // Report description
  blocks: ReportBlock[]; // Report blocks
}

interface ReportBlock {
  type: ReportBlockType; // Block type
  name?: string;         // Block name
  data: ReportBlockData; // Block data
}
```

### Report Data Access

```typescript
// Get report data
const reportData = globals.report.getReportData();

// Export to JSON
const jsonData = JSON.stringify(reportData, null, 2);
```

## Practical Examples

### Example 1: Basic Trading Strategy Report

```typescript
class Script extends BaseScript {
  async onInit() {
    // Report setup
    globals.report.setTitle('Trading Strategy Report');
    globals.report.setDescription('Automated trading strategy with real-time monitoring');
    
    // Widgets are created automatically on first access
    // No additional actions required
  }
  
  async onTick() {
    // Update cards (widgets are created automatically)
    globals.report.cardSetValue('currentPrice', this.getCurrentPrice());
    globals.report.cardSetValue('position', this.getPositionStatus());
    
    // Add point to chart (widget is created automatically)
    globals.report.chartAddPointAggByDate('profit', 'profit', this.getTotalProfit(), 'max');
    
    // Update report every 5 ticks
    if (this.tickCount % 5 === 0) {
      await globals.report.updateReport();
    }
  }
  
  async onOrderChange(order: Order) {
    // Add order to table (widget is created automatically)
    globals.report.tableUpdate('orders', {
      id: order.id,
      symbol: order.symbol,
      side: order.side,
      amount: order.amount,
      price: order.price,
      status: order.status,
      timestamp: new Date().toISOString()
    });
  }
  
  async onStop() {
    // Final report update
    await globals.report.updateReport();
  }
}
```

### Example 2: Optimization Report

```typescript
class Script extends BaseScript {
  async onStop() {
    // Add optimization parameters
    globals.report.optimizedSetValue('profit', this.totalProfit, 'max');
    globals.report.optimizedSetValue('drawdown', this.maxDrawdown, 'min');
    globals.report.optimizedSetValue('winRate', this.winRate, 'avg');
    globals.report.optimizedSetValue('sharpeRatio', this.sharpeRatio, 'max');
    
    // Create optimization results table
    globals.report.createTable('optimization', 'Optimization Results');
    globals.report.tableUpdate('optimization', {
      parameter: 'RSI Period',
      value: this.rsiPeriod,
      profit: this.totalProfit,
      drawdown: this.maxDrawdown,
      winRate: this.winRate
    });
    
    await globals.report.updateReport();
  }
}
```

### Example 3: Interactive Report

```typescript
class Script extends BaseScript {
  async onInit() {
    // Create control buttons
    globals.report.createActionButton('Start Trading', 'startTrading', '');
    globals.report.createActionButton('Stop Trading', 'stopTrading', '');
    globals.report.createActionButton('Close All Positions', 'closeAll', '');
    
    // Information cards are created automatically when updating values
  }
  
  async onReportAction(action: string, data: any) {
    switch (action) {
      case 'startTrading':
        this.isTrading = true;
        globals.report.cardSetValue('status', 'Trading Active');
        break;
        
      case 'stopTrading':
        this.isTrading = false;
        globals.report.cardSetValue('status', 'Trading Stopped');
        break;
        
      case 'closeAll':
        await this.closeAllPositions();
        globals.report.cardSetValue('status', 'All Positions Closed');
        break;
    }
    
    await globals.report.updateReport();
  }
}
```

## Usage Recommendations

### Performance

1. **Update Frequency**: Don't update report more than every 5 seconds in live trading
2. **Data Limits**: Use reasonable limits for tables and charts
3. **Aggregation**: Use aggregation for large data volumes

### Report Structure

1. **Header**: Always set report title and description
2. **Logical Grouping**: Group related widgets together
3. **Information Priority**: Place most important information at the beginning of the report

### Debugging

1. **Logging**: Use built-in logging for debugging
2. **Data Validation**: Check data correctness before adding to report
3. **Error Handling**: Handle errors when creating and updating widgets

The JT-Lib reporting system provides all necessary tools for creating informative and interactive trading strategy reports, allowing traders to effectively analyze results and make informed decisions.