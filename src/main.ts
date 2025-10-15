import './style.css';
import * as Pages from './pages';
import { chatsFixture } from './fixtures/chats-fixture';
import type Block from './core/block';

const pages: Record<string, Block> = {
  chats: new Pages.ChatPage({
    chats: chatsFixture,
    selectedChat: null,
    addUser: false,
  }),
  chatsSelected: new Pages.ChatPage({
    chats: chatsFixture,
    selectedChat: chatsFixture[0],
    addUser: false,
  }),
  error: new Pages.ErrorPage({ code: '404', message: 'Page not found' }),
  login: new Pages.LoginPage(),
  register: new Pages.RegisterPage(),
  navigation: new Pages.NavigatePage({
    pages: [
      'chats',
      'error',
      'login',
      'register',
      'navigation',
      'chatsSelected',
      'profile',
      'profileUpdate',
      'password',
    ],
  }),
  password: new Pages.PasswordPage(),
  profile: new Pages.ProfilePage({
    firstName: 'John',
    secondName: 'Doe',
    displayName: 'Johnny',
    login: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  }),
  profileUpdate: new Pages.ProfileEditPage({
    firstName: 'John',
    secondName: 'Doe',
    displayName: 'Johnny',
    login: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  }),
};

function navigate(page: string) {
  const PageComponent = pages[page];

  const app = document.getElementById('app');
  app!.innerHTML = '';
  app?.appendChild(PageComponent.element!);
}

document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

document.addEventListener('click', (e: Event) => {
  const page = (e.target as HTMLElement).getAttribute('page');
  if (page) {
    navigate(page);
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
