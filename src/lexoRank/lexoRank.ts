import { LexoDecimal } from './lexoDecimal';
import LexoRankBucket from './lexoRankBucket';
import StringBuilder from '../utils/stringBuilder';
import { LexoNumeralSystem36 } from '../numeralSystems';

export class LexoRank {
  public static get NUMERAL_SYSTEM() {
    if (!this._NUMERAL_SYSTEM) {
      this._NUMERAL_SYSTEM = new LexoNumeralSystem36();
    }
    return this._NUMERAL_SYSTEM;
  }

  private static get ZERO_DECIMAL(): LexoDecimal {
    if (!this._ZERO_DECIMAL) {
      this._ZERO_DECIMAL = LexoDecimal.parse('0', LexoRank.NUMERAL_SYSTEM);
    }

    return this._ZERO_DECIMAL;
  }

  private static get ONE_DECIMAL(): LexoDecimal {
    if (!this._ONE_DECIMAL) {
      this._ONE_DECIMAL = LexoDecimal.parse('1', LexoRank.NUMERAL_SYSTEM);
    }

    return this._ONE_DECIMAL;
  }

  private static get EIGHT_DECIMAL(): LexoDecimal {
    if (!this._EIGHT_DECIMAL) {
      this._EIGHT_DECIMAL = LexoDecimal.parse('8', LexoRank.NUMERAL_SYSTEM);
    }

    return this._EIGHT_DECIMAL;
  }

  private static get MIN_DECIMAL(): LexoDecimal {
    if (!this._MIN_DECIMAL) {
      this._MIN_DECIMAL = LexoRank.ZERO_DECIMAL;
    }

    return this._MIN_DECIMAL;
  }

  private static get MAX_DECIMAL(): LexoDecimal {
    if (!this._MAX_DECIMAL) {
      this._MAX_DECIMAL = LexoDecimal.parse('1000000', LexoRank.NUMERAL_SYSTEM).subtract(LexoRank.ONE_DECIMAL);
    }

    return this._MAX_DECIMAL;
  }

  private static get MID_DECIMAL(): LexoDecimal {
    if (!this._MID_DECIMAL) {
      this._MID_DECIMAL = LexoRank.between(LexoRank.MIN_DECIMAL, LexoRank.MAX_DECIMAL);
    }

    return this._MID_DECIMAL;
  }

  private static get INITIAL_MIN_DECIMAL(): LexoDecimal {
    if (!this._INITIAL_MIN_DECIMAL) {
      this._INITIAL_MIN_DECIMAL = LexoDecimal.parse('100000', LexoRank.NUMERAL_SYSTEM);
    }

    return this._INITIAL_MIN_DECIMAL;
  }

  private static get INITIAL_MAX_DECIMAL(): LexoDecimal {
    if (!this._INITIAL_MAX_DECIMAL) {
      this._INITIAL_MAX_DECIMAL = LexoDecimal.parse(
        LexoRank.NUMERAL_SYSTEM.toChar(LexoRank.NUMERAL_SYSTEM.getBase() - 2) + '00000',
        LexoRank.NUMERAL_SYSTEM,
      );
    }

    return this._INITIAL_MAX_DECIMAL;
  }

  public static min(): LexoRank {
    return LexoRank.from(LexoRankBucket.BUCKET_0, LexoRank.MIN_DECIMAL);
  }

  public static middle(): LexoRank {
    const minLexoRank = LexoRank.min();
    return minLexoRank.between(LexoRank.max(minLexoRank.bucket));
  }

  public static max(bucket: LexoRankBucket = LexoRankBucket.BUCKET_0): LexoRank {
    return LexoRank.from(bucket, LexoRank.MAX_DECIMAL);
  }

  public static initial(bucket: LexoRankBucket): LexoRank {
    return bucket === LexoRankBucket.BUCKET_0
      ? LexoRank.from(bucket, LexoRank.INITIAL_MIN_DECIMAL)
      : LexoRank.from(bucket, LexoRank.INITIAL_MAX_DECIMAL);
  }

