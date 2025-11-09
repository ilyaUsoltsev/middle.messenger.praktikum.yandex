import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { noop } from "../../helpers/noop";
import type { Chat } from "../../pages/chats/types";

interface ChatProps extends BlockProps {
  chats: Chat[];
  onClick?: (event: Event) => void;
  selectedChatId: number | null;
}

export default class ChatComponent extends Block<ChatProps> {
  constructor(props: ChatProps) {
    super("div", {
      ...props,
      events: {
        click: props.onClick || noop,
      },
      className: `chats__sidebar-chats scrollbar-hide`,
    });
  }

  public render(): string {
    return `
          {{#each chats}}
            <div class="chat {{id}} {{#if_eq ../selectedChatId id}}chat--selected{{/if_eq}}" data-chatid="{{id}}">
                <div class="chat__avatar">
                  <img class="chat__image" src="{{avatar}}" alt="avatar" />
                </div>
                <div class="chat__info">
                    <div class="chat__top">
                        <span class="chat__name">{{title}}</span>
                        <span class="chat__time">{{time}}</span>
                    </div>
                    <div class="chat__bottom">
                        <span class="chat__last-message">{{lastMessage}}</span>
                        {{#if unreadCount}}
                            <div class="chat__unread-count">{{unreadCount}}</div>
                        {{/if}}
                    </div>
                </div>
            </div>
          {{/each}}`;
  }
}
