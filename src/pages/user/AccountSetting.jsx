import React from 'react'

const AccountSetting = () => {

    return (
        <div className='grid grid-cols-1 gap-9 sm:grid-cols-2'>

            {/* FORM UPDATE EMAIL AUTHENTICATION */}
            <div className='flex flex-col gap-9'>
                <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                    <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                        <h3 className='font-semibold text-black dark:text-white'>
                            Update Email
                        </h3>
                    </div>
                    <form action="#">
                        <div className="p-6.5">

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
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
                    <form action="#">
                        <div className="p-6.5">

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Recent Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Recent Password"
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
    )
}

export default AccountSetting