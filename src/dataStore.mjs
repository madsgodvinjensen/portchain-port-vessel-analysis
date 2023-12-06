import https from "https";

async function getJSON(url) {
  let statusCode = 0;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        statusCode = res.statusCode ?? 0;
        const data = [];

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          try {
            const stringified = Buffer.concat(data).toString();
            resolve(JSON.parse(stringified));
          } catch (error) {
            reject({
              statusCode,
              error,
            });
          }
        });
      })
      .on("error", (error) => {
        reject({
          statusCode,
          ...error,
        });
      });
  });
}

export async function getVessels() {
  return getJSON(
    "https://import-coding-challenge-api.portchain.com/api/v2/vessels"
  );
}

export async function getSchedules(vessels) {
  return Promise.all(
    vessels.map((x) =>
      getJSON(
        `https://import-coding-challenge-api.portchain.com/api/v2/schedule/${x.imo}`
      )
    )
  );
}
