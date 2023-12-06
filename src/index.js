import {
  cli,
  features,
  withSpinner,
  print,
  printTable,
  paging,
} from "./cli.mjs";
import {
  portsMostCalled,
  portsLeastCalled,
  portCallPercentiles,
} from "./analysis.mjs";

(async function () {
  for await (const feature of cli()) {
    switch (feature) {
      case features.exit:
      default:
        process.exit(0);
        break;
      case features.portsMostCalled: {
        const result = await withSpinner(() => portsMostCalled());
        if (result) {
          printTable(result);
        }

        break;
      }
      case features.portsLeastCalled: {
        const result = await withSpinner(() => portsLeastCalled());
        if (result) {
          printTable(result);
        }

        break;
      }
      case features.portCallPercentiles: {
        const result = await withSpinner(() => portCallPercentiles());
        if (!result) {
          break;
        }

        const sortedResult = result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        print(
          "Ports with their port call duration percentiles (hours)\nSorted by port name"
        );

        await paging(sortedResult.length, (startIndex, endIndex) => {
          printTable(
            sortedResult.slice(startIndex, endIndex).map((port) => ({
              Name: port.name,
              "5th": port.percentiles[5],
              "20th": port.percentiles[20],
              "50th": port.percentiles[50],
              "75th": port.percentiles[75],
              "90th": port.percentiles[90],
            }))
          );
        });

        break;
      }
    }
  }
})();
