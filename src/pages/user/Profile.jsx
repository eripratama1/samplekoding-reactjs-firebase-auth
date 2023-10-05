import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../hooks/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Profile = () => {

  const userId = localStorage.getItem("LOGGED_IN")
  const [dataUser, setDataUser] = useState([])
  const [name, setName] = useState('')
  const [fileImage, setFileImage] = useState('')

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

    if (!fileImage) {
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
    } else {

      // Ini adalah pernyataan kondisional yang digunakan untuk memeriksa apakah dataUser.image memiliki nilai 
      // Jika dataUser.image memiliki nilai, maka blok kode di dalamnya akan dieksekusi.
      if (dataUser.image) {
        // Di dalam blok kode tersebut, terlebih dahulu dibuat variabel imgRef dengan menggunakan fungsi ref(). 
        // Fungsi ini digunakan untuk membuat referensi ke lokasi penyimpanan (storage) gambar yang akan dihapus. 
    
        const imgRef = ref(storage, dataUser.image)
    
        // Setelah referensi ke gambar dibuat, kode kemudian memanggil metode deleteObject() pada imgRef. 
        // Metode ini digunakan untuk menghapus objek (dalam hal ini, file gambar) dari storage firebase. 
        // Kemudian, kode menggunakan .then() untuk menetapkan tindakan yang akan diambil setelah operasi penghapusan selesai.
        // Dimana akan menampilkan toast laoding
        deleteObject(imgRef).then(() => {
          toast.loading("Hapus gambar", { duration: 2000 })
        })
          .catch((err) => {
            console.log(err);
          })
      }

      // Variabel ini berisi nama berkas yang akan digunakan untuk menyimpan gambar. 
      // Nama berkas tersebut terdiri dari timestamp (waktu dalam bentuk angka yang dihasilkan dengan new Date().getTime()) 
      // ditambahkan dengan nama berkas asli (fileImage.name). Ini dilakukan untuk memastikan bahwa nama berkas yang 
      // diunggah adalah unik dan tidak akan terjadi konflik dengan berkas lain yang telah ada.
      const fileName = new Date().getTime() + fileImage.name
      
      // Path ini digunakan untuk menentukan lokasi penyimpanan di Firebase Storage di mana berkas gambar akan disimpan. 
      // Path ini terdiri dari string "imgUsers/" ditambahkan dengan nama berkas yang telah dibuat pada kode sebelumnya
      // yaitu fileName 
      const storagePath = "imgUsers/" + fileName


      // Di baris ini, kita membuat referensi ke lokasi penyimpanan Firebase yang akan digunakan untuk mengunggah berkas. 
      // ref() adalah fungsi yang digunakan untuk membuat referensi. storage adalah objek Firebase Storage yang 
      // telah didefinisikan sebelumnya, dan storagePath adalah path yang telah dibuat pada langkah sebelumnya.
      const storageRef = ref(storage, storagePath)

      // kode menggunakan fungsi uploadBytesResumable() untuk memulai proses pengunggahan (upload) file gambar. 
      // Fungsi ini mengambil dua argumen: referensi penyimpanan (storageRef) dan berkas gambar yang akan diunggah 
      // (fileImage).
      const uploadTask = uploadBytesResumable(storageRef, fileImage)

      // Ini adalah event listener yang digunakan untuk memantau perubahan status (state) dari uploadTask. 
      // Ketika status upload berubah, blok kode di dalamnya akan dieksekusi.
      uploadTask.on("state_changed", (snapshot) => {

        // kode ini menghitung persentase prgress upload dengan membagi jumlah byte yang sudah diupload 
        // (snapshot.bytesTransferred) dengan jumlah total byte yang akan diupload (snapshot.totalBytes).
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

        // kode ini untuk memeriksa status pengunggahan dan akan menampilkan toast untuk setiap statusnya
        // yaitu {pause,running, & success}
        switch (snapshot.state) {
          case 'paused':
            toast.loading('Progress Upload ' + progress + '%', { duration: 3000 })
            break;
          case 'running':
            toast.loading('Progress Upload ' + progress + '%', { duration: 3000 })
            break;
          case 'success':
            toast.success('Upload berhasil')
            break;
        }
      }, 
      // Ini adalah fungsi yang akan dipanggil jika terjadi kesalahan selama pengunggahan. 
      (error) => {
        console.log(error);
      },() => {
        // lalu kita tambahkan fungsi callback untuk mengambil downloadUrl dari getDownloadUrl
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          // Kode ini membuat referensi ke dokumen pengguna (user) dalam koleksi "users" dengan menggunakan doc()
          const colRef = doc(db,"users",userId)
          
          // Kode ini membuat objek dataUpdate yang akan digunakan untuk memperbarui data pengguna (user). 
          // Di sini, nama (name) dan URL gambar (image) diperbarui berdasarkan data yang telah diunggah
          const dataUpdate = {
            name: name ? name : dataUser.name,
            image:downloadUrl
          }

          // Kode ini mengirimkan permintaan pembaruan dokumen ke Firebase Firestore untuk memperbarui data pengguna dengan 
          // data yang baru. Jika pembaruan berhasil, maka akan ditampilkan pesan "Update berhasil" menggunakan toast.success(), 
          // dan kemudian halaman akan dimuat ulang menggunakan refreshPage()
          updateDoc(colRef,dataUpdate).then(() => {
            toast.success("Update berhasil")
            refreshPage()
          })
        })
      })
    }
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

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Upload Image
                </label>
                <input
                  name={fileImage}
                  onChange={e => setFileImage(e.target.files[0])}
                  type='file'
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