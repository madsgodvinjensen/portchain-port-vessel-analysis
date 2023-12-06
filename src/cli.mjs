import { intro, note, select, spinner, confirm, log } from "@clack/prompts";
import inquirer from "inquirer";

export const features = {
  portsMostCalled: "ports-most-called",
  portsLeastCalled: "ports-least-called",
  portCallPercentiles: "port-call-percentiles",
  exit: "exit",
};

export async function* cli() {
  intro(`Portchain analysis tool`);

  while (true) {
    const feature = await select({
      message: "Pick which analysis to run",
      options: [
        {
          label: "Five ports with the most port calls",
          value: features.portsMostCalled,
        },
        {
          label: "Five ports with the fewest port calls",
          value: features.portsLeastCalled,
        },
        {
          label: "Percentiles of port call durations",
          value: features.portCallPercentiles,
        },
        { label: "Quit", value: features.exit },
      ],
    });

    yield feature;
  }
}

export function print(string) {
  log.message(string);
}

export function printTable(array) {
  console.table(array);
}

export async function withSpinner(fn) {
  const s = spinner();

  s.start("Fetching data");
  try {
    const r = await fn();
    s.stop("Data fetched");
    return r;
  } catch (error) {
    s.stop(
      "Fetching data failed. Check the network and that the APIs are up.",
      2
    );
  }
}

export async function paging(numberOfItems, callbackFn) {
  let page = 0;
  const pageSize = 20;
  while (page * pageSize <= numberOfItems) {
    const currentIndex = page * pageSize;
    callbackFn(currentIndex, currentIndex + pageSize);

    const shouldContinue = await confirm({
      message: "Show next page?",
    });

    if (!shouldContinue) {
      break;
    }

    page += 1;
  }
}
