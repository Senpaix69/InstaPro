import { CameraIcon, PhotographIcon } from "@heroicons/react/solid";
import { ref } from "firebase/storage";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const EditGroup = ({
  setEditGroup,
  db,
  gName,
  gDesc,
  you,
  id,
  doc,
  updateDoc,
  getDownloadURL,
  storage,
  uploadBytesResumable,
}) => {
  const filePickerRef = useRef(null);
  const toastId = useRef(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [selectFile, setSelectFile] = useState("");
  const [loading, setLoading] = useState(false);

  const saveEditing = async () => {
    if (toast.isActive(toastId.current)) toast.dismiss(toastId.current);
    if (selectFile || name || description)
      toastId.current = toast.loading("Saving...");
    if (selectFile) {
      setLoading(true);
      const storageRef = ref(
        storage,
        `chats/image/${you?.username}-${you?.uid}`
      );
      const uploadTask = uploadBytesResumable(storageRef, selectFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(percent);
        },
        () => saved("error"),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              await updateDoc(doc(db, "chats", id), {
                name: name || gName,
                description: description || gDesc,
                image: url,
              });
            })
            .then(() => saved("success"));
        }
      );
    } else if (name || description) {
      await updateDoc(doc(db, "chats", id), {
        name: name ? name : gName,
        description: description ? description : gDesc,
      }).then(() => saved("success"));
    }
  };

  const saved = (action) => {
    if (toast.isActive(toastId.current)) toast.dismiss(toastId.current);
    if (action === "success")
      toast.success("group edited successfully", { toastId: "success" });
    else toast.error("Error Occured during editing", { toastId: "error" });
    setName("");
    setDescription("");
    setLoading(false);
    setSelectFile("");
    setEditGroup(false);
    toastId.current = null;
  };

  const addImage = (file) => {
    if (file.type.includes("image")) {
      if (file.size / (1024 * 1024) > 3) {
        toast.error("Image size is larger than 3mb");
      } else {
        setSelectFile(file);
      }
    } else {
      toast.error("please select image");
    }
  };

  return (
    <>
      <div className="absolute inset-0 h-screen bg-gray-700 bg-opacity-50 z-30"></div>
      <div className="absolute z-40 h-screen inset-0 flex items-center justify-center">
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle w-full max-w-sm sm:p-6 dark:text-gray-200">
          <div>
            {selectFile ? (
              <button
                disabled={loading}
                onClick={() => setSelectFile(null)}
                className="font-bold flex items-center justify-center w-full space-x-2"
              >
                <PhotographIcon className="h-6 w-6" />
                <p> ~{selectFile.name}</p>
              </button>
            ) : (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 cursor-pointer">
                <CameraIcon
                  onClick={() => filePickerRef.current.click()}
                  className="h-6 w-6 text-red-600 dark:text-gray-200"
                  aria-hidden="true"
                />
              </div>
            )}
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium">Group-Photo</h3>
              <div>
                <input
                  ref={filePickerRef}
                  type="file"
                  hidden
                  onChange={(e) => addImage(e.target.files[0])}
                />
              </div>
              <input
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                className="mt-4 p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-800 dark:text-white resize-none scrollbar-none dark:placeholder:text-gray-300"
                type="text"
                placeholder="Name..."
              />
              <textarea
                disabled={loading}
                onChange={(e) => setDescription(e.target.value)}
                className="block mt-4 p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-800 dark:text-white resize-none scrollbar-none dark:placeholder:text-gray-300"
                type="text"
                placeholder="group description..."
              />
            </div>
          </div>

          <div className="mt-5 sm:mt-6 flex justify-between items-center gap-2">
            <button
              type="button"
              disabled={loading}
              className="inline-flex justify-center w-full rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-200 dark:bg-gray-600"
              onClick={saveEditing}
            >
              Save
            </button>
            <button
              type="button"
              disabled={loading}
              className="inline-flex justify-center w-full rounded-lg border shadow-sm px-4 py-2 border-gray-700"
              onClick={() => {
                setEditGroup(false);
                setName("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGroup;
