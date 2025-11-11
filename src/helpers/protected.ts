import Block from "../core/block";
import type { BlockProps } from "../core/types";
import { ROUTER } from "../constants";

export function protectedRoute<T extends BlockProps>(Component: new (props: T) => Block<T>) {
  return class ProtectedComponent extends Component {
    constructor(props: T) {
      super(props);
    }

    componentDidMount() {
      const user = window.store.getState().user;
      if (!user || !user.id) {
        window.router.go(ROUTER.login);
      }
    }
  };
}
