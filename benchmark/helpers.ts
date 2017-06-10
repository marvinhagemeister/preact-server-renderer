import * as chalk from "chalk";

/* tslint:disable no-console */
export const logWinner = (suite: any) =>
  console.log(
    "Fastest is " + chalk.green(suite.filter("fastest").map("name")) + "\n",
  );

export const logCycle = (event: any) => console.log(String(event.target));
