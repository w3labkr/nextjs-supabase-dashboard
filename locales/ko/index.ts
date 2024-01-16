import app from './app.json';
import components from './components.json';
import languages from './languages.json';
import firebase from './firebase.json';

const messages = {
  ...app,
  ...components,
  languages,
  firebase,
};

export default messages;
