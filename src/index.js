import { cli, features } from "./cli.mjs";
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
      case features.portsMostCalled:
        const result = await portsMostCalled();
        console.log(result);
        console.log();
        break;
      case features.portsLeastCalled:
        const result2 = await portsLeastCalled();
        console.log(result2);
        console.log();
        break;
      case features.portCallPercentiles:
        const result3 = await portCallPercentiles();
        console.log(result3);
        console.log();
        break;
    }
  }
})();
