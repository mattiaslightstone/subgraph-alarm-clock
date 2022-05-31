const fs = require("node:fs/promises");

const schemaContent = `

type LastRun @entity {
  id: ID!
  timestamp: BigInt!
  block: BigInt!
}
`
fs.appendFile("./schema.graphql", schemaContent)

const yamlContent = `
  - kind: ethereum
    name: HourlyEvents
    network: mainnet
    source:
      address: "0x37bC7498f4FF12C19678ee8fE19d713b87F6a9e6"
      abi: AccessControlledOffchainAggregator
      startBlock: 12382429
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      entities:
        - LastRun
      abis:
        - name: AccessControlledOffchainAggregator
          file: ./abis/AccessControlledOffchainAggregator.json
      eventHandlers:
        - event: NewRound(indexed uint256,indexed address,uint256)
          handler: handleCronTrigger
      file: ./src/alarm_clock_triggers.ts
`
fs.appendFile("./subgraph.yaml", yamlContent);

fs.copyFile("./scripts/alarmClock/alarm_clock_runners.ts", './src/alarm_clock_runners.ts')
fs.copyFile("./scripts/alarmClock/alarm_clock_triggers.ts", './src/alarm_clock_triggers.ts')