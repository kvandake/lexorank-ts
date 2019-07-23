import LexoInteger from './lexoInteger';
import { ILexoNumeralSystem } from './numeralSystems/lexoNumeralSystem';
import StringBuilder from './utils/stringBuilder';

class LexoDecimal {
  public static half(sys: ILexoNumeralSystem): LexoDecimal {
    const mid: number = (sys.getBase() / 2) | 0;
    return LexoDecimal.make(LexoInteger.make(sys, 1, [mid]), 1);
  }

  public static parse(str: string, system: ILexoNumeralSystem): LexoDecimal {
    const partialIndex = str.indexOf(system.getRadixPointChar());
    if (str.lastIndexOf(system.getRadixPointChar()) !== partialIndex) {
      throw new Error('More than one ' + system.getRadixPointChar());
    }

    if (partialIndex < 0) {
      return LexoDecimal.make(LexoInteger.parse(str, system), 0);
    }

    const intStr = str.substring(0, partialIndex) + str.substring(partialIndex + 1);
    return LexoDecimal.make(LexoInteger.parse(intStr, system), str.length - 1 - partialIndex);
  }

  public static from(integer: LexoInteger): LexoDecimal {
    return LexoDecimal.make(integer, 0);
  }

  public static make(integer: LexoInteger, sig: number): LexoDecimal {
    if (integer.isZero()) {
      return new LexoDecimal(integer, 0);
    }

    let zeroCount = 0;
    for (let i: number = 0; i < sig && integer.getMag(i) === 0; ++i) {
      ++zeroCount;
    }

    const newInteger = integer.shiftRight(zeroCount);
    const newSig = sig - zeroCount;
    return new LexoDecimal(newInteger, newSig);
  }
  private readonly mag: LexoInteger;
  private readonly sig: number;

  private constructor(mag: LexoInteger, sig: number) {
    this.mag = mag;
    this.sig = sig;
  }

  public getSystem(): ILexoNumeralSystem {
    return this.mag.getSystem();
  }

  public add(other: LexoDecimal): LexoDecimal {
    let tmag = this.mag;
    let tsig = this.sig;
    let omag = other.mag;
    let osig: number;
    for (osig = other.sig; tsig < osig; ++tsig) {
      tmag = tmag.shiftLeft();
    }

    while (tsig > osig) {
      omag = omag.shiftLeft();
      ++osig;
    }

    return LexoDecimal.make(tmag.add(omag), tsig);
  }

  public subtract(other: LexoDecimal): LexoDecimal {
    let thisMag = this.mag;
    let thisSig = this.sig;
    let otherMag = other.mag;
    let otherSig: number;
    for (otherSig = other.sig; thisSig < otherSig; ++thisSig) {
      thisMag = thisMag.shiftLeft();
    }

    while (thisSig > otherSig) {
      otherMag = otherMag.shiftLeft();
      ++otherSig;
    }

    return LexoDecimal.make(thisMag.subtract(otherMag), thisSig);
  }

  public multiply(other: LexoDecimal): LexoDecimal {
    return LexoDecimal.make(this.mag.multiply(other.mag), this.sig + other.sig);
  }

  public floor(): LexoInteger {
    return this.mag.shiftRight(this.sig);
  }

  public ceil(): LexoInteger {
    if (this.isExact()) {
      return this.mag;
    }

    const floor = this.floor();
    return floor.add(LexoInteger.one(floor.getSystem()));
  }

  public isExact(): boolean {
    if (this.sig === 0) {
      return true;
    }

    for (let i: number = 0; i < this.sig; ++i) {
      if (this.mag.getMag(i) !== 0) {
        return false;
      }
    }

    return true;
  }

  public getScale(): number {
    return this.sig;
  }

  public setScale(nsig: number, ceiling: boolean = false): LexoDecimal {
    if (nsig >= this.sig) {
      return this;
    }

    if (nsig < 0) {
      nsig = 0;
    }

    const diff = this.sig - nsig;
    let nmag = this.mag.shiftRight(diff);
    if (ceiling) {
      nmag = nmag.add(LexoInteger.one(nmag.getSystem()));
    }

    return LexoDecimal.make(nmag, nsig);
  }

  public compareTo(other: LexoDecimal): number {
    if (this === other) {
      return 0;
    }

    if (!other) {
      return 1;
    }

    let tMag = this.mag;
    let oMag = other.mag;
    if (this.sig > other.sig) {
      oMag = oMag.shiftLeft(this.sig - other.sig);
    } else if (this.sig < other.sig) {
      tMag = tMag.shiftLeft(other.sig - this.sig);
    }
    return tMag.compareTo(oMag);
  }

  public format(): string {
    const intStr = this.mag.format();
    if (this.sig === 0) {
      return intStr;
    }

    const sb = new StringBuilder(intStr);
    const head = sb[0];
    const specialHead =
      head === this.mag.getSystem().getPositiveChar() || head === this.mag.getSystem().getNegativeChar();

    if (specialHead) {
      sb.remove(0, 1);
    }

    while (sb.length < this.sig + 1) {
      sb.insert(0, this.mag.getSystem().toChar(0));
    }

    sb.insert(sb.length - this.sig, this.mag.getSystem().getRadixPointChar());

    if (sb.length - this.sig === 0) {
      sb.insert(0, this.mag.getSystem().toChar(0));
    }

    if (specialHead) {
      sb.insert(0, head);
    }

    return sb.toString();
  }

  public equals(other: LexoDecimal): boolean {
    if (this === other) {
      return true;
    }

    if (!other) {
      return false;
    }

    return this.mag.equals(other.mag) && this.sig === other.sig;
  }

  public toString(): string {
    return this.format();
  }
}

export default LexoDecimal;
