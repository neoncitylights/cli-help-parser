# CLI help parser for FIG specs
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub deployments](https://img.shields.io/github/deployments/neoncitylights/cli-help-parser/github-pages?label=deploy)](https://github.com/neoncitylights/cli-help-parser/deployments/activity_log?environment=github-pages)
[![codecov](https://codecov.io/gh/neoncitylights/cli-help-parser/branch/main/graph/badge.svg?token=xtI8VUXBwP)](https://codecov.io/gh/neoncitylights/cli-help-parser)

This library provides a parser that, given a CLI help manual, generates some scaffolding for machine-readable Fig specs.

I originally created this repository to help [add the webpack spec](https://github.com/withfig/autocomplete/pull/1100) to Fig.

> Currently, this library is slightly hardcoded to just recognize webpack's help manual, but I may update it in the future to make this parser more generic.

## Setup

Running the NPM script will generate an `options.json` file (intentionally git-ignored in `.gitignore`).

```bash
gh repo clone neoncitylights/cli-help-parser
npm install
npm run generate
```

## Documentation
[Auto-generated API documentation is available](https://github.com/neoncitylights/cli-help-parser).

## Performance

This script will usually take longer on the first run, and faster on subsequent runs.

With some informal benchmarking, this script can take around 30 to 40 milliseconds on sebsequent runs from parsing all of 957 options of the `webpack` CLI tool, with only a terminal open. This roughly tracks to approximately 36.57 nanoseconds per line.

The script+benchmark was ran under the following environment:

* TypeScript version: 4.6.2
* Node.js: 17.7.2
* Machine:
  * Model: MacBook Pro 2015
  * OS version: macOS Monterey 12.2.1
  * CPU: Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz
  * Memory: 16 GB 1600 MHz DDR3

The timing was tested via `console.time()` and `console.timeEnd()`. [^console-time][^console-timeend]

## Post-processing

After parsing every option/subcommand, it post-processes the description using some basic heuristics to find out more information:

### Deprecated

If the sentence contains the keyword `deprecated`, it will mark it as deprecated via `deprecated: true`.
It will also look to see if there is any inline code by checking for inline code delimiters, and use that as the `insertValue`.

### Argument templates

* Folders: If the sentence contains the keywords `directory`, and the option accepts an argument, it will add `"folders"` to the `template` property.
* Filepaths: If the sentence contains the keywords `filename`, and the option accepts an argument, it will add `"filepaths"` to the `template` property.

## License

This repository is released under the [MIT License](./LICENSE).

[^console-time]: https://console.spec.whatwg.org/#time
[^console-timeend]: https://console.spec.whatwg.org/#timeend
