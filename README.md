# aramaic-mapper

[![npm version](https://badge.fury.io/js/aramaic-mapper.svg)](https://badge.fury.io/js/aramaic-mapper)
[![npm module downloads](http://img.shields.io/npm/dt/aramaic-mapper.svg)](https://www.npmjs.org/package/aramaic-mapper)
[![Build Status](https://travis-ci.org/peshitta/aramaic-mapper.svg?branch=master)](https://travis-ci.org/peshitta/aramaic-mapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/peshitta/aramaic-mapper/blob/master/LICENSE)
[![Dependency Status](https://david-dm.org/peshitta/aramaic-mapper.svg)](https://david-dm.org/peshitta/aramaic-mapper)
[![Coverage Status](https://coveralls.io/repos/github/peshitta/aramaic-mapper/badge.svg?branch=master)](https://coveralls.io/github/peshitta/aramaic-mapper?branch=master)
[![Gitter](https://badges.gitter.im/peshitta/peshitta.svg "Join the chat at https://gitter.im/peshitta/Lobby")](https://gitter.im/peshitta/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Generic support for mapping between Aramaic writing systems

## Installation

In order to use this library, [Node.js](https://nodejs.org) should be installed. 
Then run:
```
npm install aramaic-mapper --save
```

Following bundles are available:
* `aramaic-mapper.js` - UMD ES5 version for use in browser, node, etc.
* `aramaic-mapper.min.js` - minified version of `aramaic-mapper.js`
* `aramaic-mapper.esm.js` - ES6 module version, suitable for bundling with other 
libraries and applications

The package could also be downloaded directly from:
[https://registry.npmjs.org/aramaic-mapper/-/aramaic-mapper-1.1.5.tgz](https://registry.npmjs.org/aramaic-mapper/-/aramaic-mapper-1.1.5.tgz)

## More information

[Peshitta App](https://peshitta.github.io)

[Beth Mardutho](https://sedra.bethmardutho.org/about/fonts)

[CAL](http://cal1.cn.huc.edu/searching/fullbrowser.html)

## License

[MIT](https://github.com/peshitta/aramaic-mapper/blob/master/LICENSE)

## Contributing

The final goal for this work is to learn the Word of God as recorded by
[Peshitta](https://en.wikipedia.org/wiki/Peshitta).
You are welcomed to improve this implementation or provide feedback. Please
feel free to [Fork](https://help.github.com/articles/fork-a-repo/), create a
[Pull Request](https://help.github.com/articles/about-pull-requests/) or
submit [Issues](https://github.com/peshitta/aramaic-mapper/issues).

To read quick updates about Peshitta app or post questions or feedback, follow
[@peshittap](https://www.twitter.com/peshittap)
at [![@peshittap](http://i.imgur.com/wWzX9uB.png "@peshittap")](https://www.twitter.com/peshittap)or
[![Gitter](https://badges.gitter.im/peshitta/peshitta.svg "Join the chat at https://gitter.im/peshitta/Lobby")](https://gitter.im/peshitta/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Development

```
npm install
```
```
npm run build
```

## API Reference

* [aramaicMapper](#module_aramaicMapper)
    * [.Writing](#module_aramaicMapper.Writing)
        * [new Writing(consonants, vowels, diacritics, punctuation, other)](#new_module_aramaicMapper.Writing_new)
    * [.Mapper](#module_aramaicMapper.Mapper)
        * [new Mapper(fromWriting, toWriting, mapCallback)](#new_module_aramaicMapper.Mapper_new)
        * [.fromWriting](#module_aramaicMapper.Mapper+fromWriting) : <code>Writing</code>
        * [.toWriting](#module_aramaicMapper.Mapper+toWriting) : <code>Writing</code>
        * [.fromTo](#module_aramaicMapper.Mapper+fromTo) : <code>Object.&lt;string, string&gt;</code>
        * [.multiples](#module_aramaicMapper.Mapper+multiples) : <code>Array.&lt;string&gt;</code>
        * [.map(word, wordProps)](#module_aramaicMapper.Mapper+map) ⇒ <code>string</code>
    * [.hasDotting(isDotting)](#module_aramaicMapper.hasDotting) ⇒ <code>function</code>
    * [.clearDotting(isDotting)](#module_aramaicMapper.clearDotting) ⇒ <code>function</code>
    * [.getSort(letterAsciiMap, isConsonant)](#module_aramaicMapper.getSort) ⇒ <code>function</code>
    * [.mapCallback](#module_aramaicMapper.mapCallback) ⇒ <code>string</code>

<a name="module_aramaicMapper.Writing"></a>

### aramaicMapper.Writing
Tuple for storing an Aramaic writing system:
* Consonants are expected to be in the standard Aramaic order.
* Vowels are expected to be in the Sedra [ a o e i u ] order + optional
  Eastern/Hebrew short E and long O in positions 6 and 7 respectively.
* Diacritics, if provided, should follow Sedra [' , _  *] order. They are
  Qushaya, Rukkakha, Linea Occultans and Seyame respectively.
  Other diacritics like verb and homograph dots or Hebrew Sheva, if
  supported, should be added after the above.
* Optionally punctuation and other characters could be added for mapping.

The main idea is that each mapped character should be in the same
position in the _to_ Writing system as the _from_ Writing system.

**Kind**: static class of [<code>aramaicMapper</code>](#module_aramaicMapper)  
<a name="new_module_aramaicMapper.Writing_new"></a>

#### new Writing(consonants, vowels, diacritics, punctuation, other)

| Param | Type | Description |
| --- | --- | --- |
| consonants | <code>Array.&lt;string&gt;</code> | consonant list in the standard aramaic order |
| vowels | <code>Array.&lt;string&gt;</code> | vowel list in the Sedra order |
| diacritics | <code>Array.&lt;string&gt;</code> | optional diacritics list in the Sedra order |
| punctuation | <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | optional punctuation list |
| other | <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | optional other symbols like crosses, etc. |

<a name="module_aramaicMapper.Mapper"></a>

### aramaicMapper.Mapper
Map from a base writing system to another system.
The optional `mapCallback` when called will be provided following arguments:
* word - the word to be mapped
* index - index of the current character to be mapped
* fromTo - character mapping hash from base Writing to mapped Writing

`mapCallback` needs to be provided only when the simple one to one mapping
between writing systems is not enough, and custom mapping needs to be
implemented instead.

**Kind**: static class of [<code>aramaicMapper</code>](#module_aramaicMapper)  

* [.Mapper](#module_aramaicMapper.Mapper)
    * [new Mapper(fromWriting, toWriting, mapCallback)](#new_module_aramaicMapper.Mapper_new)
    * [.fromWriting](#module_aramaicMapper.Mapper+fromWriting) : <code>Writing</code>
    * [.toWriting](#module_aramaicMapper.Mapper+toWriting) : <code>Writing</code>
    * [.fromTo](#module_aramaicMapper.Mapper+fromTo) : <code>Object.&lt;string, string&gt;</code>
    * [.multiples](#module_aramaicMapper.Mapper+multiples) : <code>Array.&lt;string&gt;</code>
    * [.map(word, wordProps)](#module_aramaicMapper.Mapper+map) ⇒ <code>string</code>

<a name="new_module_aramaicMapper.Mapper_new"></a>

#### new Mapper(fromWriting, toWriting, mapCallback)

| Param | Type | Description |
| --- | --- | --- |
| fromWriting | <code>Writing</code> | base writing system |
| toWriting | <code>Writing</code> | writing system to map to |
| mapCallback | <code>mapCallback</code> \| <code>undefined</code> | optional map callback |

<a name="module_aramaicMapper.Mapper+fromWriting"></a>

#### mapper.fromWriting : <code>Writing</code>
Source writing system to be mapped

**Kind**: instance property of [<code>Mapper</code>](#module_aramaicMapper.Mapper)  
<a name="module_aramaicMapper.Mapper+toWriting"></a>

#### mapper.toWriting : <code>Writing</code>
Destination writing system to map to

**Kind**: instance property of [<code>Mapper</code>](#module_aramaicMapper.Mapper)  
<a name="module_aramaicMapper.Mapper+fromTo"></a>

#### mapper.fromTo : <code>Object.&lt;string, string&gt;</code>
Character mapping hash from base Writing to mapped Writing

**Kind**: instance property of [<code>Mapper</code>](#module_aramaicMapper.Mapper)  
<a name="module_aramaicMapper.Mapper+multiples"></a>

#### mapper.multiples : <code>Array.&lt;string&gt;</code>
Mapped multiple char sequences that map to a single `fromWriting` char.
Used to move only 1 character ahead, instead of length of mapped string.

**Kind**: instance property of [<code>Mapper</code>](#module_aramaicMapper.Mapper)  
<a name="module_aramaicMapper.Mapper+map"></a>

#### mapper.map(word, wordProps) ⇒ <code>string</code>
Map word from a base writing system to another system

**Kind**: instance method of [<code>Mapper</code>](#module_aramaicMapper.Mapper)  
**Returns**: <code>string</code> - mapped word  

| Param | Type | Description |
| --- | --- | --- |
| word | <code>string</code> | input word to be mapped |
| wordProps | <code>Object</code> | optional word settings - to be passed to callback |

<a name="module_aramaicMapper.hasDotting"></a>

### aramaicMapper.hasDotting(isDotting) ⇒ <code>function</code>
Returns function which returns true if input word has vowels or diacritics.

**Kind**: static method of [<code>aramaicMapper</code>](#module_aramaicMapper)  
**Returns**: <code>function</code> - hasDotting (word => boolean) function logic  

| Param | Type | Description |
| --- | --- | --- |
| isDotting | <code>function</code> | (char => boolean) which checks if char is dotting |

<a name="module_aramaicMapper.clearDotting"></a>

### aramaicMapper.clearDotting(isDotting) ⇒ <code>function</code>
Returns a function to remove vowels and diacritics and keep the consonantal
skeleton only.

**Kind**: static method of [<code>aramaicMapper</code>](#module_aramaicMapper)  
**Returns**: <code>function</code> - clearDotting (word => word) function logic  

| Param | Type | Description |
| --- | --- | --- |
| isDotting | <code>function</code> | (char => boolean) which checks if char is dotting |

<a name="module_aramaicMapper.getSort"></a>

### aramaicMapper.getSort(letterAsciiMap, isConsonant) ⇒ <code>function</code>
Returns a function to be used for sorting words using the provided `letterAsciiMap`

**Kind**: static method of [<code>aramaicMapper</code>](#module_aramaicMapper)  
**Returns**: <code>function</code> - ((word1, word2) => number) function implementation  

| Param | Type | Description |
| --- | --- | --- |
| letterAsciiMap | <code>Object.&lt;string, string&gt;</code> | letter to ASCII value map |
| isConsonant | <code>function</code> | (char => boolean) Is character c a consonant |

<a name="module_aramaicMapper.mapCallback"></a>

### aramaicMapper.mapCallback ⇒ <code>string</code>
**Kind**: static typedef of [<code>aramaicMapper</code>](#module_aramaicMapper)  
**Returns**: <code>string</code> - the mapped string for c - could be longer than one
character  

| Param | Type | Description |
| --- | --- | --- |
| word | <code>string</code> | input word to be mapped |
| index | <code>number</code> | index of the current character to be mapped |
| fromTo | <code>Object.&lt;string, string&gt;</code> | character mapping hash from |
| wordProps | <code>Object</code> | optional word properties hash base Writing to mapped Writing |

