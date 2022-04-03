# CLI help parser for FIG specs

This library provides a parser that, given a CLI help manual, generates some scaffolding for machine-readable Fig specs.

> Currently, this library is slightly hardcoded to just recognize webpack's help manual, but I may update it in the future to make this parser more generic.

## Setup

Running the NPM script will generate an `options.json` file (intentionally git-ignored in `.gitignore`).

```bash
npm install
npm run generate
```

## Performance

This script will usually take longer on the first run, and faster on subsequent runs.

With some informal benchmarking, this script ran around 30 to 40 milliseconds on subsequent runs with the following environment:

* TypeScript version: 4.6.2
* Node.js: 17.7.2
* Machine:
  * Model: MacBook Pro 2015
  * OS version: macOS Monterey 12.2.1
  * CPU: Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz
  * Memory: 16 GB 1600 MHz DDR3

The timing was tested via `compute.time()` and `console.timeEnd()`.

## Post-processing

After parsing every option/subcommand, it post-processes the description using some basic heuristics to find out more information:

### Deprecated

If the sentence contains the keyword `deprecated`, it will mark it as deprecated via `deprecated: true`.
It will also look to see if there is any inline code by checking for inline code delimiters, and use that as the `insertValue`.

### Argument templates

* Folders: If the sentence contains the keywords `directory`, and the option accepts an argument, it will add `"folders"` to the `template` property.
* Filepaths: If the sentence contains the keywords `filename`, and the option accepts an argument, it will add `"filepaths"` to the `template` property.
