export function aliasBuilder(
  baseAlias: string,
): (strings: TemplateStringsArray) => string {
  return function builder(strings?: TemplateStringsArray): string {
    if (!strings?.length) {
      return baseAlias;
    }
    return baseAlias.concat(strings[0]);
  };
}
