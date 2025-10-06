export class Token {
  type: string;
  lexeme: string;
  line: number;

  constructor(type: string, lexeme: string, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme}`;
  }
}
