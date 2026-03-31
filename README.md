# IKEA Watcher

A small Deno-based Discord bot that watches IKEA Germany’s Second Chance Market for new entries matching predefined search terms and sends Discord messages when new offers appear.

It supports searching multiple IKEA stores and keeps track of previously seen offers to avoid duplicate notifications.

## Features

- Watch IKEA Germany’s Second Chance Market
- Search by one or more predefined terms
- Select multiple IKEA stores to monitor
- Send Discord DM notifications for new matching offers
- Persist state locally to prevent duplicate alerts
- Fetch store metadata automatically from IKEA Germany

## Requirements

- [Deno](https://deno.com/) installed locally
- A Discord bot token
- Your Discord user ID
- Open DMs or an open DM channel with the bot

## Setup
1. Clone the repository
    ```bash
    git clone https://github.com/LinusTebbe/ikea-watcher.git
    ```
2. Navigate to the project directory
    ```bash
    cd ikea-watcher
    ```
3. Copy the example .env file
    ```bash
    cp .env.dist .env
    ```
4. Add your Discord bot token to the .env file
5. Create your settings (for now, see [TODO](#todo)) in `data/settings/[YOUR_DISCORD_USER_ID].json` the following format:
    ```json
    {
      "storeIds":[148],
      "searchTerms":["KALLAX"]
    }
    ```
   Store IDs can be found at https://www.ikea.com/de/de/meta-data/informera/stores-suggested.json
   Search terms are only matched against the product name, like "KALLAX"
6. Run the bot (you can also use the PM2 config to let it run on a schedule)
    ```bash
    deno run sendUpdates
    ```
## TODO
- [ ] Add commands to manage the bot
- [ ] Make publicly usable

Disclaimer: This bot is intended for personal use and is not affiliated with IKEA. Use it responsibly and respect IKEA’s terms of service. The bot may stop working if IKEA changes their website or API.