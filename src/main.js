/** @module aramaicMapper */
/**
 * @class Writing
 * @classdesc Tuple for storing an Aramaic writing system:
 * * Consonants are expected to be in the standard Aramaic order.
 * * Vowels are expected to be in the Sedra [ a o e i u ] order + optional
 *   Eastern/Hebrew short E and long O in positions 6 and 7 respectively.
 * * Diacritics, if provided, should follow Sedra [' , _  *] order. They are
 *   Qushaya, Rukkakha, Linea Occultans and Seyame respectively.
 *   Other diacritics like verb and homograph dots or Hebrew Sheva, if
 *   supported, should be added after the above.
 * * Optionally punctuation and other characters could be added for mapping.
 *
 * The main idea is that each mapped character should be in the same
 * position in the _to_ Writing system as the _from_ Writing system.
 * @static
 * @constructor
 * @param { string[] } consonants consonant list in the standard aramaic order
 * @param { string[] } vowels vowel list in the Sedra order
 * @param { string[] } diacritics optional diacritics list in the Sedra order
 * @param { string[]|undefined } punctuation optional punctuation list
 * @param { string[]|undefined } other optional other symbols like crosses, etc.
  */
function Writing(consonants, vowels, diacritics, punctuation, other) {
  this.consonants = consonants;
  this.vowels = vowels;
  this.diacritics = diacritics;
  this.punctuation = punctuation;
  this.other = other;
}

/**
 * @static
 * @callback mapCallback
 * Callback to replace generic one-to-one mapping
 * @param { string } word input word to be mapped
 * @param { number }  index - index of the current character to be mapped
 * @param { Object.<string, string> } fromTo - character mapping hash from
 * @param { Object } wordProps optional word properties hash
 * base Writing to mapped Writing
 * @returns { string } the mapped string for c - could be longer than one
 * character
 */

/**
 * @class Mapper
 * @classdesc Map from a base writing system to another system.
 * The optional `mapCallback` when called will be provided following arguments:
 * * word - the word to be mapped
 * * index - index of the current character to be mapped
 * * fromTo - character mapping hash from base Writing to mapped Writing
 *
 * `mapCallback` needs to be provided only when the simple one to one mapping
 * between writing systems is not enough, and custom mapping needs to be
 * implemented instead.
 * @static
 * @constructor
 * @param { Writing } fromWriting base writing system
 * @param { Writing } toWriting writing system to map to
 * @param { mapCallback|undefined } mapCallback optional map callback
 */
function Mapper(fromWriting, toWriting, mapCallback) {
  /**
   * Source writing system to be mapped
   * @alias module:aramaicMapper.Mapper#fromWriting
   * @type { Writing }
   */
  this.fromWriting = fromWriting;

  /**
   * Destination writing system to map to
   * @alias module:aramaicMapper.Mapper#toWriting
   * @type { Writing }
   */
  this.toWriting = toWriting;

  /**
   * Character mapping hash from base Writing to mapped Writing
   * @alias module:aramaicMapper.Mapper#fromTo
   * @type { Object.<string, string> }
   */
  this.fromTo = Object.create(null);

  /**
   * Mapped multiple char sequences that map to a single `fromWriting` char.
   * Used to move only 1 character ahead, instead of length of mapped string.
   * @alias module:aramaicMapper.Mapper#multiples
   * @type { Array.<string> }
   */
  this.multiples = [];

  /**
   * Checked callback - to make sure it is a function
   * @private
   * @type { mapCallback }
   */
  const callback = typeof mapCallback === 'function' ? mapCallback : undefined;

  for (let i = 0, clen = fromWriting.consonants.length; i < clen; i++) {
    const fc = fromWriting.consonants[i];
    const tc = toWriting.consonants[i];
    Object.defineProperty(this.fromTo, fc, { value: tc, enumerable: true });
  }

  for (let j = 0, vlen = fromWriting.vowels.length; j < vlen; j++) {
    const fv = fromWriting.vowels[j];
    const tv = toWriting.vowels[j];
    Object.defineProperty(this.fromTo, fv, { value: tv, enumerable: true });
  }

  if (fromWriting.diacritics && toWriting.diacritics) {
    for (let k = 0, dlen = fromWriting.diacritics.length; k < dlen; k++) {
      const fd = fromWriting.diacritics[k];
      const td = toWriting.diacritics[k];
      Object.defineProperty(this.fromTo, fd, { value: td, enumerable: true });
    }
  }

  if (fromWriting.punctuation && toWriting.punctuation) {
    for (let l = 0, plen = fromWriting.punctuation.length; l < plen; l++) {
      const fp = fromWriting.punctuation[l];
      const tp = toWriting.punctuation[l];
      Object.defineProperty(this.fromTo, fp, { value: tp, enumerable: true });
    }
  }

  if (fromWriting.other && toWriting.other) {
    for (let m = 0, olen = fromWriting.other.length; m < olen; m++) {
      const fo = fromWriting.other[m];
      const to = toWriting.other[m];
      Object.defineProperty(this.fromTo, fo, { value: to, enumerable: true });
    }
  }

  Object.freeze(this.fromTo);

  /**
   * Map word from a base writing system to another system
   * @alias module:aramaicMapper.Mapper#map
   * @param { string } word input word to be mapped
   * @param { Object } wordProps optional word settings - to be passed to callback
   * @returns { string } mapped word
   */
  this.map = (word, wordProps) => {
    if (!word) {
      return word;
    }
    let c = '';
    let sb = '';
    for (
      let i = 0, len = word.length, mc;
      i < len;
      i +=
        mc && mc.length && mc.length > 0 && this.multiples.indexOf(mc) === -1
          ? mc.length
          : 1
    ) {
      if (callback) {
        mc = callback(word, i, this.fromTo, wordProps);
      } else {
        c = word.charAt(i);
        mc = this.fromTo[c];
        if (!mc && mc !== '') {
          mc = c;
        }
      }
      sb += mc || '';
    }
    return sb;
  };
}

