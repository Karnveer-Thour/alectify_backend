export function CSVToJSON<T>(data: string): T[] {
  const [header, ...otherRows] = data.split('\n');

  const headerCells = splitByComma(header)
    .map(removeSpacingLeadingAndTrailingDoubleQuotes)
    .map(removeQuotesLeadingAndTrailingDoubleQuotes)
    .map(sentenceCaseToCamelCase)
    .map(snakeCaseToCamelCase);

  return otherRows
    .map(splitByComma)
    .map((row) => row.map(removeSpacingLeadingAndTrailingDoubleQuotes))
    .map((row) => row.map(removeQuotesLeadingAndTrailingDoubleQuotes))
    .map((row) => row.map((cell) => (cell === 'NULL' ? null : cell)))
    .map((row) => row.map((cell, idx) => ({ [headerCells[idx]]: cell })))
    .map((item) => Object.assign({}, ...item));

  function splitByComma(str: string): string[] {
    return str.split(',');
  }
  function sentenceCaseToCamelCase(str: string): string {
    return toCamelCase(str, ' ');
  }
  function snakeCaseToCamelCase(str: string): string {
    return toCamelCase(str, '_');
  }
  function toCamelCase(str: string, splitter: string): string {
    return str
      .toLowerCase()
      .split(splitter)
      .map((item, idx) =>
        idx > 0 ? item[0].toUpperCase() + item.slice(1) : item,
      )
      .join('');
  }
  function removeQuotesLeadingAndTrailingDoubleQuotes(item: string): string {
    return removeLeadingDoubleQuotes(removeTrailingDoubleQuotes(item));
  }

  // Removing this things '"\r'

  function removeSpacingLeadingAndTrailingDoubleQuotes(item: string): string {
    return removeTrailingDoubleSpacing(removeLeadingDoubleSpacing(item));
  }

  function removeTrailingDoubleQuotes(item: string): string {
    return item.endsWith('"') ? item.slice(0, item.length - 1) : item;
  }
  function removeLeadingDoubleQuotes(item: string): string {
    return item.startsWith('"') ? item.slice(1) : item;
  }

  function removeTrailingDoubleSpacing(item: string): string {
    return item.endsWith('\r') ? item.slice(0, item.length - 1) : item;
  }
  function removeLeadingDoubleSpacing(item: string): string {
    return item.startsWith('\r') ? item.slice(1) : item;
  }
}
