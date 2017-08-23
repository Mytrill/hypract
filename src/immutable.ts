

export function push<T>(array: T[], val: T): T[] {
  return [].concat(array, [val]);
}
