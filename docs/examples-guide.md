---
id: examples-guide
title: JT-Lib Examples
sidebar_label: Examples Guide
---

# JT-Lib Examples

Examples of using the jt-lib library with descriptions of functionality and used classes.

## List of Examples

### Gainers & Losers Example

**File:** [Gainers-Losers-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Gainers-Losers-Example.ts)

**Description:** Scans USDT-swap markets and finds symbols with strong daily movements (>30%).

**Used Classes:**
- [BaseScript](jt-lib/trading-scripts.md) - base class for trading scripts
- [StandardReportLayout](jt-lib/reporting-system.md) - reporting system
- [BaseError](jt-lib/core-fundamentals.md) - error handling

**Functionality:**
- Historical candle data analysis
- Price movement percentage calculation
- Creating report tables with results

### Grid Bot Example

**File:** [GridBot-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/GridBot-Example.ts)

**Description:** Multi-currency grid strategy with automatic position management.

**Used Classes:**
- [BaseScript](jt-lib/trading-scripts.md) - base class for trading scripts
- [OrdersBasket](jt-lib/exchange-orders-basket.md) - order management
- [TriggersSystem](jt-lib/triggers-system.md) - automation system
- [StandardReportLayout](jt-lib/reporting-system.md) - reporting system

**Functionality:**
- Multi-currency grid trading
- Automatic position management
- Risk management
- Real-time monitoring

### Trading API Example

**File:** [Trading-Api-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Trading-Api-Example.ts)

**Description:** Interactive example demonstrating all trading API capabilities.

**Used Classes:**
- [BaseScript](jt-lib/trading-scripts.md) - base class for trading scripts
- [OrdersBasket](jt-lib/exchange-orders-basket.md) - order management
- [StandardReportLayout](jt-lib/reporting-system.md) - reporting system

**Functionality:**
- Interactive API demonstration
- Market data retrieval
- Order creation and management
- Account information display

### DCA Strategy Example

**File:** [DCA-Strategy-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/DCA-Strategy-Example.ts)

**Description:** Dollar Cost Averaging strategy with periodic purchases.

**Used Classes:**
- [BaseScript](jt-lib/trading-scripts.md) - base class for trading scripts
- [OrdersBasket](jt-lib/exchange-orders-basket.md) - order management
- [TriggersSystem](jt-lib/triggers-system.md) - automation system

**Functionality:**
- Periodic automatic purchases
- Risk management
- Position tracking
- Performance monitoring

## How to Use Examples

### Running Examples in Runtime

1. Open JT-Trader web interface
2. Go to Runtime section
3. Click "Create Runtime"
4. Select the desired example from the strategy list
5. Configure parameters
6. Start the script

### Running Examples in Tester

1. Go to Tester section
2. Click "Create New Scenario"
3. Select the example strategy
4. Set testing parameters
5. Run backtest

### Modifying Examples

All examples can be modified to suit your needs:

1. Copy the example code
2. Modify parameters and logic
3. Test in Tester mode
4. Deploy in Runtime mode

## Best Practices

### Code Organization

- Use meaningful variable names
- Add comments to complex logic
- Follow TypeScript best practices
- Use proper error handling

### Testing

- Always test strategies in Tester mode first
- Use small amounts for initial testing
- Monitor performance metrics
- Keep detailed logs

### Risk Management

- Set appropriate position sizes
- Use stop-loss orders
- Monitor drawdown
- Diversify strategies

## Next Steps

After studying the examples:

1. **[JT-LIB Documentation](/docs/jt-lib/introduction-architecture)** - Learn the library architecture
2. **[Creating Strategies](/docs/jt-lib/trading-scripts)** - Start developing your own strategies
3. **[Testing](/docs/jt-trader/tester-overview)** - Learn advanced testing techniques
4. **[Deployment](/docs/jt-trader/runtime-overview)** - Deploy strategies in production

## Support

For questions about examples:

- Check the [JT-LIB documentation](/docs/jt-lib/)
- Review the [GitHub repository](https://github.com/jt-lab-com/jt-lib)
- Join the community discussions
- Contact support team
