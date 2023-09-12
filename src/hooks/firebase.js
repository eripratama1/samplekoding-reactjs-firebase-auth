// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
// initializeApp adalah fungsi yang digunakan untuk menginisialisasi aplikasi Firebase dengan konfigurasi yang diberikan. 
// Ini adalah langkah pertama yang harus kita lakukan untuk menghubungkan aplikasi yang ada ke Firebase.

import { getAuth } from "firebase/auth"
// Ini adalah fungsi yang digunakan untuk menginisialisasi Firebase Authentication. 
// Firebase Authentication memungkinkan kita untuk mengelola otentikasi pengguna dalam aplikasi.

import { getFirestore } from "firebase/firestore"
// Ini adalah fungsi yang digunakan untuk menginisialisasi Firebase Firestore. 
// Firestore adalah layanan database dokumen yang tersedia di Firebase yang digunakan untuk menyimpan dan mengelola 
// data aplikasi.

import { getStorage } from "firebase/storage"
// getStorage fungsi yang digunakan untuk menginisialisasi Firebase Storage. 
// Firebase Storage adalah layanan penyimpanan berbasis cloud yang digunakan untuk menyimpan file 
// seperti gambar, video, dan dokumen dalam aplikasi Anda.

const firebaseConfig = {
    apiKey: "your api key",
    authDomain: "your authDomain",
    projectId: "your project ID",
    storageBucket: "your storage bucket",
    messagingSenderId: "your sender IDs",
    appId: "your app ID"
};
// firebaseConfig adalah objek yang berisi konfigurasi Firebase Anda. 
// Ini mencakup informasi seperti apiKey, authDomain, projectId, dll. 
// Konfigurasi ini diperoleh dari dashboard Firebase saat kita membuat proyek Firebase baru.

const app = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig) menginisialisasi aplikasi Firebase dengan menggunakan konfigurasi yang telah 
// Kita tentukan dalam firebaseConfig. Setelah inisialisasi, 
// Kita dapat menggunakan app untuk mengakses berbagai layanan Firebase seperti Authentication, Firestore, dan Storage.

export const auth = getAuth(app)
// export const auth = getAuth(app) menginisialisasi Firebase Authentication menggunakan app yang telah diinisialisasi sebelumnya 
// dan mengekspornya sebagai auth. Ini memungkinkan kita untuk menggunakan objek auth untuk mengelola otentikasi pengguna 
// dalam aplikasi

export const db = getFirestore(app)
// export const db = getFirestore(app) menginisialisasi Firebase Firestore menggunakan app dan mengekspornya sebagai db. 
// Kita dapat menggunakan objek db untuk berinteraksi dengan basis data Firestore dalam aplikasi yang ada.

export const storage = getStorage(app)
// export const storage = getStorage(app) menginisialisasi Firebase Storage menggunakan app dan mengekspornya sebagai storage. 
// Ini memungkinkan kita untuk mengunggah, mengunduh, dan mengelola file dalam Firebase Storage.
