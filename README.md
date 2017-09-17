# aramaic-mapper

[![npm version](https://badge.fury.io/js/aramaic-mapper.svg)](https://badge.fury.io/js/aramaic-mapper)
[![npm module downloads](http://img.shields.io/npm/dt/aramaic-mapper.svg)](https://www.npmjs.org/package/aramaic-mapper)
[![Build Status](https://travis-ci.org/peshitta/aramaic-mapper.svg?branch=master)](https://travis-ci.org/peshitta/aramaic-mapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/peshitta/aramaic-mapper/blob/master/LICENSE)
[![Dependency Status](https://david-dm.org/peshitta/aramaic-mapper.svg)](https://david-dm.org/peshitta/aramaic-mapper)
[![devDependencies Status](https://david-dm.org/peshitta/aramaic-mapper/dev-status.svg)](https://david-dm.org/peshitta/aramaic-mapper?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/peshitta/aramaic-mapper/badge.svg?branch=master)](https://coveralls.io/github/peshitta/aramaic-mapper?branch=master)

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
[https://registry.npmjs.org/aramaic-mapper/-/aramaic-mapper-1.0.2.tgz](https://registry.npmjs.org/aramaic-mapper/-/aramaic-mapper-1.0.2.tgz)

## More information

[Peshitta App](https://peshitta.github.io)

[Beth Mardutho](https://sedra.bethmardutho.org/about/fonts)

[CAL](http://cal1.cn.huc.edu/searching/fullbrowser.html)

## License

[MIT](https://github.com/peshitta/aramaic-mapper/blob/master/LICENSE)

## Contributing

The final goal for this work is to learn the Word of God as recorded by
[Peshitta](https://en.wikipedia.org/wiki/Peshitta).
You are welcomed to to improve this implementation or provide feedback. Please
feel free to [Fork](https://help.github.com/articles/fork-a-repo/), create a
[Pull Request](https://help.github.com/articles/about-pull-requests/) or
submit [Issues](https://github.com/peshitta/aramaic-mapper/issues).
Thank you!

## Development

```
npm install
```
```
npm run build
```

## API Reference

* [aramaic](#module_aramaic)
    * [.Writing](#module_aramaic.Writing)
        * [new Writing(consonants, vowels, diacritics, punctuation, other)](#new_module_aramaic.Writing_new)
    * [.Mapper](#module_aramaic.Mapper)
        * [new Mapper(fromWriting, toWriting, mapCallback)](#new_module_aramaic.Mapper_new)

<a name="module_aramaic.Writing"></a>

### aramaic.Writing
Tuple for storing an Aramaic writing system:
* Consonants are expected to be in the standard Aramaic order.
* Vowels are expected to be in the Sedra [ a o e i u ] order + optional
  Eastern/Hebrew short E and long O in positions 6 and 7 respectively.
* Diacritics must also follow Sedra [' , _  *] order. They are Qushaya,
  Rukkakha, Linea Occultans and Seyame respectively.
  Other diacritics like verb and homograph dots or Hebrew Sheva, if
  supported, should be added after the above.
* Optionally punctuation and other characters could be added for mapping.

The main idea is that each mapped character should be in the same
position in the _to_ Writing system as the _from_ Writing system.

**Kind**: static class of [<code>aramaic</code>](#module_aramaic)  
<a name="new_module_aramaic.Writing_new"></a>

#### new Writing(consonants, vowels, diacritics, punctuation, other)

| Param | Type | Description |
| --- | --- | --- |
| consonants | <code>Array.&lt;string&gt;</code> | consonant list in the standard aramaic order |
| vowels | <code>Array.&lt;string&gt;</code> | vowel list in the Sedra order |
| diacritics | <code>Array.&lt;string&gt;</code> | diacritics list in the Sedra order |
| punctuation | <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | optional punctuation list |
| other | <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | optional other symbols like crosses, etc. |

<a name="module_aramaic.Mapper"></a>

### aramaic.Mapper
Map from a base writing system to another system.
The optional `mapCallback` when called will be provided following arguments:
* word - the word to be mapped
* index - index of the current character to be mapped
* fromTo - character mapping hash from base Writing to mapped Writing

`mapCallback` needs to be provided only when the simple one to one mapping
between writing systems is not enough, and custom mapping needs to be
implemented instead.

**Kind**: static class of [<code>aramaic</code>](#module_aramaic)  
<a name="new_module_aramaic.Mapper_new"></a>

#### new Mapper(fromWriting, toWriting, mapCallback)

| Param | Type | Description |
| --- | --- | --- |
| fromWriting | <code>Writing</code> | base writing system |
| toWriting | <code>Writing</code> | writing system to map to |
| mapCallback | <code>function</code> \| <code>undefined</code> | optional map callback |

