import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../hooks/firebase'
import toast, { Toaster } from 'react-hot-toast'
import { sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from 'firebase/auth'

const AccountSetting = () => {

    // State yang digunakan untuk mendapatkan nilai daro localStorage (userId)
    // Menerima inputan dari user saat proses update email maupun password (email,currentPassword,newPassword)
    // dan objeck navigate yang akan digunakan pada proses redirectPage
    const userId = localStorage.getItem("LOGGED_IN")
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [dataUser, setDataUser] = useState([])
    const navigate = useNavigate()

    const [newPassword, setNewPassword] = useState('')

    // Menjalankan query untuk mendapatkan dataUSer yang terautentikasi beradasarkan userId
    const fetchUser = async () => {
        const colRef = query(collection(db, "users"), where("userId", "==", userId))
        const querySnapshot = await getDocs(colRef)

        querySnapshot.forEach((doc) => {
            setDataUser(doc.data())
        })
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const redirectPage = () => {
        setTimeout(() => {
            navigate("/auth/login")
        }, 3000);
    }

    const updateEmailUser = async (e) => {
        e.preventDefault()

        // Validasi: memeriksa apakah variabel email dan currentPassword ada atau kosong. 
        // Jika salah satu dari keduanya kosong, kode akan menampilkan pesan kesalahan menggunakan library "toast" 
        // dan menghentikan eksekusi lebih lanjut.
        if (!email && !currentPassword) {
            return toast.error("Masih ada data yang kosong")
        }

        // Objek yang berisi tiga properti, yaitu currentEmail, currentPassword, dan newMail, 
        // yang akan digunakan dalam proses autentikasi dan pembaruan email.
        const dataUpdateEmail = {
            currentEmail: dataUser.email,
            currentPassword: currentPassword,
            newMail: email
        }

        // Mendapatkan referensi koleksi users 
        // Kode akan mengakses dokumen dalam koleksi "users" dengan menggunakan doc dan getDoc dari Firestore 
        // menggunakan variabel userId.
        const colRef = doc(db, "users", userId)
        const querySnapshot = await getDoc(colRef)

        // Autentikasi pengguna disini kita akan mencoba untuk mengautentikasi pengguna dengan email dan 
        // kata sandi yang saat ini digunakan (currentEmail dan currentPassword) 
        // menggunakan signInWithEmailAndPassword. Jika berhasil, kode akan melanjutkan proses pembaruan alamat email.
        await signInWithEmailAndPassword(auth, dataUpdateEmail.currentEmail, dataUpdateEmail.currentPassword).then(() => {

            // Pembaruan alamat email Kode akan memanggil updateEmail untuk mengubah alamat email pengguna yang terautentikasi. 
            // dan menggantinya dengan alamat email yang baru (dataUpdateEmail.newMail)
            // Ini adalah operasi asynchronous yang akan dijalankan setelah autentikasi berhasil.
            updateEmail(auth.currentUser, dataUpdateEmail.newMail).then(() => {
                toast.loading("Update email autentikasi", { duration: 3000 })

                // Pembaruan dokumen users. Jika dokumen users ada (ditunjukkan oleh querySnapshot.exists()), 
                // kode akan memperbarui alamat email di Firestore menggunakan updateDoc.
                if (querySnapshot.exists()) {
                    updateDoc(doc(db, "users", userId), {
                        email: dataUpdateEmail.newMail
                    }).then(() => {
                        // Setelah alamat email diperbarui, kode akan mengirimkan email verifikasi ke pengguna 
                        // menggunakan sendEmailVerification
                        sendEmailVerification(auth.currentUser).then(() => {
                            toast.success("Email verifikasi berhasil dikirim")
                        }).catch((errSendEmail) => {
                            toast.error(errSendEmail)
                        }).finally(() => {
                            // Terakhir, kode akan keluar dari sesi pengguna menggunakan signOut, 
                            // menghapus data lokal menggunakan localStorage.clear(), dan mengarahkan pengguna ke halaman login
                            // dengan memanggil fungsi redirectPage().
                            signOut(auth).then(() => {
                                localStorage.clear()
                                redirectPage()
                            })
                        })
                    }).catch((err) => {
                        toast.error(err)
                    })
                }
            })
        })

    }

    const updatePasswordUser = async (e) => {
        e.preventDefault()

        if (!newPassword && !currentPassword) {
            return toast.error("Data masih kosong")
        }
        // Objek yang berisi tiga properti, yaitu currentEmail, currentPassword, dan newPassword. 
        // Properti ini akan digunakan dalam proses autentikasi dan pembaruan kata sandi.
        const dataUpdatePassword = {
            currentEmail: dataUser.email,
            currentPassword: currentPassword,
            newPassword: newPassword
        }

        console.log("value dataupdatePassword", dataUpdatePassword);

        // Menjalankan proses autentikasi jika berhasil akan melanjutkan ke proses update kata sandi
        await signInWithEmailAndPassword(auth, dataUpdatePassword.currentEmail, dataUpdatePassword.currentPassword).then(() => {
            // Setelah pengguna berhasil diautentikasi, 
            // kode memanggil updatePassword untuk mengganti kata sandi pengguna yang saat ini terautentikasi
            // dengan password baru (dataUpdatePassword.newPassword).
            updatePassword(auth.currentUser, dataUpdatePassword.newPassword).then(() => {
                toast.success("Update password berhasil")
            }).catch((err) => {
                toast.error(err)
            }).finally(() => {
                localStorage.clear()
                redirectPage()
            })
        })
    }

    return (
        <>
            <Toaster />
            <div className='grid grid-cols-1 gap-9 sm:grid-cols-2'>

                {/* FORM UPDATE EMAIL AUTHENTICATION */}
                <div className='flex flex-col gap-9'>
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-semibold text-black dark:text-white'>
                                Update Email
                            </h3>
                        </div>
                        <form onSubmit={updateEmailUser}>
                            <div className="p-6.5">

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Enter your new email"
                                            name={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                                    </div>
                                </div>

                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                                    Update Email Authentication
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* FORM UPDATE EMAIL AUTHENTICATION */}


                {/* FORM UPDATE PASSWORD FOR AUTHENTICATION */}
                <div className='flex flex-col gap-9'>
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-semibold text-black dark:text-white'>
                                Update Password
                            </h3>
                        </div>
                        <form onSubmit={updatePasswordUser}>
                            <div className="p-6.5">

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Recent Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Recent Password"
                                            name={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                                    </div>
                                </div>

                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                                    Update Password Authentication
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* FORM UPDATE PASSWORD FOR AUTHENTICATION */}

            </div>
        </>
    )
}

export default AccountSetting