import firebase from "firebase/compat/app"
// import SignIn from "./SignIn";
// import ChatRoom from "./ChatRoom";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import {BiSend} from "react-icons/bi"
import {RiChatSmile3Fill} from "react-icons/ri"
import {FcGoogle} from "react-icons/fc"
import {useAuthState} from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef, useState } from "react";




firebase.initializeApp({
  apiKey: "AIzaSyDILEE1CwlsJ1F6Ab6SL3UdiDTnOWSreDs",
  authDomain: "chat-box-cf1a7.firebaseapp.com",
  projectId: "chat-box-cf1a7",
  storageBucket: "chat-box-cf1a7.appspot.com",
  messagingSenderId: "697662828915",
  appId: "1:697662828915:web:bdec4280bc75ac0d7dd506",
  measurementId: "G-LWX6Q9XSYM"
})
//console.log(firebase.auth)
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
 //console.log(user)
  return (
    <div className="App">
      <header>
        <h1>My Chat App <RiChatSmile3Fill className="header-icon" /></h1>
        <SignOut />
      </header>
      <section>
      
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}


 function SignIn(){
  const signInWithGoogle = ()=> {
      const provider = new firebase.auth.GoogleAuthProvider();
       auth.signInWithPopup(provider);
  }
  
      return (
          <div className="sign-in">
          <button onClick={signInWithGoogle} ><FcGoogle
          className="icon-google" />  Sign in With Google</button>
          
          <p>Do not Violate the community Guidelines or You will be banned for life</p>
          </div>
      )
  }



  function SignOut(){
    return auth.currentUser && (
      <button 
      onClick={()=>auth.signOut()}
      className="sign-out"
      
      >Sign out</button>
    )
  }

  function ChatRoom(){
    const messageRef = firestore.collection("messages");
    const query=messageRef.orderBy("createdAt").limit(25);
    const [formValue , setFormValue ] = useState("");

  const dummy = useRef();

    const [messages] = useCollectionData(query , {idField: "id"});

    async function sendMessage(e){
      e.preventDefault();
       
      const {uid , photoURL}= auth.currentUser;
    
      await messageRef.add({
        text:formValue , 
        createdAt : firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })

      setFormValue('');
      dummy.current.scrollIntoView({behavior: "smooth"})

    }
    
    return (
      <>
      <main>
        {messages && messages.map(msg => <ChatMessage  key={msg.id} message={msg}/> )}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage} className="form">
        <input
         value={formValue}
         onChange={(e)=> setFormValue(e.target.value)}
        />
        <button type="submit" disabled={!formValue}>
        <BiSend className="send-icon"/>
        </button>
      </form>
      
      </>
      
    )
  }

  function ChatMessage(props){
    const {text , uid , photoURL}=props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL || "default.png"} alt="" />
        <p>{text}</p>
      </div>
    )

  }
  export default App;

