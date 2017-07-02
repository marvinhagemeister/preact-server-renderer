import Benchmark from "benchmarkjs-pretty";

export function createBenchmark(name: string, a: () => any, b: () => any) {
  return new Benchmark()
    .add("preact-render-to-string", a)
    .add("preact-stream-renderer", b)
    .run();
}
