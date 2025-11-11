import { BackButtonComponent } from "../../components";
import { ROUTER } from "../../constants";
import Block from "../../core/block";
import type Router from "../../core/router";
import type { BlockProps } from "../../core/types";
import { connect } from "../../helpers/connect";
import { withRouter } from "../../helpers/with-router";
import type { AppState } from "../../types";

interface ErrorProps extends BlockProps {
  code: string;
  message: string;
  router: Router;
}

class ErrorPage extends Block<ErrorProps> {
  constructor(props: ErrorProps) {
    super("main", {
      ...props,
      BackButton: new BackButtonComponent({
        onClick: () => {
          console.log("Go to previous page");
          this.props.router.go(ROUTER.chats);
        },
      }),
    });
  }

  render() {
    return `
            <section class="error-container scrollbar-hide">
                <h1>{{code}}</h1>
                <p>{{message}}</p>
                {{{ BackButton }}}
            </section>
        `;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    code: state.error?.code || "404",
    message: state.error?.message || "Not found",
  };
};

export default connect(mapStateToProps)(withRouter(ErrorPage));
