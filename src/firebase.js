import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


var config = {
	apiKey: "AIzaSyD4E1s8p-uaAxFA2kwb_4IBA5GN8cnP5bY",
	authDomain: "chat-slack-904ca.firebaseapp.com",
	databaseURL: "https://chat-slack-904ca.firebaseio.com",
	projectId: "chat-slack-904ca",
	storageBucket: "chat-slack-904ca.appspot.com",
	messagingSenderId: "778026822724"
};
firebase.initializeApp(config);

export default firebase; 