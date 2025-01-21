import React, { useState } from "react";
import {} from 'firebase/auth'
import {doc, setDoc, getFirestore, getDoc, onSnapshot} from 'firebase/firestore' 
import SignUp from '../components/SignUp.jsx';
import SignIn from '../components/SignIn.jsx';



const Chat = () => {
    const [signingUp, setSigningUp] = useState(true);
    const [signingIn, setSigningIn] = useState(false);

    const toggleSignIn = () => {
        setSigningIn(true);
        setSigningUp(false);
    }

    const toggleSignUp = () => {
        setSigningIn(false);
        setSigningUp(true);
    }

    const checkForSignInStatus = () => {
        if(signingIn){
            return <SignIn toggleSignUp={toggleSignUp}></SignIn>;
        }
        if(signingUp){
            return <SignUp toggleSignIn={toggleSignIn}></SignUp>;
        }
        return null;
    };

    return (
        <div>
            {checkForSignInStatus()}
        </div>
    );
};

export default Chat;