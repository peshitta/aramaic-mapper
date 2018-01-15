const { strictEqual, notStrictEqual, ok } = require('assert');
const {
  Writing,
  Mapper,
  clearDotting,
  hasDotting,
  getSort
} = require('../build/aramaic-mapper');

const consonants = [
  'A',
  'B',
  'G',
  'D',
  'H',
  'O',
  'Z',
  'K',
  'Y',
  ';',
  'C',
  'L',
  'M',
  'N',
  'S',
  'E',
  'I',
  '/',
  'X',
  'R',
  'W',
  'T'
];

const calConsonants = [
  ')',
  'b',
  'g',
  'd',
  'h',
  'w',
  'z',
  'x',
  'T',
  'y',
  'k',
  'l',
  'm',
  'n',
  's',
  '(',
  'p',
  'c',
  'q',
  'r',
  '$',
  't'
];
const vowels = ['a', 'o', 'e', 'i', 'u'];
const diacritics = ["'", ',', '_', '*'];
const fromSedraWriting = new Writing(consonants, vowels, diacritics);
const toCalWriting = new Writing(
  calConsonants,
  vowels.concat(['E', 'O']),
  diacritics
);
const isConsonant = ch => fromSedraWriting.consonants.includes(ch);

/**
 * Letter ordinal value. Used for sorting:
 * a b c d e f g h i j k l m n o p q r s t u v - A O E I U
 * @constant
 * @type { Object.<string, string> }
*/
const letterAsciiMap = Object.freeze(
  Object.create(null, {
    A: { value: 'a', enumerable: true },
    B: { value: 'b', enumerable: true },
    G: { value: 'c', enumerable: true },
    D: { value: 'd', enumerable: true },

    H: { value: 'e', enumerable: true },
    O: { value: 'f', enumerable: true },
    Z: { value: 'g', enumerable: true },

    K: { value: 'h', enumerable: true },
    Y: { value: 'i', enumerable: true },
    ';': { value: 'j', enumerable: true },

    C: { value: 'k', enumerable: true },
    L: { value: 'l', enumerable: true },
    M: { value: 'm', enumerable: true },
    N: { value: 'n', enumerable: true },

    S: { value: 'o', enumerable: true },
    E: { value: 'p', enumerable: true },
    I: { value: 'q', enumerable: true },
    '/': { value: 'r', enumerable: true },

    X: { value: 's', enumerable: true },
    R: { value: 't', enumerable: true },
    W: { value: 'u', enumerable: true },
    T: { value: 'v', enumerable: true },

    a: { value: 'w', enumerable: true },
    o: { value: 'x', enumerable: true },
    e: { value: 'y', enumerable: true },
    i: { value: 'z', enumerable: true },
    u: { value: '{', enumerable: true },

    "'": { value: '', enumerable: true },
    ',': { value: ',', enumerable: true },
    _: { value: '', enumerable: true },
    '*': { value: '', enumerable: true }
  })
);

const isDotting = c => vowels.concat(diacritics).indexOf(c) > -1;

