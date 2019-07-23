export interface ILexoNumeralSystem {

  getBase(): number;

  getPositiveChar(): string;

  getNegativeChar(): string;

  getRadixPointChar(): string;

  toDigit(var1: string): number;

  toChar(var1: number): string;
}

export class LexoNumeralSystem10 implements ILexoNumeralSystem {
  public getBase(): number {
    return 10;
  }

  public getPositiveChar(): string {
    return '+';
  }

  public getNegativeChar(): string {
    return '-';
  }

  public getRadixPointChar(): string {
    return '.';
  }

  public toDigit(ch: string): number {

    if (ch >= '0' && ch <= '9') {
      return ch.charCodeAt(0) - 48;
    }

    throw new Error("Not valid digit: " + ch);
  }

  public toChar(digit: number): string {
    return String.fromCharCode((digit + 48));
  }
}

export class LexoNumeralSystem36 implements ILexoNumeralSystem {
  private DIGITS = ("0123456789abcdefghijklmnopqrstuvwxyz").split('');

  public getBase(): number {
    return 36;
  }

  public getPositiveChar(): string {
    return '+';
  }

  public getNegativeChar(): string {
    return '-';
  }

  public getRadixPointChar(): string {
    return ':';
  }

  public toDigit(ch: string): number {
    if (ch >= '0' && ch <= '9') {
      return ch.charCodeAt(0) - 48;
    }

    if (ch >= 'a' && ch <= 'z') {
      return ch.charCodeAt(0) - 97 + 10;
    }

    throw new Error("Not valid digit: " + ch);
  }

  public toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}

export class LexoNumeralSystem64 implements ILexoNumeralSystem {
  DIGITS = ("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_abcdefghijklmnopqrstuvwxyz").split('');

  public getBase(): number {
    return 64;
  }

  public getPositiveChar(): string {
    return '+';
  }

  public getNegativeChar(): string {
    return '-';
  }

  public getRadixPointChar(): string {
    return ':';
  }

  public toDigit(ch: string): number {
    if (ch >= '0' && ch <= '9') {
      return ch.charCodeAt(0) - 48;
    }

    if (ch >= 'A' && ch <= 'Z') {
      return ch.charCodeAt(0) - 65 + 10;
    }

    if (ch == '^') {
      return 36;
    }

    if (ch == '_') {
      return 37;
    }

    if (ch >= 'a' && ch <= 'z') {
      return ch.charCodeAt(0) - 97 + 38;
    }

    throw new Error("Not valid digit: " + ch);
  }

  public toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}
