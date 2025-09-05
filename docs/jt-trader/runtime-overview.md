---
id: runtime-overview
title: Runtime
sidebar_label: Runtime
---

# Runtime

![Runtime](/images/1-Runtime.png)

The Runtime tab is the central component of JT-Trader, providing complete control over the lifecycle of trading strategies. This module allows users to create, run, monitor, and manage trading bots in real-time.

### Runtime Purpose

Runtime serves as a bridge between developed trading strategies and their execution on real markets. The module provides strategy isolation, resource management, and safe execution of trading operations with full control over the process.


### Launching a Bot (Script)

1. Click **Create Runtime** – a window for creating a runtime environment will open.

![Create-Runtime](/images/2-Create-Runtime.png)

2. In the **Create Runtime** window that appears, set the bot parameters. After entering the settings, click **Save**.
3. Now launch the bot by clicking the **Run** button.
4. To view the bot's performance results, click the **Report** button – a trading report will open.

![Runtime-Report](/images/1-1-Runtime-Report.png)

5. If you want to change the bot parameters and run it again, click the **"Gear"** icon.
6. In the window that opens, you can adjust existing parameters or add new ones.
   After making changes, click the **Update** button — the settings will be saved, and you can run the bot again.

![Runtime-Report](/images/1-2-Runtime-Update.png)

### Control Buttons

- **Create Runtime:** Create a bot.
	
- **Start/Stop:** Start or stop the script.
    
- **Report:** Generate a report on script performance.
    
- **Logs:** View operation logs.
    
- **Edit:** Change runtime settings.
    
- **Copy:** Copy the script.
    
- **Delete:** Delete the script.


### **Required Parameters**

* `Name`: Name of the test scenario.
* `Prefix`: Prefix used for generating clientOrderId. Scripts with market launch type will only receive orders created with this prefix.
* `Strategy`: Trading script file. The Strategy class is described inside the file.
* `Exchange`: Exchange where the strategy will be launched.
* `type` - market or system.
  * If the launch type is market, the script will be launched for only one symbol.
  * If system, the script will not have trading functions but will be able to receive notifications about all orders onOrderChange.

### Parameters

These are additional parameters passed to the script, defined by script developers. If you purchased a script from the store, refer to your robot's description for detailed information.

Most often, one of the required parameters is "symbols" or "coins", which represents a list of trading pairs that the robot will work with.

### Script List

* **ID:** Unique script identifier.
* **Prefix** - runtime prefix.
* **Name:** Runtime configuration name.
* **Script**: Script file name.
* **Script Type:** Script type.
  * **Local:** Script compiled on the server from source code.
  * **Remote (bundle):** Script from database. See Developer -> [Bundles](../../jt-lab-dashboard/developer-zone#bundles).
  * **Remote (app):** Script purchased from the store. See User -> [Bots](../../jt-lab-dashboard/user-zone#bots).
* **Exchange:** Exchange where the script is running.
* **Updated:** Date of last script update.
* **Status:** Current script status.
  * **Running:** Script is active.
  * **Stopped:** Script is not running.


:::info Logs

Logs are divided into two parts: main logs are displayed in the logs window on the Runtime tab. More detailed logs can be viewed in the Logs table in the report.

:::
