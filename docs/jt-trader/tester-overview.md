---
id: tester-overview
title: Tester
sidebar_label: Tester
---

# Tester

![Tester](/images/3-Tester.png)

### **How It Works?**

The Strategy Tester is a comprehensive tool that allows developers to test algorithmic trading strategies using historical price data. This tool provides a unique opportunity to analyze algorithm effectiveness in various market conditions without the risk of real financial losses, simulating real trading environments.

However, it's important to note that results obtained during testing do not guarantee similar success in live trading, as market conditions can vary significantly.


Here's a beautifully formatted version with icons and steps:

### 🆕 **Starting Testing:**
1. Click the **New Scenario** button to create a new testing scenario.
2. In the **New Scenario** window, set the necessary parameters for the test.
3. Save the settings so the scenario becomes ready to run.

![Tester-New-Scenario](/images/4-Tester-New-Scenario.png)

4. Click the **Run** button to start the test.

![Tester-Run](/images/4-1-Tester-Run.png)

5. After the test completes, click the **Full Report** button to view the complete testing results.

![Tester-Report](/images/4-2-Tester-Report.png)

6. If you want to change parameters and run the test again, click the **"Gear"** icon.

![Tester-Update](/images/4-3-Tester-Update.png)

7. In the window that opens, you can adjust existing parameters or add new ones.
   After making changes, click the **Update** button — the settings will be saved, and you can run the test again.

![Tester-UpdateSave](/images/4-3-Tester-UpdateS.png)

#### **Tester Parameters:**

* **Symbols:** List of trading pairs for testing.
* **Spread:** Difference between buy and sell prices.
* **Start Date:** Test start date.
* **End Date:** Test end date.
* **Maker Fee:** Commission for market orders.
* **Taker Fee:** Commission for limit orders.
* **Leverage:** Maximum leverage.
* **Balance:** Initial balance.
* **Exchange:** Exchange selection.

### **Strategy Parameters**

Parameters passed to the script.

For example, a trading bot might accept the following parameters:

* **`sizeUsd` (100 USD):** trade size.
* **`tpPercent` (2%):** percentage for setting Take-Profit.
* **`slPercent` (1%):** percentage for setting Stop-Loss.

Thus, the robot will open trades for $100, set Take-Profit at 2% and Stop-Loss at 1% of the opening price. If you change **`sizeUsd`** to 200 USD, the robot will open trades for $200.

### **Strategy Optimization**

Optimization is the process of tuning algorithm parameters to improve results. This includes:

* Selecting parameters for optimization.
* Setting parameter value ranges.
* Running the optimization process.
* Analyzing results to improve trading efficiency and profitability.

### **🔥 Multi-Currency Testing**

The **Symbols** parameter can accept a list of symbols, allowing simultaneous testing of multi-pair strategies. After testing completes for all pairs, results for each pair will be compiled into a single comprehensive report. This allows generating a report for a multi-pair robot.



