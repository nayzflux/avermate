import PasswordEntropy from "@rabbit-company/password-entropy";

type PasswordStrength = "weak" | "medium" | "strong";

const STRONG_ENTROPY = 128;

export const getPasswordStrength = (
  password: string
): {
  strength: PasswordStrength;
  entropy: number;
} => {
  const entropy = PasswordEntropy.calculate(password);

  if (entropy <= 64) {
    return {
      entropy: entropy / STRONG_ENTROPY,
      strength: "weak",
    };
  }

  if (entropy >= 80) {
    return {
      entropy: entropy / STRONG_ENTROPY,
      strength: "strong",
    };
  }

  return {
    entropy: entropy / STRONG_ENTROPY,
    strength: "medium",
  };
};
