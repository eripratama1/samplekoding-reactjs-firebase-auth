import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../hooks/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

  const userId = localStorage.getItem("LOGGED_IN")
  const [dataUser, setDataUser] = useState([])
  const [name, setName] = useState('')

  const navigate = useNavigate()

  //Deklarasi sebuah fungsi asynchronous getUserAuth. Fungsi ini tidak menerima argumen dan akan digunakan untuk 
  //mengambil data pengguna dari Firestore.
  const getUserAuth = async () => {

    // Di sini, kita membuat referensi ke koleksi (collection) "users" di Firestore. 
    // db adalah objek yang mewakili koneksi ke database Firestore. query digunakan untuk membuat query Firestore, dan 
    // where digunakan untuk menentukan kriteria pencarian. Dalam hal ini, kode ini mencari dokumen dalam koleksi "users" 
    //di mana nilai "userId" sama dengan nilai dari variabel userId yang di dapat dari localStorage ketika user melakukan proses login
    const colRef = query(collection(db, "users"), where("userId", "==", userId))

    //Dalam baris ini, Kita mengambil data dari koleksi Firestore yang sesuai dengan kriteria yang telah di tentukan sebelumnya. 
    //Kita menggunakan fungsi getDocs untuk melakukan pengambilan data. Penggunaan kata kunci await membuat eksekusi kode 
    //menunggu hingga permintaan untuk mengambil data selesai, karena operasi ini adalah operasi asinkron.
    const querySnapshot = await getDocs(colRef)
    
    //Setelah kita mendapatkan snapshot dari hasil query, kita menggunakan forEach untuk mengiterasi setiap dokumen yang 
    //cocok dengan kriteria pencarian. Untuk setiap dokumen, lalu memanggil set state setDataUser dan 
    //menambahkan argumen doc.data(). 
    //Ini artinya kita mengambil data dari dokumen tersebut (dalam bentuk objek) dan memasukkannya ke dalam set state setDataUser
    querySnapshot.forEach((doc) => {
      setDataUser(doc.data())
    })
  }

  const updateData = (e) => {
    e.preventDefault()

    //Di sini, kita membuat referensi ke dokumen users tertentu di Firestore. 
    //doc digunakan untuk menunjuk ke dokumen dengan mengidentifikasi koleksi ("users") dan ID dokumen ("userId").
    const colRef = doc(db, "users", userId)

    //membuat objek dataUpdate yang akan digunakan untuk memperbarui data pada dokumen users. 
    //Objek ini memiliki properti name, yang akan diperbarui dengan nilai dari variabel name jika name tersedia, 
    //jika tidak kita tetap menggunakan nilai yang ada dalam dataUser.name.
    const dataUpdate = {
      name: name ? name : dataUser.name
    }

    //Dalam baris ini, kita menggunakan fungsi updateDoc untuk memperbarui dokumen berdasarkan referensi colRef 
    //dan data yang ada dalam dataUpdate. Setelah pembaruan berhasil dilakukan, blok .then(), menampilkan pesan toast 
    //("Update berhasil") menggunakan toast.success 
    updateDoc(colRef, dataUpdate).then(() => {
      toast.success("Update berhasil")
      refreshPage()
    })
      .catch((err) => {
        console.log(err);
      })
  }

  const refreshPage = () => {
    setTimeout(() => {
      navigate(0)
    }, 3000);
  }

  useEffect(() => {
    //Memanggil fungsi getUserAuth
    getUserAuth()
  }, [])

  return (
    <div className='flex flex-col gap-9  '>
      <div>
        <Toaster />
      </div>
      <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
          <h3 className='font-semibold text-black dark:text-white'>
            Update Profile
          </h3>
        </div>
        <form action="#" onSubmit={updateData}>
          <div className="p-6.5">

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Full Name
                </label>
                <input
                  name={name} // properti name digunakan untuk mengidentifikasi nama dari elemen input
                  
                  defaultValue={dataUser.name} 
                  // untuk mengatur nilai awal dari elemen input.Nilai dari dataUser.name akan digunakan sebagai nilai awal yang 
                  // akan ditampilkan dalam elemen input. Jadi, jika dataUser.name memiliki nilai sebelumnya, 
                  // nilai itu akan muncul di dalam input saat komponen pertama kali dimuat.
                  
                  onChange={e => setName(e.target.value)} 
                  // digunakan untuk mengatur apa yang harus terjadi ketika nilai dalam elemen input berubah
                  // arrow function ini akan dipanggil setiap kali ada perubahan pada elemen input. 
                  // fungsi ini menerima objek event e sebagai argumen, dan kemudian mengambil nilai yang ada di dalam e.target.value 
                  // (nilai yang dimasukkan oleh pengguna ke dalam input) dan memperbarui state komponen dengan nilai tersebut 
                  // menggunakan setName.
                  
                  placeholder="Enter your name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 
                  font-medium outline-none transition focus:border-primary active:border-primary 
                  disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input 
                  dark:focus:border-primary"
                />
              </div>
            </div>

            <button
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile