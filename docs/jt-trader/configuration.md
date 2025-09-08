---
id: configuration
title: Configuration
sidebar_label: Configuration
---

# Configuration
![Configuration](/images/8-Config.png)

On the **Config** page you can:

* Connect API keys from your cryptocurrency exchange.
* **Reboot server** - Restart the server.
* **System logs** - View system logs.

![Configuration](/images/8-1-Config-log.png)

* **Invalidate Cache** - Clear cache (note: cache is used by robots to store data, so be careful when clearing it).

#### **What are API Keys?**

API keys are unique identifiers that allow robots to interact with your exchange account. They consist of two components: **Key** and **Secret**.

**Example:**

```
Key: 9021196fadb94hdsts&92eefa213d2c135fd
Secret: e625d1b1c5f929c15761c22389465490465c5921700677200c10eb699e70fa5
```

Using these keys, robots can: get quotes, execute trading operations (create, cancel, modify orders).

### Security Recommendations

To ensure the security of your funds, follow these recommendations:

1. **Add IP addresses of the server** where your robots are running to the API key whitelist. This limits the use of the key to only specified IP addresses.
2. **Grant only necessary permissions**. Most robots only need trading functions, such as:
   * Spot Trade
   * Perpetual Futures
   * Delivery Futures

:::info Other possible permissions
Wallet, Custody, Withdraw, Option, Subaccount, Commission Details, P2P, Account, Margin Trading, Earn, Pilot.
:::

### **How to connect an exchange to JT-Trader**

1. **Create API keys on your exchange:**
   * Go to the API management section on your exchange.
   * Create a new key.
   * Add your server IP addresses to the whitelist.
   * Select the necessary permissions for the robot.
   * Copy the key and secret key. Save them in a secure place, as the secret key is only displayed once.
2. **Add keys to JT-Trader:**
   * Go to the config page in JT-Trader.
   * Enter the key and secret key in the appropriate fields.
   * Save the settings.

![Configuration-API](/images/9-Config-API.png)

**Your robot is ready to work!**