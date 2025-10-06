import type {
  AttributeExpr,
  EachExpr,
  HtmlSelfClosingTagExpr,
  HtmlTagExpr,
  IfExpr,
  LiteralExpr,
  MustacheExpr,
  PartialExpr,
  Expr,
  StringExpr,
} from "./ast";

class AstPrinter {
  htmlDocument: string = "";
  partials: { [key: string]: Expr[] };

  constructor(partials: { [key: string]: Expr[] }) {
    this.partials = partials;
  }

  print(expressions: Expr[], ctx: any): string {
    this.htmlDocument = "";
    for (const expr of expressions) {
      this.htmlDocument += this.printExpr(expr, ctx);
    }
    return this.htmlDocument;
  }

  printExpr(expr: Expr, ctx: any): string {
    switch (expr.type) {
      case "LiteralExpr":
        return this.handleLiteralExpr(expr);
      case "HtmlTagExpr":
        return this.handleHtmlTagExpr(expr, ctx);
      case "HtmlSelfClosingTagExpr":
        return this.handleHtmlSelfClosingTagExpr(expr, ctx);
      case "MustacheExpr":
        return this.handleMustacheExpr(expr, ctx);
      case "AttributeExpr":
        return this.handleAttributeExpr(expr, ctx);
      case "StringExpr":
        return this.handleStringExpr(expr, ctx);
      case "IfExpr":
        return this.handleIfExpr(expr, ctx);
      case "PartialExpr":
        return this.handlePartialExpr(expr, ctx);
      case "EachExpr":
        return this.handleEachExpr(expr, ctx);
      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  handleLiteralExpr(expr: LiteralExpr): string {
    return expr.value;
  }

  handleEachExpr(expr: EachExpr, ctx: any): string {
    const iteratorKey = expr.name;
    const arrayToIterate = this.getNestedValue(iteratorKey, ctx);
    let result = "";

    for (const item of arrayToIterate) {
      result += this.print(expr.children, { ...ctx, [expr.alias]: item });
    }

    return result;
  }

  handlePartialExpr(expr: PartialExpr, ctx: any): string {
    const partialName = expr.name;
    let partialCtx: any = {};
    for (const attr of expr.attributes ?? []) {
      if (attr.type === "AttributeExpr") {
        const key = attr.left.value;
        let value: any;

        if (attr.right.type === "LiteralExpr") {
          // attribute is a variable passed from context
          value = this.getNestedValue(attr.right.value, ctx);
        } else if (attr.right.type === "StringExpr") {
          // attribute is a string
          value = this.printExpr(attr.right, ctx);
        } else if (attr.right.type === "ChildrenExpr") {
          // children passed to slot component
          value = this.print(attr.right.children ?? [], {
            ...ctx,
          });
        }
        if (key === "...") {
          partialCtx = { ...partialCtx, ...value };
        } else {
          partialCtx[key] = value;
        }
      }
    }

    return this.print(this.partials[partialName] ?? [], partialCtx);
  }

  handleHtmlTagExpr(expr: HtmlTagExpr, ctx: any): string {
    let result = `<${expr.tag}`;

    for (const attribute of expr?.attributes ?? []) {
      result += this.printExpr(attribute, ctx);
    }
    result += ">";

    for (const child of expr?.children ?? []) {
      result += this.printExpr(child, ctx);
    }
    result += `</${expr.tag}>`;
    return result;
  }

  handleHtmlSelfClosingTagExpr(expr: HtmlSelfClosingTagExpr, ctx: any): string {
    let result = `<${expr.tag}`;

    for (const attribute of expr?.attributes ?? []) {
      result += this.printExpr(attribute, ctx);
    }
    result += "/>";
    return result;
  }

  handleMustacheExpr(expr: MustacheExpr, ctx: any): string {
    return this.getNestedValue(expr.variable, ctx);
  }

  handleAttributeExpr(expr: AttributeExpr, ctx: any): string {
    let result = this.printExpr(expr.left, ctx);
    result += "=";
    result += `"${this.printExpr(expr.right, ctx)}"`;
    return result;
  }

  handleStringExpr(expr: StringExpr, ctx: any): string {
    let result = "";

    for (const child of expr.children) {
      result += this.printExpr(child, ctx);
    }

    return result;
  }

  handleIfExpr(IfExpr: IfExpr, ctx: any): string {
    let result = "";
    const condition = ctx[IfExpr.condition];
    if (condition) {
      for (const expr of IfExpr.thenBranch) {
        result += this.printExpr(expr, ctx);
      }
    } else {
      for (const expr of IfExpr.elseBranch ?? []) {
        result += this.printExpr(expr, ctx);
      }
    }
    return result;
  }

  private getNestedValue(variable: string, ctx: any): any {
    const nestedKeys = variable.split(".");
    let value = { ...ctx };
    for (const key of nestedKeys) {
      value = value?.[key];
      if (value === undefined) {
        value = undefined;
      }
    }
    return value;
  }
}

export default AstPrinter;
