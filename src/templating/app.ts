import { Scanner } from "./scanner";
import Parser from "./parser";
import AstPrinter from "./ast-printer";
import type { Expr } from "./ast";

const partials: { [key: string]: Expr[] } = {};

export function registerPartials(name: string, template: string) {
  const scanner = new Scanner(template);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const expressions = parser.parse(tokens);
  partials[name] = expressions;
}

export function compile(fileContent: string) {
  const scanner = new Scanner(fileContent);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const expressions = parser.parse(tokens);
  const ast = new AstPrinter(partials);

  return (ctx: any) => ast.print(expressions, ctx);
}
