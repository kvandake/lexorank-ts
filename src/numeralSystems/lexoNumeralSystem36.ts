import { ILexoNumeralSystem } from './lexoNumeralSystem';

export class LexoNumeralSystem36 implements ILexoNumeralSystem {
  private DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

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

    throw new Error('Not valid digit: ' + ch);
  }

  public toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}
