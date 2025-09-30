import './style.css';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import { chatsFixture } from './fixtures/chats-fixture';

const pages = {
  login: [Pages.LoginPage],
  register: [Pages.RegisterPage],
  error: [Pages.ErrorPage, { code: '404/501', message: 'Error message' }],
  chats: [Pages.ChatPage, { chats: chatsFixture }],
  chatsSelected: [
    Pages.ChatPage,
    { chats: chatsFixture, selectedChat: chatsFixture[0] },
  ],
  chatsAddUser: [
    Pages.ChatPage,
    { chats: chatsFixture, selectedChat: chatsFixture[0], addUser: true },
  ],
  profile: [Pages.ProfilePage, { update: false, readOnly: true }],
  profileUpdate: [Pages.ProfilePage, { update: true, readOnly: false }],
  updateAvatar: [
    Pages.ProfilePage,
    { update: true, readOnly: false, updateAvatar: true },
  ],
  password: [Pages.PasswordPage],
  navigation: [
    Pages.NavigatePage,
    {
      pages: [
        'chats',
        'error',
        'login',
        'register',
        'navigation',
        'chatsSelected',
        'chatsAddUser',
        'profile',
        'profileUpdate',
        'updateAvatar',
        'password',
      ],
    },
  ],
};

Object.entries(Components).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

function navigate(page: string) {
  //@ts-ignore
  const [source, context] = pages[page];
  const container = document.getElementById('app')!;

  const temlpatingFunction = Handlebars.compile(source);
  container.innerHTML = temlpatingFunction(context);
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e) => {
  //@ts-ignore
  const page = e.target.getAttribute('page');
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
