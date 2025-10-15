import './style.css';
import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import { chatsFixture } from './fixtures/chats-fixture';
import ChatsPage from './pages/chats/chats';
import ErrorPage from './pages/error/error';
import { LoginPage } from './pages/login/login';
import NavigatePage from './pages/navigate/navigate';
import { PasswordPage } from './pages/password/password';
import { ProfilePage } from './pages/profile/profile';
import { ProfileEditPage } from './pages/profile/profile-edit';
import { RegisterPage } from './pages/register/register';

function navigate(page: string) {
  //@ts-expect-error not typed
  const [source, context] = pages[page];
  const container = document.getElementById('app')!;

  const temlpatingFunction = Handlebars.compile(source);
  container.innerHTML = temlpatingFunction(context);
}

// document.addEventListener('DOMContentLoaded', () => navigate('navigation'));
document.addEventListener('DOMContentLoaded', () => {
  const chats = new ChatsPage({
    chats: chatsFixture,
    selectedChat: chatsFixture[0],
    addUser: false,
  });

  const errorPage = new ErrorPage({
    code: '404',
    message: 'Page not found',
  });

  const loginPage = new LoginPage();
  const navigatePage = new NavigatePage({
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
  });

  const passwordPage = new PasswordPage();
  const profilePage = new ProfilePage({
    firstName: 'John',
    secondName: 'Doe',
    displayName: 'Johnny',
    login: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  });
  const profileEditPage = new ProfileEditPage({
    firstName: 'John',
    secondName: 'Doe',
    displayName: 'Johnny',
    login: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  });
  const registerPage = new RegisterPage();

  const app = document.getElementById('app');
  app?.appendChild(chats.element!);
});

document.addEventListener('click', (e) => {
  //@ts-expect-error not typed
  const page = e.target.getAttribute('page');
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
