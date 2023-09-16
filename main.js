const startDownload = require("./download");

const t1 = performance.now();

startDownload().then(() => {
  const t2 = performance.now();
  console.log("\n\n\n\n ==========> ", t2 - t1)
}).catch(er => {
  console.log(er)
  const t2 = performance.now();
  console.log("\n\n\n\n ==========> ", t2 - t1)
})
