import {
  InputComponent,
  ButtonComponent,
  ChatComponent,
  DialogComponent,
  FormComponent,
  MessageFormComponent,
} from "../../components";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { connect } from "../../helpers/connect";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import type { AppState } from "../../types";
import type { Chat } from "./types";

interface ChatsProps extends BlockProps {
  chats: Chat[];
  selectedChat?: Chat | null;
  addUser: boolean;
}

interface ChatsState {
  messageText: string;
}

class ChatsPage extends Block<ChatsProps & ChatsState> {
  constructor(props: ChatsProps) {
    super("main", {
      ...props,
      messageText: "",
      InputSearch: new InputComponent({
        type: "text",
        name: "search",
        placeholder: "Search chats",
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          console.log("Search input changed:", target.value);
        },
      }),
      ProfileButton: new ButtonComponent({
        label: "My profile",
        variant: "primary",
        onClick: () => {
          console.log("Profile button clicked");
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
          }),
      ),
      AddUserButton: new ButtonComponent({
        label: " + Add user",
        variant: "primary",
        onClick: () => {
          this.setProps({ addUser: true });
        },
      }),
      RemoveUserButton: new ButtonComponent({
        label: "- Remove user",
        variant: "warning",
        onClick: () => {
          console.log("Remove user button clicked");
        },
      }),
      DeleteChatButton: new ButtonComponent({
        label: "X Delete chat",
        variant: "error",
        onClick: () => {
          console.log("Delete chat button clicked");
        },
      }),
      MessageForm: new FormComponent({
        className: "chats__dialog-input",
        onSubmitButtonLabel: "Send",
        Body: new MessageFormComponent(),
        onSubmit: (e: SubmitEvent) => {
          e.preventDefault();
          const formData = getFormData(e);
          const { message } = formData;
          const error = validateInput("message", message);
          if (error) {
            this.getChild("MessageForm")?.setProps({ error });
            return;
          } else {
            this.getChild("MessageForm")?.setProps({ error: "" });
          }
          console.log("Submitting formData:", formData);
        },
      }),
      MessageInput: new InputComponent({
        type: "text",
        name: "message",
        placeholder: "Type a message",
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ messageText: value });
          const error = validateInput("message", value);
          this.getChild("MessageInput")?.setProps({ error, value });
        },
      }),
      SendMessageButton: new ButtonComponent({
        label: "Send",
        variant: "secondary",
        onClick: () => {
          console.log("Sending message...", this.props.messageText);
          const error = validateInput("message", this.props.messageText);
          if (error) {
            console.log("Validation error:", error);
            this.getChild("MessageInput")?.setProps({ error });
            return;
          }
          this.getChild("MessageInput")?.setProps({ value: "" });
        },
      }),
      AddUserDialog: new DialogComponent({
        title: "Add user",
        Body: new InputComponent({
          type: "text",
          name: "user_login",
          placeholder: "User login",
          onChange: (e: Event) => {
            const target = e.target as HTMLInputElement;
            console.log("User login input changed:", target.value);
          },
        }),
        onConfirm: () => {
          console.log("Add user confirmed");
          this.setProps({ addUser: false });
          this.getChild("AddUserDialog")?.getChild("Body")?.setProps({ value: "" });
        },
        onCancel: () => {
          console.log("Add user cancelled");
          this.setProps({ addUser: false });
          this.getChild("AddUserDialog")?.getChild("Body")?.setProps({ value: "" });
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
            {{{ MessageForm }}}
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

const mapStateToProps = (state: AppState) => ({
  chats: state.chats || [],
  selectedChat: state.chats?.find((chat) => chat.id === state.selectedChat) || null,
});

export default connect(mapStateToProps)(ChatsPage);