  public static between(oLeft: LexoDecimal, oRight: LexoDecimal): LexoDecimal {
    if (oLeft.getSystem().getBase() !== oRight.getSystem().getBase()) {
      throw new Error('Expected same system');
    }

    let left = oLeft;
    let right = oRight;
    let nLeft: LexoDecimal;
    if (oLeft.getScale() < oRight.getScale()) {
      nLeft = oRight.setScale(oLeft.getScale(), false);
      if (oLeft.compareTo(nLeft) >= 0) {
        return LexoRank.mid(oLeft, oRight);
      }

      right = nLeft;
    }

    if (oLeft.getScale() > right.getScale()) {
      nLeft = oLeft.setScale(right.getScale(), true);
      if (nLeft.compareTo(right) >= 0) {
        return LexoRank.mid(oLeft, oRight);
      }

      left = nLeft;
    }

    let nRight: LexoDecimal;
    for (let scale = left.getScale(); scale > 0; right = nRight) {
      const nScale1 = scale - 1;
      const nLeft1 = left.setScale(nScale1, true);
      nRight = right.setScale(nScale1, false);
      const cmp = nLeft1.compareTo(nRight);
      if (cmp === 0) {
        return LexoRank.checkMid(oLeft, oRight, nLeft1);
      }
      if (nLeft1.compareTo(nRight) > 0) {
        break;
      }

      scale = nScale1;
      left = nLeft1;
    }

    let mid = LexoRank.middleInternal(oLeft, oRight, left, right);

    let nScale: number;
    for (let mScale = mid.getScale(); mScale > 0; mScale = nScale) {
      nScale = mScale - 1;
      const nMid = mid.setScale(nScale);
      if (oLeft.compareTo(nMid) >= 0 || nMid.compareTo(oRight) >= 0) {
        break;
      }

      mid = nMid;
    }

    return mid;
  }

  public static parse(str: string): LexoRank {
    const parts = str.split('|');
    const bucket = LexoRankBucket.from(parts[0]);
    const decimal = LexoDecimal.parse(parts[1], LexoRank.NUMERAL_SYSTEM);
    return new LexoRank(bucket, decimal);
  }

  public static from(bucket: LexoRankBucket, decimal: LexoDecimal): LexoRank {
    if (decimal.getSystem().getBase() !== LexoRank.NUMERAL_SYSTEM.getBase()) {
      throw new Error('Expected different system');
    }

    return new LexoRank(bucket, decimal);
  }

  private static _NUMERAL_SYSTEM;

  private static _ZERO_DECIMAL;

  private static _ONE_DECIMAL;

  private static _EIGHT_DECIMAL;

  private static _MIN_DECIMAL;

  private static _MAX_DECIMAL;

  private static _MID_DECIMAL;

  private static _INITIAL_MIN_DECIMAL;

  private static _INITIAL_MAX_DECIMAL;

  private static middleInternal(
    lbound: LexoDecimal,
    rbound: LexoDecimal,
    left: LexoDecimal,
    right: LexoDecimal,
  ): LexoDecimal {
    const mid = LexoRank.mid(left, right);
    return LexoRank.checkMid(lbound, rbound, mid);
  }

  private static checkMid(lbound: LexoDecimal, rbound: LexoDecimal, mid: LexoDecimal): LexoDecimal {
    if (lbound.compareTo(mid) >= 0) {
      return LexoRank.mid(lbound, rbound);
    }

    return mid.compareTo(rbound) >= 0 ? LexoRank.mid(lbound, rbound) : mid;
  }

  private static mid(left: LexoDecimal, right: LexoDecimal): LexoDecimal {
    const sum = left.add(right);
    const mid = sum.multiply(LexoDecimal.half(left.getSystem()));
    const scale = left.getScale() > right.getScale() ? left.getScale() : right.getScale();
    if (mid.getScale() > scale) {
      const roundDown = mid.setScale(scale, false);
      if (roundDown.compareTo(left) > 0) {
        return roundDown;
      }
      const roundUp = mid.setScale(scale, true);
      if (roundUp.compareTo(right) < 0) {
        return roundUp;
      }
    }
    return mid;
  }

