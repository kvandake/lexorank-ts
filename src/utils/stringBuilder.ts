class StringBuilder {

  private str: string;

  constructor(str: string = "") {
    this.str = str;
  }

  get length() {
    return this.str.length;
  }

  set length(value: number) {
    this.str = this.str.substring(0, value);
  }

  public append(str: string): StringBuilder {
    this.str = this.str + str;
    return this;
  }

  public remove(startIndex: number, length: number): StringBuilder {
    this.str = this.str.substr(0, startIndex) + this.str.substr(startIndex + length);
    return this;
  }

  public insert(index: number, value: string): StringBuilder {
    this.str = this.str.substr(0, index) + value + this.str.substr(index);
    return this;
  }

  public toString() {
    return this.str;
  }
}

export default StringBuilder;
