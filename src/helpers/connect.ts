import { StoreEvents } from "../core/store";
import type { AppState } from "../types";
import isEqual from "./is-equal";
import Block from "../core/block";
import type { BlockProps } from "../core/types";

export function connect(mapStateToProps: (state: AppState) => Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function getsComponent<P extends BlockProps, T extends new (...args: any[]) => Block<P>>(
    Component: T,
  ) {
    return class ConnectedComponent extends Component {
      private onChangeStoreCallback: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        const store = window.store;
        // сохраняем начальное состояние
        let state = mapStateToProps(store.getState());

        const [props = {}] = args;

        super({ ...props, ...state });

        this.onChangeStoreCallback = () => {
          // при обновлении получаем новое состояние
          const newState = mapStateToProps(store.getState());

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState });
          }

          // не забываем сохранить новое состояние
          state = newState;
        };

        // подписываемся на событие
        store.on(StoreEvents.Updated, this.onChangeStoreCallback);
      }

      //   componentWillUnmount() {
      //     super.componentWillUnmount();
      //     window.store.off(StoreEvents.Updated, this.onChangeStoreCallback);
      //   }
    };
  };
}
