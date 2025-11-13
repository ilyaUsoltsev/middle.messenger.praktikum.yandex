import type { SearchUserResponse } from "../../api/user.types";
import {
  InputComponent,
  ButtonComponent,
  ChatComponent,
  DialogComponent,
  FormComponent,
  MessageFormComponent,
} from "../../components";
import { ROUTER } from "../../constants";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { connect } from "../../helpers/connect";
import { getFormData } from "../../helpers/get-form-data";
import isEqual from "../../helpers/is-equal";
import { validateInput } from "../../helpers/validation";
import { withRouter } from "../../helpers/with-router";
import {
  addUserToChat,
  createChat,
  deleteChat,
  getChats,
  getChatToken,
  getChatUsers,
  setSelectedChatId,
} from "../../services/chats.service";
import webSocketService from "../../services/websocket.service";
import type { AppState } from "../../types";
import type { Chat } from "./types";

interface Message {
  id: number;
  time: string;
  user_id: number;
  content: string;
  type: string;
}

interface ChatsProps extends BlockProps {
  chats: Chat[];
  selectedChat?: Chat | null;
  selectedChatId: number | null;
  addUser: boolean;
  addNewChat: boolean;
  selectedChatUsers: SearchUserResponse;
  chatToken?: string;
  messages?: Message[];
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
          window.router.go(ROUTER.profile);
        },
      }),
      NewChatButton: new ButtonComponent({
        label: "New chat",
        variant: "secondary",
        onClick: () => {
          console.log("New chat button clicked");
          this.setProps({ addNewChat: true });
        },
      }),
      ChatComponents: new ChatComponent({
        chats: props.chats,
        selectedChatId: props.selectedChatId,
        onClick: (event: Event) => {
          const target = event.target as HTMLElement;
          const chatElement = target.closest(".chat") as HTMLElement;
          if (chatElement) {
            const chatId = chatElement.dataset.chatid;
            setSelectedChatId(Number(chatId));
          }
        },
      }),
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
          const confirmed = window.confirm("Are you sure you want to delete this chat?");
          if (confirmed) {
            deleteChat(this.props.selectedChatId!);
          }
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

          if (webSocketService.isConnected()) {
            webSocketService.sendMessage(message);
            this.getChild("MessageForm")
              ?.getChild("Body")
              ?.getChild("MessageInput")
              ?.setProps({ value: "" });
          } else {
            console.error("WebSocket is not connected");
          }
        },
      }),
      AddUserDialog: new DialogComponent({
        title: "Add user",
        Body: new FormComponent({
          onSubmitButtonLabel: "Add user",
          Body: new InputComponent({
            type: "text",
            name: "user_login",
            placeholder: "User login",
            onChange: (e: Event) => {
              const target = e.target as HTMLInputElement;
              console.log("User login input changed:", target.value);
            },
          }),
          onSubmit: (e: SubmitEvent) => {
            e.preventDefault();
            const data = getFormData(e);
            const { user_login } = data;
            const error = validateInput("user_login", user_login);
            if (error) {
              this.getChild("AddUserDialog")
                ?.getChild("Body")
                ?.getChild("Body")
                ?.setProps({ error });
              return;
            } else {
              this.getChild("AddUserDialog")
                ?.getChild("Body")
                ?.getChild("Body")
                ?.setProps({ error: "" });
            }
            addUserToChat(this.props.selectedChatId!, user_login);
            this.setProps({ addUser: false });
          },
          AdditionalButtons: new ButtonComponent({
            label: "Cancel",
            variant: "error",
            onClick: () => {
              console.log("Add user cancelled via button");
              this.setProps({ addUser: false });
              this.getChild("AddUserDialog")?.getChild("Body")?.setProps({ value: "" });
            },
          }),
        }),
      }),
      NewChatDialog: new DialogComponent({
        title: "New chat",
        Body: new FormComponent({
          onSubmitButtonLabel: "Create",
          Body: new InputComponent({
            type: "text",
            name: "chat_title",
            placeholder: "Chat title",
            onChange: (e: Event) => {
              const target = e.target as HTMLInputElement;
              console.log("Chat title input changed:", target.value);
            },
          }),
          onSubmit: (e: SubmitEvent) => {
            e.preventDefault();
            const data = getFormData(e);
            const { chat_title } = data;
            const error = validateInput("chat_title", chat_title);
            if (error) {
              this.getChild("NewChatDialog")
                ?.getChild("Body")
                ?.getChild("Body")
                ?.setProps({ error });
              return;
            } else {
              this.getChild("NewChatDialog")
                ?.getChild("Body")
                ?.getChild("Body")
                ?.setProps({ error: "" });
            }
            createChat(chat_title);
            this.setProps({ addNewChat: false });
          },
          AdditionalButtons: new ButtonComponent({
            label: "Cancel",
            variant: "error",
            onClick: () => {
              console.log("Create chat cancelled via button");
              this.setProps({ addNewChat: false });
              this.getChild("NewChatDialog")?.getChild("Body")?.setProps({ value: "" });
            },
          }),
        }),
      }),
    });
  }

  componentDidUpdate(
    oldProps: ChatsProps & ChatsState,
    newProps: ChatsProps & ChatsState,
  ): boolean {
    // Update ChatComponents when chats change
    if (isEqual(oldProps.chats, newProps.chats) === false) {
      this.getChild("ChatComponents")?.setProps({ chats: newProps.chats });
    }

    if (oldProps.selectedChatId !== newProps.selectedChatId) {
      // Disconnect from previous chat
      webSocketService.disconnect();

      if (newProps.selectedChatId !== null) {
        getChatUsers(newProps.selectedChatId);
        getChatToken(newProps.selectedChatId);
      }
      this.getChild("ChatComponents")?.setProps({ selectedChatId: newProps.selectedChatId });
    }

    if (oldProps.selectedChatUsers !== newProps.selectedChatUsers) {
      this.setProps({ selectedChatUsers: newProps.selectedChatUsers });
    }

    if (oldProps.chatToken !== newProps.chatToken && newProps.chatToken) {
      const userId = window.store.getState().user.id;
      if (userId && newProps.selectedChatId) {
        webSocketService.connect(userId, newProps.selectedChatId, newProps.chatToken);
      }
    }

    if (oldProps.messages?.length !== newProps.messages?.length) {
      setTimeout(() => this.scrollToBottom(), 0);
    }

    return true;
  }

  componentDidMount(): void {
    getChats();
  }

  private scrollToBottom(): void {
    const messagesContainer = this.getContent()?.querySelector(".chats__dialog-messages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  public render(): string {
    return `
    <div class="chats">
        <section class="chats__sidebar">
            <div class="chats__sidebar-header">
                {{{ InputSearch }}}
                {{{ ProfileButton }}}
                {{{ NewChatButton }}}
            </div>
            {{{ ChatComponents }}}
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
                <div class="chats__dialog-users">
                 <span>Users in chat:</span>
                  {{#each selectedChatUsers}}
                   <span class="chats__dialog-users--username">{{login}}</span>
                  {{/each}}
                </div>
            <div class="chats__dialog-messages scrollbar-hide">
              {{#each messages}}
                  <div class="message {{#if_eq user_id ../user.id}}message--own{{/if_eq}}">
                  {{content}} @ {{time}}
                  </div>
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
        {{#if addNewChat}}
            {{{ NewChatDialog }}}
        {{/if}}
     </div>
    `;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    chats: state.chats || [],
    selectedChat: state.chats?.find((chat) => chat.id === state.selectedChatId) || null,
    selectedChatId: state.selectedChatId,
    selectedChatUsers: state.selectedChatUsers,
    chatToken: state.chatToken,
    messages: state.selectedChatId ? state?.messages?.[state.selectedChatId] || [] : [],
    user: state.user,
  };
};

export default connect(mapStateToProps)(withRouter(ChatsPage));
