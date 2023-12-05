import { getVessels, getSchedules } from "./dataStore.mjs";

let cache = { stale: true };
const withCache = (fn) => async () => {
  if (cache.stale) {
    const vessels = await getVessels();
    const schedules = await getSchedules(vessels);

    cache = schedules;
  }
  return fn(cache);
};

function groupByPortName(inputArray) {
  return inputArray.reduce((previous, current) => {
    const { port, ...portCall } = current;

    if (previous[port.name]) {
      previous[port.name].push(portCall);
    } else {
      previous[port.name] = [portCall];
    }

    return previous;
  }, {});
}

function groupPortCallsByName(schedules) {
  const portCallsByPortName = groupByPortName(
    schedules.flatMap((x) => {
      return x.portCalls.filter((portCall) => !portCall.isOmitted);
    })
  );

  return Object.entries(portCallsByPortName).map(([key, value]) => ({
    name: key,
    portCalls: value.length,
  }));
}

export const portsMostCalled = withCache(async (schedules) => {
  return groupPortCallsByName(schedules)
    .sort((a, b) => b.portCalls - a.portCalls)
    .slice(0, 5);
});

export const portsLeastCalled = withCache(async (schedules) => {
  return groupPortCallsByName(schedules)
    .sort((a, b) => a.portCalls - b.portCalls)
    .slice(0, 5);
});

function findPercentile(sortedArray, percentile) {
  const index = Math.ceil(sortedArray.length * (percentile / 100)) - 1;
  return sortedArray[index];
}

export const portCallPercentiles = withCache(async (schedules) => {
  const durationsGroupedByPort = groupByPortName(
    schedules.flatMap((x) => {
      return x.portCalls
        .filter((portCall) => !portCall.isOmitted)
        .map((portCall) => ({
          durationMinutes:
            (new Date(portCall.departure) - new Date(portCall.arrival)) /
            (1000 * 60),
          port: portCall.port,
        }));
    })
  );

  const percentilesPerPort = Object.entries(durationsGroupedByPort).map(
    ([portName, value]) => {
      const sorted = value.map((x) => x.durationMinutes).sort((a, b) => a - b);

      if (portName === "Hamburg") {
        console.log(sorted);
      }

      return {
        name: portName,
        percentiles: {
          5: findPercentile(sorted, 5),
          20: findPercentile(sorted, 20),
          50: findPercentile(sorted, 50),
          75: findPercentile(sorted, 75),
          90: findPercentile(sorted, 90),
        },
      };
    }
  );

  return percentilesPerPort;
});
