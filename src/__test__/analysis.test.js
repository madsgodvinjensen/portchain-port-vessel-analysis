import { jest } from "@jest/globals";
import { AbidjanExpress, portCalls } from "./fixtures.mjs";

describe("ports most called", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test("calculates ports most called", async () => {
    jest.unstable_mockModule("../dataStore.mjs", () => ({
      getVessels: jest.fn(() => []),
      getSchedules: jest.fn(() => [
        {
          vessels: [AbidjanExpress],
          portCalls: portCalls,
        },
      ]),
    }));

    const { portsMostCalled } = await import("../analysis.mjs");
    const result = await portsMostCalled();
    expect(result).toEqual([
      {
        name: "Antwerpen",
        portCalls: 14,
      },
      {
        name: "Hamburg",
        portCalls: 4,
      },
      {
        name: "Casablanca",
        portCalls: 3,
      },
      {
        name: "Tanger Med",
        portCalls: 2,
      },
      {
        name: "Tema",
        portCalls: 1,
      },
    ]);
  });
});

describe("ports least called", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test("calculates ports least called", async () => {
    jest.unstable_mockModule("../dataStore.mjs", () => ({
      getVessels: jest.fn(() => []),
      getSchedules: jest.fn(() => [
        {
          vessels: [AbidjanExpress],
          portCalls: portCalls,
        },
      ]),
    }));

    const { portsLeastCalled } = await import("../analysis.mjs");
    const result = await portsLeastCalled();
    expect(result).toEqual([
      {
        name: "Tema",
        portCalls: 1,
      },
      {
        name: "Tanger Med",
        portCalls: 2,
      },
      {
        name: "Casablanca",
        portCalls: 3,
      },
      {
        name: "Hamburg",
        portCalls: 4,
      },
      {
        name: "Antwerpen",
        portCalls: 14,
      },
    ]);
  });
});

describe("percentiles", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test("calculates percentiles of port call durations", async () => {
    jest.unstable_mockModule("../dataStore.mjs", () => ({
      getVessels: jest.fn(() => []),
      getSchedules: jest.fn(() => [
        {
          vessels: [AbidjanExpress],
          portCalls: portCalls.filter((x) => x.port.name === "Antwerpen"),
        },
      ]),
    }));

    const { portCallPercentiles } = await import("../analysis.mjs");
    const result = await portCallPercentiles();
    expect(result).toEqual([
      {
        percentiles: {
          5: 4.1,
          20: 6.1,
          50: 14.3,
          75: 16.93,
          90: 18.8,
        },
        name: "Antwerpen",
      },
    ]);
  });

  test("percentiles with scarce data", async () => {
    jest.unstable_mockModule("../dataStore.mjs", () => ({
      getVessels: jest.fn(() => []),
      getSchedules: jest.fn(() => [
        {
          vessels: [AbidjanExpress],
          portCalls: portCalls.filter((x) => x.port.name === "Tema"),
        },
      ]),
    }));

    const { portCallPercentiles } = await import("../analysis.mjs");
    const result = await portCallPercentiles();
    expect(result).toEqual([
      {
        percentiles: {
          5: 14.1,
          20: 14.1,
          50: 14.1,
          75: 14.1,
          90: 14.1,
        },
        name: "Tema",
      },
    ]);
  });
});
