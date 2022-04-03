# CLI help parser for FIG specs

This library provides a parser that, given a CLI help manual, generates some scaffolding for machine-readable Fig specs.

> Currently, this library is slightly hardcoded to just recognize webpack's help manual, but I may update it in the future to make this parser more generic.

## Setup

Running the NPM script will generate an `options.json` file (intentionally git-ignored in `.gitignore`). This script will take roughly anywhere between 30 to 90 milliseconds.

```bash
npm install
npm run generate
```

## Post-processing

After parsing every option/subcommand, it post-processes the description using some basic heuristics to find out more information:

### Deprecated

If the sentence contains the keyword `deprecated`, it will mark it as deprecated via `deprecated: true`.
It will also look to see if there is any inline code by checking for inline code delimiters, and use that as the `insertValue`.

### Argument templates

* Folders: If the sentence contains the keywords `directory`, and the option accepts an argument, it will add `"folders"` to the `template` property.
* Filepaths: If the sentence contains the keywords `filename`, and the option accepts an argument, it will add `"filepaths"` to the `template` property.
