import cron from "node-cron";

cron.schedule("0 13 * * 2-6", () => {
  console.log("Se ejecutó el cron:", new Date());
});