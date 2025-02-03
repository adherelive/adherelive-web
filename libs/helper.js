import crypto from "crypto";
import validator from "validator";

/**
 * The randomString function generates a random string of a specified length (length) using characters from the set
 * Or the ones that the user can alternatively send while calling the function
 *
 * @param length
 * @param customCharacters
 * @returns {string}
 */
export function randomString(length, customCharacters) {
  const defaultCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characters = customCharacters || defaultCharacters;
  const charactersLength = characters.length;

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }
  if (typeof characters !== "string" || characters.length === 0) {
    throw new Error("Custom characters must be a non-empty string");
  }

  // TODO: Alternate method with the use of crypto. more secure
  // const randomValues = new Uint32Array(length);
  // crypto.getRandomValues(randomValues);
  // return Array.from(randomValues, (value) =>
  //     characters.charAt(value % charactersLength)
  // ).join("");

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * The isURL function checks whether a given string (str) is a valid URL.
 * It uses a regular expression to validate the structure of the string against common URL patterns.
 * - Protocol: ^(https?:\/\/)? - Matches an optional protocol (http:// or https://)
 * - Domain Name: (([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}
 *     - Matches domain names like example.com, subdomain.example.co.uk, etc.
 *     - Allows alphanumeric characters and hyphens (but not starting or ending with a hyphen).
 *     - Requires at least two letters for the top-level domain (e.g., .com, .org).
 * - IP Address: ((\d{1,3}\.){3}\d{1,3}) - Matches IPv4 addresses like 192.168.1.1
 * - Port: (\:\d+)? - Matches an optional port number (e.g., :8080)
 * - Path: (\/[-a-z\d%_.~+]*)* - Matches an optional path (e.g., /path/to/resource)
 * - Query String: (\?[;&a-z\d%_.~+=-]*)? - Matches an optional query string (e.g., ?key=value&anotherKey=anotherValue)
 * - Fragment: (\#[-a-z\d_]*)?$ - Matches an optional fragment (e.g., #section1)
 * - Case Sensitivity: The 'i' flag makes the regex case-insensitive
 * The function returns true if the input string matches the regex pattern, indicating it is a valid URL,
 * and false otherwise.
 *
 * Simplified it to use a well-tested library like validator.js , which provides robust URL validation.
 * This approach avoids reinventing the wheel and ensures better compatibility with edge cases.
 *
 * @param str
 * @returns {boolean}
 */
export function isURL(str) {
  return validator.isURL(str);
}

/**
 * This importModule helper function handles the dynamic import and provides basic error handling.
 * You can further enhance it based on your specific needs.
 *
 * By using a helper function for dynamic imports, you can improve the structure, maintainability,
 * and potentially the performance of your code.
 *
 * @param path
 * @returns {Promise<*>}
 */
export const importModule = async (path) => {
  try {
    const module = await import(path);
    return module.default; // Assuming the module exports a default export
  } catch (error) {
    log.error(`Error importing module ${path}: `, error);
    throw error;
  }
};
