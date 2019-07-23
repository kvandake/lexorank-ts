import { ILexoNumeralSystem } from './lexoNumeralSystem';

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

    throw new Error('Not valid digit: ' + ch);
  }

  public toChar(digit: number): string {
    return String.fromCharCode(digit + 48);
  }
}
