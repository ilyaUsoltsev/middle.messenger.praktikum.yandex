import { ButtonComponent } from '../../components/button';
import ChatComponent from '../../components/chat/chat';
import DialogComponent from '../../components/dialog/dialog';
import InputComponent from '../../components/input/input';
import Block from '../../core/block';
import type { Chat } from './types';

interface ChatsProps {
  chats: Chat[];
  selectedChat: Chat | null;
  addUser: boolean;
}

export default class ChatsComponent extends Block {
  constructor(props: ChatsProps) {
    super('main', {
      ...props,
      className: '',
      messageText: '',
      InputSearch: new InputComponent({
        type: 'text',
        name: 'search',
        placeholder: 'Search chats',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          console.log('Search input changed:', target.value);
        },
      }),
      ProfileButton: new ButtonComponent({
        label: 'My profile',
        variant: 'primary',
        onClick: () => {
          console.log('Profile button clicked');
        },
      }),
      ChatComponents: props.chats.map(
        (chat) =>
          new ChatComponent({
            avatar: chat.avatar,
            name: chat.name,
            time: chat.time,
            lastMessage: chat.lastMessage,
            isSelected: chat.isSelected,
          })
      ),
      AddUserButton: new ButtonComponent({
        label: ' + Add user',
        variant: 'primary',
        onClick: () => {
          this.setProps({ addUser: true });
        },
      }),
      RemoveUserButton: new ButtonComponent({
        label: '- Remove user',
        variant: 'warning',
        onClick: () => {
          console.log('Remove user button clicked');
        },
      }),
      DeleteChatButton: new ButtonComponent({
        label: 'X Delete chat',
        variant: 'error',
        onClick: () => {
          console.log('Delete chat button clicked');
        },
      }),
      MessageInput: new InputComponent({
        type: 'text',
        name: 'message',
        placeholder: 'Type a message',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          console.log('Message input changed:', target.value);
        },
      }),
      SendMessageButton: new ButtonComponent({
        label: 'Send',
        variant: 'secondary',
        onClick: () => {
          console.log('Sending message...', this.props.messageText);
          (this.children.MessageInput as Block).setProps({ value: '' });
        },
      }),
      AddUserDialog: new DialogComponent({
        title: 'Add user',
        Body: new InputComponent({
          type: 'text',
          name: 'user_login',
          placeholder: 'User login',
          onChange: (e: Event) => {
            const target = e.target as HTMLInputElement;
            console.log('User login input changed:', target.value);
          },
        }),
        onConfirm: () => {
          console.log('Add user confirmed');
          this.setProps({ addUser: false });
          this.getChild('AddUserDialog')
            ?.getChild('Body')
            ?.setProps({ value: '' });
        },
        onCancel: () => {
          console.log('Add user cancelled');
          this.setProps({ addUser: false });
          this.getChild('AddUserDialog')
            ?.getChild('Body')
            ?.setProps({ value: '' });
        },
      }),
    });
  }

  public render(): string {
    return `
    <div class="chats">
        <section class="chats__sidebar">
            <div class="chats__sidebar-header">
                {{{ InputSearch }}}
                {{{ ProfileButton }}}
            </div>
            <div class="chats__sidebar-chats scrollbar-hide">
            {{#each ChatComponents}}
                {{{ this }}}
            {{/each}}
            </div>
        </section>
        {{#if selectedChat}}
            <section class="chats__dialog">
            <div class="chats__dialog-header">
                <div class="chats__dialog-user-info">
                    <img class="chats__dialog-avatar" src="{{selectedChat.avatar}}" alt="avatar" />
                    <span class="chats__dialog-name">{{selectedChat.name}}</span>
                </div>
                <div class="chats__dialog-actions">
                    {{{ AddUserButton }}}
                    {{{ RemoveUserButton }}}
                    {{{ DeleteChatButton }}}
                </div>
            </div>
            <div class="chats__dialog-messages scrollbar-hide">
                {{#each selectedChat.messages}}
                    <div class="chats__dialog-date">{{date}}</div>
                    {{#each messages}}
                        <div class="message {{#if isOwn}}message--own{{/if}}">
                        {{text}} @ {{time}}
                        </div>
                    {{/each}}
                {{/each}}
            </div>
            <div class="chats__dialog-input">
                {{{ MessageInput }}}
                {{{ SendMessageButton }}}
            </div>
            </section>
        {{else}}
            <section class="chats__dialog-empty">
                <p class="chats__dialog-empty-text">No chat selected</p>
            </section>
        {{/if}}

        {{#if addUser}}
            {{{ AddUserDialog }}}
        {{/if}}
     </div>
    `;
  }
}