describe('Sedra', () => {
  const mapper = new Mapper(fromSedraWriting, toCalWriting);
  const toCal = mapper.map;
  const toCalMap = mapper.fromTo;
  describe('To CAL', () => {
    it('General case usage, with one-to-one mapping', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = 'l)dnh';
      const vocalisedExpected = "lmet,b'a(";
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
    it('General case usage, un-mapped symbols', () => {
      const word = toCal('<LADNH>');
      const vocalised = toCal("LMe{T,B'aE}");
      const wordExpected = '<l)dnh>';
      const vocalisedExpected = "lme{t,b'a(}";
      strictEqual(word, wordExpected, 'toCal consonant with unmapped');
      strictEqual(
        vocalised,
        vocalisedExpected,
        'toCal vocalised with unmapped'
      );
    });
    it('Another one-to-one mapping', () => {
      const word = toCal('ABHOH;');
      const vocalised = toCal('AaB,oHaOH_;');
      const wordExpected = ')bhwhy';
      const vocalisedExpected = ')ab,ohawh_y';
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (i;) => (yi) mapping', () => {
      const word = toCal('D;L;DOTH');
      const vocalised = toCal("D'i;Li;D,uOT,eH");
      const wordExpected = 'dylydwth';
      const vocalisedExpected = "d'yilyid,wut,eh";
      strictEqual(word, wordExpected, 'toCal_yi consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_yi vocalised');
    });
    it('Word with (uO) => (wu) mapping', () => {
      const word = toCal('LBELDBB;CON');
      const vocalised = toCal("LaB,EeLD'B,oB,a;C'uON");
      const wordExpected = 'lb(ldbbykwn';
      const vocalisedExpected = "lab,(eld'b,ob,ayk'wun";
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (oO) => (wO) mapping', () => {
      const word = toCal('BTSLON;XA');
      const vocalised = toCal("B'T,eSaLoONi;XiA");
      const wordExpected = 'btslwnyq)';
      const vocalisedExpected = "b't,esalwOniyqi)";
      strictEqual(word, wordExpected, 'toCal_wO consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_wO vocalised');
    });
    it('Blank word returns blank', () => {
      const word = toCal('');
      const wordExpected = '';
      strictEqual(word, wordExpected, 'toCal_blank');
    });
    it('Null word returns null', () => {
      const word = toCal(null);
      const wordExpected = null;
      strictEqual(word, wordExpected, 'toCal_null');
    });
    it('Undefined word returns undefined', () => {
      const word = toCal(undefined);
      const wordExpected = undefined;
      strictEqual(word, wordExpected, 'toCal_undefined');
    });
    it('0 number as word returns 0', () => {
      const word = toCal(0);
      const wordExpected = 0;
      strictEqual(word, wordExpected, 'toCal_zero');
    });
  });
  it('Is Mapped Letter', () => {
    ok(toCalMap.A, 'A toCalMap');
    ok(toCalMap.B, 'B toCalMap');
    ok(toCalMap.C, 'C toCalMap');
    ok(toCalMap.D, 'D toCalMap');
    ok(toCalMap.E, 'E toCalMap');
    ok(!toCalMap.F, 'F toCalMap');
    ok(!toCalMap.b, 'b toCalMap');
    ok(!toCalMap.c, 'c toCalMap');
    ok(!toCalMap['@'], '@ toCalMap');
    ok(!toCalMap.f, 'f toCalMap');
    ok(!toCalMap[''], "'' toCalMap");
  });
});

describe('Sedra', () => {
  const from = new Writing(
    fromSedraWriting.consonants,
    fromSedraWriting.vowels,
    fromSedraWriting.diacritics,
    ['>', '\\', '1'],
    ['[', ']']
  );

  const to = new Writing(
    toCalWriting.consonants,
    toCalWriting.vowels,
    toCalWriting.diacritics,
    ['.', '?', '!'],
    ['<', '>']
  );

  const mapper = new Mapper(from, to);
  const toCal = mapper.map;
  const toCalMap = mapper.fromTo;
  describe('To CAL with punctuation and other', () => {
    it('General case usage, with one-to-one mapping', () => {
      const word = toCal('LADNH1');
      const vocalised = toCal("LMeT,B'aE\\");
      const wordExpected = 'l)dnh!';
      const vocalisedExpected = "lmet,b'a(?";
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
    it('Another one-to-one mapping', () => {
      const word = toCal('[ABHOH;');
      const vocalised = toCal('AaB,oHaOH_;]');
      const wordExpected = '<)bhwhy';
      const vocalisedExpected = ')ab,ohawh_y>';
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('General case usage, with punctuation', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = 'l)dnh';
      const vocalisedExpected = "lmet,b'a(";
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
    it('One-to-one mapping, with other', () => {
      const word = toCal('ABHOH;');
      const vocalised = toCal('AaB,oHaOH_;');
      const wordExpected = ')bhwhy';
      const vocalisedExpected = ')ab,ohawh_y';
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (i;) => (yi) mapping', () => {
      const word = toCal('D;L;DOTH');
      const vocalised = toCal("D'i;Li;D,uOT,eH");
      const wordExpected = 'dylydwth';
      const vocalisedExpected = "d'yilyid,wut,eh";
      strictEqual(word, wordExpected, 'toCal_yi consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_yi vocalised');
    });
    it('Word with (uO) => (wu) mapping', () => {
      const word = toCal('LBELDBB;CON');
      const vocalised = toCal("LaB,EeLD'B,oB,a;C'uON");
      const wordExpected = 'lb(ldbbykwn';
      const vocalisedExpected = "lab,(eld'b,ob,ayk'wun";
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (oO) => (wO) mapping', () => {
      const word = toCal('BTSLON;XA');
      const vocalised = toCal("B'T,eSaLoONi;XiA");
      const wordExpected = 'btslwnyq)';
      const vocalisedExpected = "b't,esalwOniyqi)";
      strictEqual(word, wordExpected, 'toCal_wO consonant');
      notStrictEqual(vocalised, vocalisedExpected, 'toCal_wO vocalised');
    });
    it('Blank word returns blank', () => {
      const word = toCal('');
      const wordExpected = '';
      strictEqual(word, wordExpected, 'toCal_blank');
    });
    it('Null word returns null', () => {
      const word = toCal(null);
      const wordExpected = null;
      strictEqual(word, wordExpected, 'toCal_null');
    });
    it('Undefined word returns undefined', () => {
      const word = toCal(undefined);
      const wordExpected = undefined;
      strictEqual(word, wordExpected, 'toCal_undefined');
    });
    it('0 number as word returns 0', () => {
      const word = toCal(0);
      const wordExpected = 0;
      strictEqual(word, wordExpected, 'toCal_zero');
    });
  });
  it('Is Mapped Letter', () => {
    ok(toCalMap.A, 'A toCalMap');
    ok(toCalMap.B, 'B toCalMap');
    ok(toCalMap.C, 'C toCalMap');
    ok(toCalMap.D, 'D toCalMap');
    ok(toCalMap.E, 'E toCalMap');
    ok(!toCalMap.F, 'F toCalMap');
    ok(!toCalMap.b, 'b toCalMap');
    ok(!toCalMap.c, 'c toCalMap');
    ok(!toCalMap['@'], '@ toCalMap');
    ok(!toCalMap.f, 'f toCalMap');
    ok(!toCalMap[''], "'' toCalMap");
  });
});

describe('Sedra', () => {
  const mapCallback = (word, i, calMap) => {
    const map = ch => calMap[ch] || ch;
    const c = word.charAt(i);

    let m = '';
    switch (c) {
      case 'i':
        m =
          word.charAt(i + 1) === ';' && isConsonant(word.charAt(i + 2))
            ? 'yi' // Sedra stores as (iy)
            : map(c);
        break;
      case 'u':
        m =
          word.charAt(i + 1) === 'O' && isConsonant(word.charAt(i + 2))
            ? 'wu' // Sedra stores as (uw)
            : map(c);
        break;
      case 'o':
        m =
          word.charAt(i + 1) === 'O' && isConsonant(word.charAt(i + 2))
            ? 'wO' // Eastern O stored as (ow) in Sedra
            : map(c);
        break;
      default:
        m = map(c);
        break;
    }
    return m;
  };

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;
  const toCalMap = mapper.fromTo;

  describe('To CAL with Customized mapping', () => {
    it('General case usage, with one-to-one mapping', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = 'l)dnh';
      const vocalisedExpected = "lmet,b'a(";
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
    it('Another one-to-one mapping', () => {
      const word = toCal('ABHOH;');
      const vocalised = toCal('AaB,oHaOH_;');
      const wordExpected = ')bhwhy';
      const vocalisedExpected = ')ab,ohawh_y';
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (i;) => (yi) mapping', () => {
      const word = toCal('D;L;DOTH');
      const vocalised = toCal("D'i;Li;D,uOT,eH");
      const wordExpected = 'dylydwth';
      const vocalisedExpected = "d'yilyid,wut,eh";
      strictEqual(word, wordExpected, 'toCal_yi consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_yi vocalised');
    });
    it('Word with (uO) => (wu) mapping', () => {
      const word = toCal('LBELDBB;CON');
      const vocalised = toCal("LaB,EeLD'B,oB,a;C'uON");
      const wordExpected = 'lb(ldbbykwn';
      const vocalisedExpected = "lab,(eld'b,ob,ayk'wun";
      strictEqual(word, wordExpected, 'toCal_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wu vocalised');
    });
    it('Word with (oO) => (wO) mapping', () => {
      const word = toCal('BTSLON;XA');
      const vocalised = toCal("B'T,eSaLoONi;XiA");
      const wordExpected = 'btslwnyq)';
      const vocalisedExpected = "b't,esalwOnyiqi)";
      strictEqual(word, wordExpected, 'toCal_wO consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_wO vocalised');
    });
    it('Blank word returns blank', () => {
      const word = toCal('');
      const wordExpected = '';
      strictEqual(word, wordExpected, 'toCal_blank');
    });
    it('Null word returns null', () => {
      const word = toCal(null);
      const wordExpected = null;
      strictEqual(word, wordExpected, 'toCal_null');
    });
    it('Undefined word returns undefined', () => {
      const word = toCal(undefined);
      const wordExpected = undefined;
      strictEqual(word, wordExpected, 'toCal_undefined');
    });
    it('0 number as word returns 0', () => {
      const word = toCal(0);
      const wordExpected = 0;
      strictEqual(word, wordExpected, 'toCal_zero');
    });
  });
  it('Is Mapped Letter', () => {
    ok(toCalMap.A, 'A toCalMap');
    ok(toCalMap.B, 'B toCalMap');
    ok(toCalMap.C, 'C toCalMap');
    ok(toCalMap.D, 'D toCalMap');
    ok(toCalMap.E, 'E toCalMap');
    ok(!toCalMap.F, 'F toCalMap');
    ok(!toCalMap.b, 'b toCalMap');
    ok(!toCalMap.c, 'c toCalMap');
    ok(!toCalMap['@'], '@ toCalMap');
    ok(!toCalMap.f, 'f toCalMap');
    ok(!toCalMap[''], "'' toCalMap");
  });
});

describe('Sedra', () => {
  const mapCallback = () => '';

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;

  describe('To CAL with invalid callBack returning empty', () => {
    it('General case usage', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = '';
      const vocalisedExpected = '';
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
  });
});

describe('Sedra', () => {
  const mapCallback = () => 1;

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;

  describe('To CAL with invalid callBack returning non-string', () => {
    it('General case usage', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = '11111';
      const vocalisedExpected = '111111111';
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
  });
});

describe('Sedra', () => {
  const mapCallback = () =>
    Object.create(null, {
      length: { value: -1 },
      toString: { value: () => '' }
    });

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;

  describe('To CAL with invalid callBack returning negative length', () => {
    it('General case usage', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = '';
      const vocalisedExpected = '';
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
  });
});

describe('Sedra', () => {
  const mapCallback = () => {};

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;

  describe('To CAL with invalid callBack returning nothing', () => {
    it('General case usage', () => {
      const word = toCal('LADNH');
      const vocalised = toCal("LMeT,B'aE");
      const wordExpected = '';
      const vocalisedExpected = '';
      strictEqual(word, wordExpected, 'toCal_generic consonant');
      strictEqual(vocalised, vocalisedExpected, 'toCal_generic vocalised');
    });
  });
});

describe('Sedra', () => {
  const mapCallback = (word, i) => word[i];
  const peculiarWord = {
    length: -1,
    toString: () => ''
  };

  const mapper = new Mapper(fromSedraWriting, toCalWriting, mapCallback);
  const toCal = mapper.map;

  describe('To CAL with peculiar negative length word', () => {
    it('General case usage', () => {
      const word = toCal(peculiarWord);
      const wordExpected = '';
      strictEqual(word, wordExpected, 'toCal_generic peculiar word object');
    });
  });
});

describe('No Diacritics path', () => {
  const fromWriting = new Writing(consonants, vowels);
  const toWriting = new Writing(calConsonants, vowels);
  const mapper = new Mapper(fromWriting, toWriting);
  it('Check Lengths', () => {
    strictEqual(
      mapper.fromWriting.consonants.length,
      mapper.toWriting.consonants.length,
      'consonant length'
    );
    strictEqual(
      mapper.fromWriting.vowels.length,
      mapper.toWriting.vowels.length,
      'vowel length'
    );
  });
});

describe('Sedra', () => {
  const isDotted = hasDotting(isDotting);
  describe('isDotted', () => {
    it('Check consonantal and vocalised', () => {
      const word = 'DXSR;A-DI;L;IOS';
      const wordDotted = isDotted(word);
      const vocalisedDotted = isDotted("D'XeSaRi;aA-D,I,i;Li;I'oOS");
      strictEqual(wordDotted, false, 'isDotted consonant only');
      strictEqual(vocalisedDotted, true, 'isDotted vocalised');
    });
    it('Word with (wu) => (uO) mapping', () => {
      const word = isDotted('LBELDBB;CON');
      const wordExpected = false;
      const vocalised = isDotted("LaB,EeLD'B,oB,a;C'uON");
      const vocalisedExpected = true;
      strictEqual(word, wordExpected, 'isDotted_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'isDotted_wu vocalised');
    });
    it('Blank word returns blank', () => {
      const word = isDotted('');
      const expected = false;
      strictEqual(word, expected, 'isDotted_blank');
    });
  });
});

describe('Sedra', () => {
  const removeDotting = clearDotting(isDotting);
  describe('clearDotting', () => {
    it('Check consonantal and vocalised', () => {
      const word = 'DXSR;A-DI;L;IOS';
      const expected = removeDotting(word);
      const vocalised = removeDotting("D'XeSaRi;aA-D,I,i;Li;I'oOS");
      strictEqual(word, expected, 'clearDotting consonant only');
      strictEqual(vocalised, expected, 'clearDotting vocalised');
    });
    it('Word with (wu) => (uO) mapping', () => {
      const word = removeDotting('LBELDBB;CON');
      const wordExpected = 'LBELDBB;CON';
      const vocalised = removeDotting("LaB,EeLD'B,oB,a;C'uON");
      const vocalisedExpected = wordExpected;
      strictEqual(word, wordExpected, 'clearDotting_wu consonant');
      strictEqual(vocalised, vocalisedExpected, 'clearDotting_wu vocalised');
    });
    it('Blank word returns blank', () => {
      const word = removeDotting('');
      const wordExpected = '';
      strictEqual(word, wordExpected, 'clearDotting_blank');
    });
  });
});

describe('Sedra', () => {
  const sort = getSort(letterAsciiMap, isConsonant);

  describe('getSort', () => {
    it('(null, word)', () => {
      const nullWord = null;
      const word = 'DXSR;A-DI;L;IOS';
      const expected = sort(nullWord, word);
      strictEqual(-1, expected, 'getSort (null, word)');
    });
    it('(word, null)', () => {
      const word = 'DXSR;A-DI;L;IOS';
      const nullWord = null;
      const expected = sort(word, nullWord);
      strictEqual(1, expected, 'getSort (word, null)');
    });
    it('(null, null)', () => {
      const word = null;
      const nullWord = null;
      const expected = sort(word, nullWord);
      strictEqual(0, expected, 'getSort (null, null)');
    });
    it('(word, wordVocalized)', () => {
      const word = 'DXSR;A-DI;L;IOS';
      const vocalised = "D'XeSaRi;aA-D,I,i;Li;I'oOS";
      const expected = sort(word, vocalised);
      strictEqual(-1, expected, 'getSort vocalised');
    });
    it('Consonant only great sort', () => {
      const word1 = 'LBELDBB;CON';
      const word2 = 'DXSR;A-DI;L;IOS';
      const expected = sort(word1, word2);
      strictEqual(1, expected, 'getSort');
    });
    it('Consonant only less sort', () => {
      const word1 = 'DXSR;A-DI;L;IOS';
      const word2 = 'LBELDBB;CON';
      const expected = sort(word1, word2);
      strictEqual(-1, expected, 'getSort');
    });
    it('Consonant only equal sort', () => {
      const word1 = 'DXSR;A-DI;L;IOS';
      const word2 = 'DXSR;A-DI;L;IOS';
      const expected = sort(word1, word2);
      strictEqual(0, expected, 'getSort');
    });
    it('Blank word returns blank', () => {
      const word = sort('');
      const wordExpected = '';
      strictEqual(word, sort(0, wordExpected), 'getSort_blank');
    });
  });
});
