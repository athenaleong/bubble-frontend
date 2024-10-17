'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, query, orderByChild, limitToLast } from 'firebase/database';
import axios from 'axios';

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

interface User {
    time: string,
    city: string
}

export default function Home() {
  const [buttonPresses, setButtonPresses] = useState(0);
  const [userCity, setUserCity] = useState('hello');
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        const response = await axios.get('https://freeipapi.com/api/json/', {});
        setUserCity(`${response.data.cityName}, ${response.data.countryCode}`);
      } catch (error) {
        console.error('Error fetching user city:', error);
      }
    };

    fetchUserCity();

    const buttonPressesRef = ref(database, 'bubbleCount');
    onValue(buttonPressesRef, (snapshot) => {
      const data = snapshot.val();
      setButtonPresses(data || 0);
    });

    const recentUsersRef = query(ref(database, 'user'), orderByChild('time'), limitToLast(3));
    onValue(recentUsersRef, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((childSnapshot) => {
        users.unshift(childSnapshot.val());
      });
      setRecentUsers(users);
    });
  }, []);

  const handleButtonPress = () => {
    const buttonPressesRef = ref(database, 'bubbleCount');
    set(buttonPressesRef, buttonPresses + 1);

    const userRef = ref(database, 'user');
    push(userRef, { time: new Date().toISOString(), city: userCity });
  };

  const timeAgo = (pastTime: string) => {
    const currentTime = new Date();
    const pastDate = new Date(pastTime);
    const diffInSeconds = Math.floor((currentTime.getTime() - pastDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const seconds = diffInSeconds % 60;

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds > 1 ? `${seconds}s ago` : 'just now'}`;
    }
  };

  return (
    <>
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
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Button has been pressed {buttonPresses} times.</p>
        <button className='flex border-blue-600 border-4 rounded-lg bg-blue-400 mt-2 p-4 text-blue-950 font-bold italic' onClick={handleButtonPress}>BLAST BUBBLES</button>
      </div>
    </div>
    <div className="absolute top-0 right-0 text-sm">
        <p>🫧 Bubbles from</p>
        <div>
        {recentUsers.map(user => (
          <div key={user.time}>
            <p>{`${user.city}  ${timeAgo(user.time)}`}</p>
          </div>
        ))}
        </div>
    </div>
    </>
  );
}