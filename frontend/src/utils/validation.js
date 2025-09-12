// src/utils/validation.js
// Utilidades simples para validar y normalizar identificadores de login.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Retorna true si el string tiene forma de email (gmail u otro dominio). */
export function isEmail(value) {
  if (!value) return false;
  return EMAIL_RE.test(String(value).trim());
}

/**
 * Limpia un documento dejando solo dígitos.
 * Aplica una validación de largo "razonable" (7 a 11 dígitos, configurable).
 * Devuelve el string normalizado o null si no parece válido.
 */
export function toDocumento(value, { min = 7, max = 11 } = {}) {
  if (!value && value !== 0) return null;
  const digits = String(value).replace(/\D+/g, "");
  if (digits.length < min || digits.length > max) return null;
  return digits;
}

/**
 * Dado un identificador (email o documento), decide el tipo y devuelve el payload.
 * - Si parece email => { email }
 * - Sino intenta documento => { documento }
 * - Sino => { error: '...' }
 */
export function parseIdentifier(raw) {
  const value = String(raw || "").trim();

  if (!value) return { error: "Ingresá tu email o documento." };

  if (isEmail(value)) {
    return { email: value.toLowerCase() };
  }

  const doc = toDocumento(value);
  if (doc) return { documento: doc };

  return {
    error:
      "El documento debe contener entre 7 y 11 dígitos (sin puntos) o ingresá un email válido.",
  };
}
