import app from './app';
import components from './components';
import languages from './languages';
import firebase from './firebase';

const messages = {
  ...app,
  ...components,
  languages,
  firebase,
};

export default messages;
