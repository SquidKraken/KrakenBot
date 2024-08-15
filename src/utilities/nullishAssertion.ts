// eslint-disable eslint-plugin-unicorn/no-null no-undefined
type Nullish = null | undefined;

export function isNullish(value: unknown): value is Nullish {
  return value === undefined || value === null;
}
