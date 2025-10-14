import Block from '../../core/block';
import { ButtonComponent } from '../button';

export default class BackButtonComponent extends Block {
  constructor() {
    super('span', {
      className: 'back-button',
      BackButton: new ButtonComponent({
        label: '< Back to chats',
        variant: 'secondary',
        onClick: () => console.log('BackButtonComponent clicked'),
      }),
    });
  }

  public render(): string {
    return `{{{BackButton}}}`;
  }
}
