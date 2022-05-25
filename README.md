# Cron jobs for the graph. At the moment we are only going to be getting granularity up to 1 hour.

1. Choose the specific contract you would like to base your time triggers on
- How do we handle multiple chains?
- How do we handle multiple different contracts?
- Option: default to the eth/usd chainlink aggregator address: 0x37bC7498f4FF12C19678ee8fE19d713b87F6a9e6, block: 12382429 (May 7, 2021)
2. choose the starting block for tracking
3. It should generate the subgraph.yaml
4. It should copy the subgraph.yaml that is generated to the subgraph.yaml in the current directory
