/**
@template Elem
@param {HTMLElement} root
@param {{new(): Elem}} type
@param {string} query
@returns {Elem}
*/
export function queryOrDie(root, type, query) {
  const found = root.querySelector(query);
  if (found !== null && found instanceof type) return found;
  throw new Error(`Could not find '${type.name}': '${query}'`);
}

/** @param {Element} elem */
export function removeChildren(elem) {
  while (elem.firstChild) elem.firstChild.remove();
}

/**
 * @param {string} msg
 * @param {string} [def]
 */
export function promptNumber(msg, def) {
  const str = prompt(msg, def);
  if (str !== null) {
    const n = parseFloat(str);
    if (isFinite(n)) return n;
    else alert("Expected a number");
  }
  return null;
}
