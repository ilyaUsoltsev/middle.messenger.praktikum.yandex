import type {
  AttributeExpr,
  EachExpr,
  HtmlSelfClosingTagExpr,
  HtmlTagExpr,
  MustacheExpr,
  PartialExpr,
  Expr,
  StringExpr,
} from "./ast";
import { Token } from "./token";
import { KEYWORDS, TOKEN_TYPE } from "./token-types";

class Parser {
  tokens: Token[];
  current: number = 0;
  expressions: Expr[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(tokens: Token[]): Expr[] {
    this.tokens = tokens;
    while (!this.isAtEnd()) {
      const expr = this.getExpression();
      if (expr) {
        this.expressions.push(expr);
      }
    }
    return this.expressions;
  }

  private consume(type: Token["type"], message: string) {
    if (this.check(type)) {
      return this.advance();
    }

    throw new Error(message);
  }

  private getExpression(currentBlock?: "tag" | "string"): Expr {
    if (
      this.match(TOKEN_TYPE.MUSTASHES_OPEN, TOKEN_TYPE.HASH, TOKEN_TYPE.GREATER)
    ) {
      return this.slotExpression();
    }

    if (this.match(TOKEN_TYPE.MUSTASHES_OPEN, TOKEN_TYPE.HASH, KEYWORDS.each)) {
      return this.eachExpression();
    }

    if (this.match(TOKEN_TYPE.MUSTASHES_OPEN, TOKEN_TYPE.HASH, KEYWORDS.if)) {
      return this.ifExpression();
    }

    if (this.match(TOKEN_TYPE.MUSTASHES_OPEN, TOKEN_TYPE.GREATER)) {
      return this.partialExpression();
    }

    if (
      currentBlock === "tag" &&
      this.match(TOKEN_TYPE.IDENTIFIER, TOKEN_TYPE.EQUAL)
    ) {
      return this.attributeExpression();
    }

    // allow < or > in string expressions
    if (this.match(TOKEN_TYPE.LESS) && currentBlock !== "string") {
      return this.tagExpression();
    }

    if (this.match(TOKEN_TYPE.STRING)) {
      return this.stringExpression();
    }

    if (this.match(TOKEN_TYPE.MUSTASHES_OPEN)) {
      return this.mustacheExpression();
    }

    this.advance();
    return this.identifierExpression();
  }

  private slotExpression(): PartialExpr {
    this.consume(TOKEN_TYPE.WHITESPACE, "Expect WHITESPACE after {{#> ");
    const componentToken = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expecting slot component name (identifier)",
    );

    const AttributeExprs = [];

    while (
      !this.check(TOKEN_TYPE.MUSTASHES_CLOSE) &&
      !this.check(TOKEN_TYPE.EOF)
    ) {
      const expression = this.getExpression("tag");
      if (expression) {
        AttributeExprs.push(expression);
      }
    }

    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expecting }} at the end of a first slot expression",
    );

    const children: Expr[] = [];
    while (!this.check(TOKEN_TYPE.BLOCK_CLOSE) && !this.check(TOKEN_TYPE.EOF)) {
      const expression = this.getExpression();
      if (expression) {
        children.push(expression);
      }
    }

    this.consume(TOKEN_TYPE.BLOCK_CLOSE, "Expecting {{/ to close slot block");
    this.consume(TOKEN_TYPE.WHITESPACE, "Expect WHITESPACE after {{/ ");
    this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expecting slot component name (identifier) in closing slot block",
    );
    this.consume(
      TOKEN_TYPE.WHITESPACE,
      "Expect WHITESPACE before }} in closing slot block",
    );
    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expecting }} at the end of a closing slot expression",
    );

    const childrenAttributeExpr: AttributeExpr = {
      type: "AttributeExpr",
      left: { type: "LiteralExpr", value: "children" },
      right: { type: "ChildrenExpr", children: children },
    };
    AttributeExprs.push(childrenAttributeExpr);

    return {
      type: "PartialExpr",
      name: componentToken.lexeme,
      attributes: AttributeExprs,
    };
  }

  private partialExpression(): PartialExpr {
    this.consume(TOKEN_TYPE.WHITESPACE, "Expect WHITESPACE after {{> ");
    const componentToken = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expecting component name (identifier)",
    );

    const AttributeExprs = [];

    while (
      !this.check(TOKEN_TYPE.MUSTASHES_CLOSE) &&
      !this.check(TOKEN_TYPE.EOF)
    ) {
      const expression = this.getExpression("tag");
      if (expression) {
        AttributeExprs.push(expression);
      }
    }

    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expecting }} at the end of a partial expression",
    );

    return {
      type: "PartialExpr",
      name: componentToken.lexeme,
      attributes: AttributeExprs,
    };
  }

  private mustacheExpression(): MustacheExpr {
    const variableToken = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect variable name after '{{'.",
    );

    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expect '}}' after variable name.",
    );
    return {
      type: "MustacheExpr",
      variable: variableToken.lexeme,
    };
  }

  private tagExpression(): HtmlSelfClosingTagExpr | HtmlTagExpr {
    const tagToken = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect tag name after '<'.",
    );

    const attrExpressions: Expr[] = [];

    while (
      !(
        this.check(TOKEN_TYPE.GREATER) || this.check(TOKEN_TYPE.SELF_CLOSING)
      ) &&
      !this.check(TOKEN_TYPE.EOF)
    ) {
      const expression = this.getExpression("tag");
      if (expression) {
        attrExpressions.push(expression);
      }
    }

    const isSelfClosing = this.check(TOKEN_TYPE.SELF_CLOSING);

    if (isSelfClosing) {
      this.consume(
        TOKEN_TYPE.SELF_CLOSING,
        "Expect '/>' after tag attributes.",
      );
      return {
        type: "HtmlSelfClosingTagExpr",
        tag: tagToken.lexeme,
        attributes: attrExpressions,
      };
    }

    this.consume(TOKEN_TYPE.GREATER, "Expect '>' after tag name.");

    const children: Expr[] = [];
    while (!this.check(TOKEN_TYPE.TAG_CLOSE) && !this.check(TOKEN_TYPE.EOF)) {
      const expression = this.getExpression();
      if (expression) {
        children.push(expression);
      }
    }

    this.consume(TOKEN_TYPE.TAG_CLOSE, "Expect '</' before closing tag name.");
    this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect tag name after </ in closing tag.",
    );
    this.consume(TOKEN_TYPE.GREATER, "Expect '>' after closing tag name.");

    return {
      type: isSelfClosing ? "HtmlSelfClosingTagExpr" : "HtmlTagExpr",
      tag: tagToken.lexeme,
      attributes: attrExpressions,
      children: children,
    };
  }

  private stringExpression(): StringExpr {
    const expressions: Expr[] = [];

    while (!this.check(TOKEN_TYPE.STRING) && !this.check(TOKEN_TYPE.EOF)) {
      const expression = this.getExpression("string");
      if (expression) {
        expressions.push(expression);
      }
    }

    this.consume(
      TOKEN_TYPE.STRING,
      "Expect '\"' in the end of string expression.",
    );

    return {
      type: "StringExpr",
      children: expressions,
    };
  }

  private identifierExpression(): Expr {
    const identifier = this.previous();

    return {
      type: "LiteralExpr",
      value: identifier.lexeme,
    };
  }

  private attributeExpression(): Expr {
    this.goBack();
    this.goBack();
    // we are at IDENTIFIER
    const left = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect identifier at attribute expression start.",
    );

    this.consume(TOKEN_TYPE.EQUAL, "Expect '=' after attribute name.");
    const isStringExpression = this.check(TOKEN_TYPE.STRING);
    if (isStringExpression) {
      this.consume(TOKEN_TYPE.STRING, "Expect '\"' before attribute value.");
      const right = this.stringExpression();
      return {
        type: "AttributeExpr",
        left: { type: "LiteralExpr", value: left.lexeme },
        right: right,
      };
    } else {
      const identifierToken = this.consume(
        TOKEN_TYPE.IDENTIFIER,
        "Expect identifier after '='.",
      );
      return {
        type: "AttributeExpr",
        left: { type: "LiteralExpr", value: left.lexeme },
        right: { type: "LiteralExpr", value: identifierToken.lexeme },
      };
    }
  }

  private eachExpression(): EachExpr {
    this.consume(TOKEN_TYPE.WHITESPACE, "Expect WHITESPACE after {{#each ");
    const iterator = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect iterator Identifier in each expr",
    );
    this.consume(
      TOKEN_TYPE.WHITESPACE,
      "Expect WHITESPACE after iterator in each expr",
    );
    const alias = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expect alias for item in the list",
    );
    this.consume(TOKEN_TYPE.MUSTASHES_CLOSE, "Expect }} in each opening expr");

    const children = [];
    while (
      !this.check(TOKEN_TYPE.BLOCK_CLOSE, KEYWORDS.each) &&
      !this.check(TOKEN_TYPE.EOF)
    ) {
      const expression = this.getExpression();
      if (expression) {
        children.push(expression);
      }
    }

    this.consume(TOKEN_TYPE.BLOCK_CLOSE, "Expect {{ to close each block");
    this.consume(KEYWORDS.each, "Expect each keyword in closing each block");
    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expect }} at the end of closing each expression",
    );

    return {
      type: "EachExpr",
      name: iterator.lexeme,
      alias: alias.lexeme,
      children: children,
    };
  }

  private ifExpression(): Expr {
    this.consume(TOKEN_TYPE.WHITESPACE, "Expect WHITESPACE after {{#if ");
    const condition = this.consume(
      TOKEN_TYPE.IDENTIFIER,
      "Expecting condition variable",
    );
    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expect }} at the end of #if expression",
    );

    const trueExpressions = [];
    while (
      !(
        this.check(TOKEN_TYPE.MUSTASHES_OPEN, KEYWORDS.else) ||
        this.check(TOKEN_TYPE.BLOCK_CLOSE, KEYWORDS.if)
      ) &&
      !this.check(TOKEN_TYPE.EOF)
    ) {
      const expression = this.getExpression();
      if (expression) {
        trueExpressions.push(expression);
      }
    }

    const withElseBlock = this.check(TOKEN_TYPE.MUSTASHES_OPEN, KEYWORDS.else);

    const falseExpressions = [];
    if (withElseBlock) {
      this.consume(TOKEN_TYPE.MUSTASHES_OPEN, "Expect {{ for else expression");
      this.consume(KEYWORDS.else, "Expect else keyword");
      this.consume(
        TOKEN_TYPE.MUSTASHES_CLOSE,
        "Expect }} at the end of else expression",
      );

      while (
        !this.check(TOKEN_TYPE.BLOCK_CLOSE, KEYWORDS.if) &&
        !this.check(TOKEN_TYPE.EOF)
      ) {
        const expression = this.getExpression();
        if (expression) {
          falseExpressions.push(expression);
        }
      }
    }

    this.consume(TOKEN_TYPE.BLOCK_CLOSE, "Expect closing block in if block");
    this.consume(KEYWORDS.if, "Expect if keyword in closing if block");
    this.consume(
      TOKEN_TYPE.MUSTASHES_CLOSE,
      "Expect }} at the end of closing if expression",
    );

    return {
      type: "IfExpr",
      condition: condition.lexeme,
      thenBranch: trueExpressions,
      elseBranch: falseExpressions,
    };
  }

  match(...types: Token["type"][]): boolean {
    let counter = 0;
    for (let i = 0; i < types.length; i++) {
      if (this.check(types[i])) {
        this.advance();
        counter++;
      } else {
        break;
      }
    }

    if (counter === types.length) {
      return true;
    }

    for (let i = 0; i < counter; i++) {
      this.goBack();
    }

    return false;
  }

  check(...types: Token["type"][]): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return types.every((type, idx) => this.peek(idx).type === type);
  }

  goBack() {
    if (this.current > 0) this.current--;
  }

  advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type == TOKEN_TYPE.EOF;
  }

  peek(increment = 0): Token {
    return this.tokens[this.current + increment];
  }

  previous(): Token {
    return this.tokens[this.current - 1];
  }
}

export default Parser;
