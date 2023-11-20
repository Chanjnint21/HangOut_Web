// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBx1nNP9w-IgmL1nk3tTONeyVSrus3-yjg',
  authDomain: 'outdoor-traveler.firebaseapp.com',
  projectId: 'outdoor-traveler',
  storageBucket: 'outdoor-traveler.appspot.com',
  messagingSenderId: '149253441126',
  appId: '1:149253441126:web:c7e9ee634feb868a12cfa7',
  measurementId: 'G-BE7QXBGZQ3',
  databaseURL: "https://outdoor-traveler-default-rtdb.firebaseio.com"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const auth = getAuth(app)
const db = getFirestore(app)
const database = getDatabase(app)

export { storage, db, auth, database  }
