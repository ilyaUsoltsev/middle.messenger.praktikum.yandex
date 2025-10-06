export type LiteralExpr = { type: "LiteralExpr"; value: any };

export type StringExpr = { type: "StringExpr"; children: Expr[] };

export type ChildrenExpr = { type: "ChildrenExpr"; children: Expr[] };

export type EachExpr = {
  type: "EachExpr";
  name: string;
  alias: string;
  children: Expr[];
};

export type PartialExpr = {
  type: "PartialExpr";
  name: string;
  attributes?: Expr[];
};

export type SlotExpr = {
  type: "SlotExpr";
  name: string;
  attributes?: Expr[];
  children: Expr[];
};

export type AttributeExpr = {
  type: "AttributeExpr";
  left: LiteralExpr;
  right: StringExpr | LiteralExpr | ChildrenExpr;
};

export type IfExpr = {
  type: "IfExpr";
  condition: string; // variable name after {{#if condition
  thenBranch: Expr[];
  elseBranch?: Expr[];
};

export type HtmlTagExpr = {
  type: "HtmlTagExpr";
  tag: string;
  attributes?: Expr[];
  children?: Expr[];
};

export type HtmlSelfClosingTagExpr = {
  type: "HtmlSelfClosingTagExpr";
  tag: string;
  attributes?: Expr[];
};

export type MustacheExpr = {
  type: "MustacheExpr";
  variable: string;
};

export type Expr =
  | HtmlTagExpr
  | HtmlSelfClosingTagExpr
  | MustacheExpr
  | LiteralExpr
  | AttributeExpr
  | StringExpr
  | IfExpr
  | PartialExpr
  | SlotExpr
  | ChildrenExpr
  | EachExpr;