/**
 * Returns function which returns true if input word has vowels or diacritics.
 * @static
 * @param { function } isDotting (char => boolean) which checks if char is dotting
 * @returns { function } hasDotting (word => boolean) function logic
 */
const hasDotting = isDotting => word => {
  if (!word) {
    return false;
  }
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    if (isDotting(c)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns a function to remove vowels and diacritics and keep the consonantal
 * skeleton only.
 * @static
 * @param { function } isDotting (char => boolean) which checks if char is dotting
 * @returns { function } clearDotting (word => word) function logic
*/
const clearDotting = isDotting => word => {
  if (!word) {
    return word;
  }

  let hasDots = false;
  const stack = [];
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    if (isDotting(c)) {
      hasDots = true;
    } else {
      stack.push(c);
    }
  }
  return hasDots ? stack.join('') : word;
};

/**
 * Convert word to ASCII sort chars
 * @private
 * @static
 * @param { string } word input word
 * @param { Object.<string, string> } letterAsciiMap letter to ASCII value map
 * @returns { string } word converted as ASCII sort
 */
const toAsciiSort = (word, letterAsciiMap) => {
  let sb = '';
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    const m = letterAsciiMap[c];
    sb += m || (m === '' ? '' : c);
  }
  return sb;
};

/**
 * Returns a function to be used for sorting words using the provided `letterAsciiMap`
 * @static
 * @param { Object.<string, string> } letterAsciiMap letter to ASCII value map
 * @param { function } removeDotting (word => word) remove dots function
 * @returns { function } ((word1, word2) => number) function implementation
 */
const getSort = (letterAsciiMap, removeDotting) => (word1, word2) => {
  if (!word1 || !word2) {
    return !word1 && !word2 ? 0 : !word1 ? -1 : 1;
  }

  const cons1 = removeDotting(word1);
  const cons2 = removeDotting(word2);
  let asc1 = toAsciiSort(cons1, letterAsciiMap);
  let asc2 = toAsciiSort(cons2, letterAsciiMap);
  if (asc1 < asc2) {
    return -1;
  }
  if (asc1 > asc2) {
    return 1;
  }

  if (cons1 === word1 && cons2 === word2) {
    return 0; // no dots
  }
  asc1 = toAsciiSort(word1, letterAsciiMap);
  asc2 = toAsciiSort(word2, letterAsciiMap);
  return asc1 < asc2 ? -1 : asc1 > asc2 ? 1 : 0;
};

export { Writing, Mapper, hasDotting, clearDotting, getSort };
