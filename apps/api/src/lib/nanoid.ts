import { customAlphabet } from "nanoid";

/**
u - user
acc - account
ses - session
ver - verification
sub - subject
gra - grade
*/

type IdPrefix = "u" | "acc" | "ses" | "ver" | "sub" | "gra";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

const nanoid = customAlphabet(ALPHABET, 12);

export const generateId = (prefix: IdPrefix, size?: number) => {
  const id = nanoid(size);
  return prefix + "_" + id;
};
