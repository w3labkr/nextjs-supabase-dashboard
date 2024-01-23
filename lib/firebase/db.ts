// import { db } from '@/lib/firebase';
// import {
//   collection,
//   query,
//   where,
//   getCountFromServer,
//   getDocs,
// } from 'firebase/firestore';

// export async function findAllUsers() {
//   const coll = collection(db, 'users');
//   const snapshot = await getDocs(coll);

//   return snapshot.docs.map((doc) => doc.data());
// }

// export async function countAllUsers() {
//   const coll = collection(db, 'users');
//   const snapshot = await getCountFromServer(coll);

//   return snapshot.data().count;
// }

// export async function findUsersByEmail(email: string) {
//   const coll = collection(db, 'users');
//   const q = query(coll, where('email', '==', email));
//   const snapshot = await getDocs(q);

//   let data = [];
//   snapshot.forEach((doc) => {
//     data = [...data, doc.data()];
//   });

//   return data;
// }

// export async function findUserByEmail(email: string) {
//   const coll = collection(db, 'users');
//   const q = query(coll, where('email', '==', email));
//   const snapshot = await getDocs(q);

//   let data = [];
//   snapshot.forEach((doc) => {
//     data = [...data, doc.data()];
//   });

//   return data[0];
// }

// export async function countUserByEmail(email: string) {
//   const coll = collection(db, 'users');
//   const q = query(coll, where('email', '==', email));
//   const snapshot = await getCountFromServer(q);

//   return snapshot.data().count;
// }
