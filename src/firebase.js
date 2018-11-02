import Rebase from 're-base';
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD5-VKv5lCnL10njkjFN-zkZ68W-W7nGOk",
  authDomain: "lansystemsdbtestwork.firebaseapp.com",
  databaseURL: "https://lansystemsdbtestwork.firebaseio.com",
  projectId: "lansystemsdbtestwork",
  storageBucket: "lansystemsdbtestwork.appspot.com",
  messagingSenderId: "227698643352"
};

const app = firebase.initializeApp(config);
export default Rebase.createClass(app.database());
