Demo to show the use of "subgraph-alarm-clock". Running periodic tasks is difficult to do with subgraphs. 

The subgraph uses a chosen contract event as a triggers. It then checks if this is the first event within this minute, hour, day, week (starting on Sunday), month, and year. You can then assign custom handlers for the actions to be performed each time period. This is a simple example that will create a new entity for each time based trigger. 

It uses the eth-usd chainlink oracle new round event as a trigger (runs approximately every 30 minutes, and has been around for a year). Thus the minute timeframe is limited to only running once per event ~2 times per hour. If you want to handle minute events, or start at an earlier block then a new contract and event must be chosen.
