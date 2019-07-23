import { LexoInteger } from './lexoInteger';
import { LexoRank } from './lexoRank';

class LexoRankBucket {
  public static get BUCKET_0(): LexoRankBucket {
    if (!this._BUCKET_0) {
      this._BUCKET_0 = new LexoRankBucket('0');
    }

    return this._BUCKET_0;
  }

  private static get BUCKET_1(): LexoRankBucket {
    if (!this._BUCKET_1) {
      this._BUCKET_1 = new LexoRankBucket('1');
    }

    return this._BUCKET_1;
  }

  private static get BUCKET_2(): LexoRankBucket {
    if (!this._BUCKET_2) {
      this._BUCKET_2 = new LexoRankBucket('2');
    }

    return this._BUCKET_2;
  }

  private static get VALUES(): LexoRankBucket[] {
    if (!this._VALUES) {
      this._VALUES = [LexoRankBucket.BUCKET_0, LexoRankBucket.BUCKET_1, LexoRankBucket.BUCKET_2];
    }

    return this._VALUES;
  }

  public static max(): LexoRankBucket {
    return LexoRankBucket.VALUES[LexoRankBucket.VALUES.length - 1];
  }

  public static from(str: string): LexoRankBucket {
    const val = LexoInteger.parse(str, LexoRank.NUMERAL_SYSTEM);
    const var2 = LexoRankBucket.VALUES;
    const var3 = var2.length;
    for (let var4 = 0; var4 < var3; ++var4) {
      const bucket = var2[var4];
      if (bucket.value.equals(val)) {
        return bucket;
      }
    }

    throw new Error('Unknown bucket: ' + str);
  }

  public static resolve(bucketId: number): LexoRankBucket {
    const var1 = LexoRankBucket.VALUES;
    const var2 = var1.length;
    for (let var3 = 0; var3 < var2; ++var3) {
      const bucket = var1[var3];
      if (bucket.equals(LexoRankBucket.from(bucketId.toString()))) {
        return bucket;
      }
    }

    throw new Error('No bucket found with id ' + bucketId);
  }

  private static _BUCKET_0;

  private static _BUCKET_1;

  private static _BUCKET_2;

  private static _VALUES;

  private readonly value: LexoInteger;

  private constructor(val: string) {
    this.value = LexoInteger.parse(val, LexoRank.NUMERAL_SYSTEM);
  }

  public format(): string {
    return this.value.format();
  }

  public next(): LexoRankBucket {
    if (this.equals(LexoRankBucket.BUCKET_0)) {
      return LexoRankBucket.BUCKET_1;
    }
    if (this.equals(LexoRankBucket.BUCKET_1)) {
      return LexoRankBucket.BUCKET_2;
    }
    return this.equals(LexoRankBucket.BUCKET_2) ? LexoRankBucket.BUCKET_0 : LexoRankBucket.BUCKET_2;
  }

  public prev(): LexoRankBucket {
    if (this.equals(LexoRankBucket.BUCKET_0)) {
      return LexoRankBucket.BUCKET_2;
    }
    if (this.equals(LexoRankBucket.BUCKET_1)) {
      return LexoRankBucket.BUCKET_0;
    }
    return this.equals(LexoRankBucket.BUCKET_2) ? LexoRankBucket.BUCKET_1 : LexoRankBucket.BUCKET_0;
  }

  public equals(other: LexoRankBucket): boolean {
    if (this === other) {
      return true;
    }

    if (!other) {
      return false;
    }

    return this.value.equals(other.value);
  }
}

export default LexoRankBucket;
