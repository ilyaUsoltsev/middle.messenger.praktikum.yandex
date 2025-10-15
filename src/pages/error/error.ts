import { BackButtonComponent } from '../../components';
import Block from '../../core/block';

interface ErrorProps {
  code: string;
  message: string;
}

export default class ErrorPage extends Block {
  constructor(props: ErrorProps) {
    super('main', {
      ...props,
      BackButton: new BackButtonComponent({
        onClick: () => {
          console.log('Go to previous page');
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
