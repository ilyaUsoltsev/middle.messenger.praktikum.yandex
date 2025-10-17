import type { METHODS } from "./constants";

export type Nullable<T> = T | null;

export type BlockProps = {
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, (event: Event) => void>;
};

export type RequestMethod = (typeof METHODS)[keyof typeof METHODS];

export interface RequestOptions {
  method: RequestMethod;
  // data record value can be of any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}
