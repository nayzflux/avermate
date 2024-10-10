import { customAlphabet } from "nanoid";

type Prefix = "u" | "s" | "n";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const newId = (prefix: Prefix, size?: number) => {
  const id = customAlphabet(ALPHABET, size);
  return (prefix = "_" + id);
};
