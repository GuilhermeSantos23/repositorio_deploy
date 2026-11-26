const MIN_CODE = 300000;
const MAX_CODE = 999999;

const usedCodes = new Set<string>();

export function generateUniqueUnitCode(): string {
  const range = MAX_CODE - MIN_CODE + 1;
  const randomValues = new Uint32Array(1);

  const limit = Math.floor(0x100000000 / range) * range;

  let code: string;

  do {
    do {
      crypto.getRandomValues(randomValues);
    } while (randomValues[0] >= limit);

    code = String(MIN_CODE + (randomValues[0] % range));
  } while (usedCodes.has(code));

  usedCodes.add(code);

  return code;
}