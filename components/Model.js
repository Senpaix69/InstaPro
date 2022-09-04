import { useRecoilState } from 'recoil';
import { modelState } from "../atoms/modelAtom";
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/outline';
import { Fragment, useRef, useState } from 'react';
import { db, storage } from '../firebase';
import { addDoc, doc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';


const Model = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useRecoilState(modelState);
    const filePickerRef = useRef(null);
    const captionRef = useRef(null);
    const [selectFile, setSelectFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const postImage = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
            username: session.user.username,
            caption: captionRef.current.value,
            profImg: session.user.image,
            timeStamp: serverTimestamp()
        });
        
        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        await uploadString(imageRef, selectFile, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(imageRef);

            await updateDoc(doc(db, "posts", docRef.id), {
                image: downloadURL,
            });
        });

        setOpen(false);
        setLoading(false);
        setSelectFile(null);
    }

    const addImageToPost = (e) => {
        const read = new FileReader();
        if (e.target.files[0]) {
            read.readAsDataURL(e.target.files[0]);
        }
        read.onload = (readEvent) => {
            setSelectFile(readEvent.target.result);
        };
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={setOpen}>
                <div className='flex items-end justify-center min-h-[600px] md:min-h-[600px] pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                    </Transition.Child>

                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    >
                        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
                            <div>
                                {selectFile ? (
                                    <img className='object-contain w-full cursor-pointer'
                                        src={selectFile} alt='file'
                                        onClick={() => setSelectFile(null)} />
                                ) : (

                                    <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'>
                                        <CameraIcon
                                            onClick={() => filePickerRef.current.click()}
                                            className='h-6 w-6 text-red-600' aria-hidden='true' />
                                    </div>

                                )}
                                <div className='mt-3 text-center sm:mt-5'>
                                    <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900'>
                                        Upload a photo
                                    </Dialog.Title>
                                    <div>
                                        <input ref={filePickerRef} type='file' hidden onChange={addImageToPost} />
                                    </div>
                                    <div className='mt-2'>
                                        <input ref={captionRef} className='border-none focus:ring-0 w-full text-center' type='text' placeholder='Please enter a caption' />
                                    </div>
                                </div>
                            </div>


                            <div className='mt-5 sm:mt-6'>
                                <button type='button'
                                    disabled={!selectFile}
                                    className='inline-flex justify-center w-full rouned-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300'
                                    onClick={postImage}
                                >
                                    {loading ? "Uploading..." : "Upload Post"}
                                </button>

                            </div>
                        </div>

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Model