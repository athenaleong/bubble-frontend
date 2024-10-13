'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Home() {
  const [buttonPresses, setButtonPresses] = useState(0);

  useEffect(() => {
    const buttonPressesRef = ref(database,  'bubbleCount');
    onValue(buttonPressesRef, (snapshot) => {
      const data = snapshot.val();
      setButtonPresses(data || 0);
    });
  }, []);

  const handleButtonPress = () => {
    const buttonPressesRef = ref(database, 'bubbleCount');
    set(buttonPressesRef, buttonPresses + 1);
  };

  return (
    <div>
      <p>Button has been pressed {buttonPresses} times.</p>
      <button onClick={handleButtonPress}>Press Me</button>
    </div>
  );
}