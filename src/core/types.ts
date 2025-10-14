export type Nullable<T> = T | null;

export type BlockProps = {
  [key: string]: unknown;
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, (event: Event) => void>;
};
