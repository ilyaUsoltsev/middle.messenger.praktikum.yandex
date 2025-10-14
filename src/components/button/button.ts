import Block from '../../core/block';

interface ButtonProps {
  label: string;
  color: 'primary' | 'secondary' | 'danger';
  onClick: (event: Event) => void;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super('button', {
      ...props,
      className: `button button__${props.color}`,
      events: {
        click: props.onClick,
      },
    });
  }
  public render(): string {
    return `
      {{label}}
    `;
  }
}
