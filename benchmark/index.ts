import { bench1 } from "./compact.bench";
import { bench2, bench3 } from "./jsx.bench";

async function run() {
  await bench1();
  await bench2();
  await bench3();
}

run();
