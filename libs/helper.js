export function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
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
    logger.error(`Error importing module ${path}: `, error);
    throw error;
  }
};
