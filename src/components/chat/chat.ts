import Block from '../../core/block';

interface ChatProps {
  avatar: string;
  name: string;
  time: string;
  lastMessage: string;
  unreadCount?: number;
  isSelected?: boolean;
}

export default class ChatComponent extends Block {
  constructor(props: ChatProps) {
    super('div', {
      ...props,
      className: `chat ${props.isSelected ? 'chat--unread' : ''}`,
    });
  }

  public render(): string {
    return `<div class="chat__avatar">
            <img class="chat__image" src="{{avatar}}" alt="avatar" />
            </div>
            <div class="chat__info">
                <div class="chat__top">
                    <span class="chat__name">{{name}}</span>
                    <span class="chat__time">{{time}}</span>
                </div>
                <div class="chat__bottom">
                    <span class="chat__last-message">{{lastMessage}}</span>
                    {{#if unreadCount}}
                        <div class="chat__unread-count">{{unreadCount}}</div>
                    {{/if}}
                </div>
            </div>`;
  }
}
