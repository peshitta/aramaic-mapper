const { strictEqual, notStrictEqual, ok } = require('assert');
const { Writing, Mapper } = require('../build/aramaic-mapper');

const fromSedraWriting = new Writing(
  [
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
  ],
  ['a', 'o', 'e', 'i', 'u'],
  ["'", ',', '_', '*']
);
const toCalWriting = new Writing(
  [
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
  ],
  ['a', 'o', 'e', 'i', 'u', 'E', 'O'],
  ["'", ',', '_', '*']
);

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
    const isConsonant = ch => fromSedraWriting.consonants.includes(ch);
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
