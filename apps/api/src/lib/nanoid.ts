import { customAlphabet } from "nanoid";

type Prefix = "u" | "sub" | "gra" | "acc";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

const nanoid = customAlphabet(ALPHABET, 12);

export const newId = (prefix: Prefix, size?: number) => {
  const id = nanoid(size);
  return prefix + "_" + id;
};
