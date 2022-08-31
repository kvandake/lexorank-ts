# LexoRank on Typescript
A reference implementation of a list ordering system like [JIRA's Lexorank algorithm](https://www.youtube.com/watch?v=OjQv9xMoFbg).

[![npm version](https://badge.fury.io/js/lexorank.svg)](https://badge.fury.io/js/lexorank)

## Getting Started

Npm
```sh
npm install lexorank
```

Yarn
```sh
yarn add lexorank
```

## Storyboard
[See examples](https://630e298cd63179cde4d8775c-bensuqejhp.chromatic.com/?path=/story/dnd-kit--dnd-kit-list-story)

## Using

### Static methods


```typescript
import {LexoRank} from "lexorank";

// min
const minLexoRank = LexoRank.min();
// max
const maxLexoRank = LexoRank.max();
// middle
const middleLexoRank = LexoRank.middle();
// parse
const parsedLexoRank = LexoRank.parse('0|0i0000:');
```

### Public methods

```typescript
import {LexoRank} from "lexorank";

// any lexoRank
const lexoRank = LexoRank.middle();

// generate next lexorank
const nextLexoRank = lexoRank.genNext();

// generate previous lexorank
const prevLexoRank = lexoRank.genPrev();

// toString
const lexoRankStr = lexoRank.toString();
```

### Calculate LexoRank

LexRank calculation based on existing LexoRanks.
```typescript
import {LexoRank} from "lexorank";

// any lexorank
const any1LexoRank = LexoRank.min();
// another lexorank
const any2LexoRank = any1LexoRank.genNext().genNext();
// calculate between
const betweenLexoRank = any1LexoRank.between(any2LexoRank);
```

## Related projects
- [LexoRank on C#](https://github.com/kvandake/lexorank-dotnet)

## Licence
MIT

---
**I have not found information about the license of the algorithm LexoRank. 
If the rights are violated, please contact me to correct the current license.**
