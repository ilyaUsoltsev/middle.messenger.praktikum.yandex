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
                {{#if avatar}}
                  <img class="chat__image" src="{{get_avatar_url avatar}}" alt="avatar" />
                {{/if}}
                </div>
                <div class="chat__info">
                    <div class="chat__top">
                        <div class="chat__name">{{title}}</div>
                        {{#if last_message.time}}
                        <div class="chat__time">{{format_time last_message.time}}</div>
                        {{/if}}
                    </div>
                    <div class="chat__bottom">
                        <span class="chat__last-message">{{last_message.content}}</span>
                        {{#if unread_count}}
                            <div class="chat__unread-count">{{unread_count}}</div>
                        {{/if}}
                    </div>
                </div>
            </div>
          {{/each}}`;
  }
}
