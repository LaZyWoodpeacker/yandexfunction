import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "commonjs",
  },
  include: ["./src/**/*.ts"],
  plugins: [
    typescript({
      exclude: ["node_modules"],
      rootDir: "src/",
      compilerOptions: {
        sourceMap: false,
        module: "esnext",
        target: "ESNext",
        skipLibCheck: true,
        moduleResolution: "node",
        esModuleInterop: false,
        removeComments: true,
        experimentalDecorators: true,
      },
    }),
  ],
};
