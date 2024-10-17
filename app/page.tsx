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

  // Update iframe wiht new stream url 
  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center lg:space-y-10 space-y-4'>
      <iframe 
        style={{ maxWidth: '100%', maxHeight: '100%' }} 
        width="806.4" 
        height="453.6" 
        src="https://www.youtube.com/embed/DivI83rL03Y?si=OEDIjDbNtmRh2cXK&autoplay=1&mute=1" 
        title="Livestream" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
      ></iframe>

      <div className='flex flex-col items-center mt-6 lg:space-y-10 space-y-4'>
        <p>Button has been pressed {buttonPresses} times.</p>
        <button className='flex border border-blue-600 border-4 rounded-lg bg-blue-400 mt-2 p-4 text-blue-950 font-bold italic' onClick={handleButtonPress}>BLAST BUBBLES</button>
      </div>
    </div>
  )
}