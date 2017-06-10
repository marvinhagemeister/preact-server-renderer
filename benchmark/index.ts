import { bench1 } from "./compact.bench";
import { bench2 } from "./jsx.bench";

bench1().then(() => bench2());
