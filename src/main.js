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
 * Returns a function to remove vowels and diacritics and keep the consonantal
 * skeleton only.
 * @alias module:aramaicMapper.Mapper#removeDotting
 * @param { Function } isDotting string => boolean to check if char is dotting
 * @returns { Function } word => word removeDotting function logic
*/
Mapper.prototype.removeDotting = isDotting => word => {
  if (!word) {
    return word;
  }

  let hasDotting = false;
  const stack = [];
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    if (isDotting(c)) {
      hasDotting = true;
    } else {
      stack.push(c);
    }
  }
  return hasDotting ? stack.join('') : word;
};

export { Writing, Mapper };
