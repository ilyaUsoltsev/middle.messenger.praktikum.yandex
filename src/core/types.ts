import type { METHODS } from "./constants";
export type METHOD = (typeof METHODS)[keyof typeof METHODS];

export type Nullable<T> = T | null;

export type BlockProps = {
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, (event: Event) => void>;
};

export type RequestMethod = (typeof METHODS)[keyof typeof METHODS];

export interface RequestOptions<T> {
  method: RequestMethod;
  data?: Record<string, T>;
  headers?: Record<string, string>;
  timeout?: number;
}
