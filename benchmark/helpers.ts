import Benchmark from "benchmarkjs-pretty";

export function createBenchmark(name: string, a: () => any, b: () => any) {
  new Benchmark(name)
    .add("preact-render-to-string", a)
    .add("preact-server-renderer", b)
    .run();
}
