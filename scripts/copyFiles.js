const fs = require("node:fs/promises");
// take the gtl-subgraph.yaml file and duplicate it to subgraph.yaml
fs.copyFile("./gtl-subgraph.yaml", "./subgraph.yaml");
// take the gtl-schema.graphql file and duplicate it to schema.graphql
fs.copyFile("./gtl-schema.graphql", "./schema.graphql");
