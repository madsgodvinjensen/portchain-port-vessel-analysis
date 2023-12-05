import inquirer from "inquirer";

export const features = {
  portsMostCalled: "ports-most-called",
  portsLeastCalled: "ports-least-called",
  portCallPercentiles: "port-call-percentiles",
  exit: "exit",
};

export async function* cli() {
  while (true) {
    const { feature } = await inquirer.prompt([
      {
        type: "list",
        name: "feature",
        message: "Display data about:",
        choices: [
          {
            name: "Five ports with the most port calls",
            value: features.portsMostCalled,
          },
          {
            name: "Five ports with the fewest port calls",
            value: features.portsLeastCalled,
          },
          {
            name: "Percentiles of port call durations",
            value: features.portCallPercentiles,
          },
          { name: "Quit", value: features.exit },
        ],
      },
    ]);

    yield feature;
  }
}