  private static formatDecimal(decimal: LexoDecimal): string {
    const formatVal = decimal.format();
    const val = new StringBuilder(formatVal);
    let partialIndex = formatVal.indexOf(LexoRank.NUMERAL_SYSTEM.getRadixPointChar());
    const zero = LexoRank.NUMERAL_SYSTEM.toChar(0);
    if (partialIndex < 0) {
      partialIndex = formatVal.length;
      val.append(LexoRank.NUMERAL_SYSTEM.getRadixPointChar());
    }

    while (partialIndex < 6) {
      val.insert(0, zero);
      ++partialIndex;
    }

    while (val[val.length - 1] === zero) {
      val.length = val.length - 1;
    }

    return val.toString();
  }

  private readonly value: string;
  private readonly bucket: LexoRankBucket;
  private readonly decimal: LexoDecimal;

  public constructor(bucket: LexoRankBucket, decimal: LexoDecimal) {
    this.value = bucket.format() + '|' + LexoRank.formatDecimal(decimal);
    this.bucket = bucket;
    this.decimal = decimal;
  }

  public genPrev(): LexoRank {
    if (this.isMax()) {
      return new LexoRank(this.bucket, LexoRank.INITIAL_MAX_DECIMAL);
    }

    const floorInteger = this.decimal.floor();
    const floorDecimal = LexoDecimal.from(floorInteger);
    let nextDecimal = floorDecimal.subtract(LexoRank.EIGHT_DECIMAL);
    if (nextDecimal.compareTo(LexoRank.MIN_DECIMAL) <= 0) {
      nextDecimal = LexoRank.between(LexoRank.MIN_DECIMAL, this.decimal);
    }

    return new LexoRank(this.bucket, nextDecimal);
  }

  public genNext(): LexoRank {
    if (this.isMin()) {
      return new LexoRank(this.bucket, LexoRank.INITIAL_MIN_DECIMAL);
    }
    const ceilInteger = this.decimal.ceil();
    const ceilDecimal = LexoDecimal.from(ceilInteger);
    let nextDecimal = ceilDecimal.add(LexoRank.EIGHT_DECIMAL);
    if (nextDecimal.compareTo(LexoRank.MAX_DECIMAL) >= 0) {
      nextDecimal = LexoRank.between(this.decimal, LexoRank.MAX_DECIMAL);
    }

    return new LexoRank(this.bucket, nextDecimal);
  }

  public between(other: LexoRank): LexoRank {
    if (!this.bucket.equals(other.bucket)) {
      throw new Error('Between works only within the same bucket');
    }

    const cmp = this.decimal.compareTo(other.decimal);
    if (cmp > 0) {
      return new LexoRank(this.bucket, LexoRank.between(other.decimal, this.decimal));
    }

    if (cmp === 0) {
      throw new Error(
        'Try to rank between issues with same rank this=' +
        this +
        ' other=' +
        other +
        ' this.decimal=' +
        this.decimal +
        ' other.decimal=' +
        other.decimal,
      );
    }

    return new LexoRank(this.bucket, LexoRank.between(this.decimal, other.decimal));
  }

  public getBucket(): LexoRankBucket {
    return this.bucket;
  }

  public getDecimal(): LexoDecimal {
    return this.decimal;
  }

  public inNextBucket(): LexoRank {
    return LexoRank.from(this.bucket.next(), this.decimal);
  }

  public inPrevBucket(): LexoRank {
    return LexoRank.from(this.bucket.prev(), this.decimal);
  }

  public isMin(): boolean {
    return this.decimal.equals(LexoRank.MIN_DECIMAL);
  }

  public isMax(): boolean {
    return this.decimal.equals(LexoRank.MAX_DECIMAL);
  }

  public format(): string {
    return this.value;
  }

  public equals(other: LexoRank): boolean {
    if (this === other) {
      return true;
    }

    if (!other) {
      return false;
    }

    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public compareTo(other: LexoRank): number {
    if (this === other) {
      return 0;
    }

    if (!other) {
      return 1;
    }

    return this.value.localeCompare(other.value);
  }
}
