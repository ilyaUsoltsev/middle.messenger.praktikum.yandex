import Block from "../core/block";
import type { BlockProps } from "../core/types";
import Router from "../core/router";

export interface WithRouterProps {
  router: Router;
}

export function withRouter<T extends BlockProps>(Component: new (props: T) => Block<T>) {
  return class WithRouterComponent extends Component {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(props: any) {
      super({ ...props, router: window.router } as T);
    }
  };
}
