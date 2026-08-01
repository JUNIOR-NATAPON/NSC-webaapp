import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyC1IBeq4UHYqtSioGYWjd4iZ4Ez9G_jexk",
  authDomain: "nsc01-4136f.firebaseapp.com",
  databaseURL: "https://nsc01-4136f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nsc01-4136f",
  storageBucket: "nsc01-4136f.firebasestorage.app",
  messagingSenderId: "717051291518",
  appId: "1:717051291518:web:64509ebed4a93457cb752f",
  measurementId: "G-FZQYR25C4J"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
