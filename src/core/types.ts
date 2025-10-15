export type Nullable<T> = T | null;

export type BlockProps = {
  // props can be of any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, (event: Event) => void>;
};
