"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaPlusCircle } from "react-icons/fa";
import Signin from "@/components/Signin";
import Signout from "@/components/Signout";
import { useSession } from "next-auth/react";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app ,db} from "../firebase";
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { addDoc,collection,getFirestore,serverTimestamp } from "firebase/firestore";

const Header = () => {
  const [isopen, setisopen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileurl, setImageFileurl] = useState(null);
  const filepickerref = useRef(null);
  const [caption,setcaption]=useState("")


  async function uploadPost() {
    const storage = getStorage(app);
    const fileName = selectedFile.name;
    const storageref = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageref, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading file:", error);
        // Handle upload errors (optional)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileurl(downloadURL);
        });
      }
    );
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileurl(URL.createObjectURL(file));
      console.log(imageFileurl);
    }
  };

  const handlesubmit =async () => {
    const db=getFirestore(app)
    const postref=await collection(db,"post")
    const docRef=await addDoc(postref,{
      username:session.user.username,
      profilePic:session.user.image,
      timestamp:serverTimestamp(),
      caption,
      image:imageFileurl  
    })
    
  }

  const { data: session } = useSession();
  console.log("the session information is",session)
  return (
    <div className=" p-3 sticky top-0 z-30 bg-white border-b shadow-sm shadow-black">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href={"/"}
          className="font-bold text-2xl flex items-center rounded-md"
        >
          <Image src="/instagram.png" width={50} height={50} alt="logo" />
          <Image src="/instaText.png" width={50} height={50} alt="logotext" />
        </Link>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="rounded-md bg-gray-200 border-gray-200 outline-none py-2 px-3"
          ></input>
        </div>
        <div
          className="flex space-x-2 cursor-pointer hover:scale-105"
          onClick={() => setisopen(true)}
        >
          <FaPlusCircle size={24} className="cursor-pointer hover:scale-105" />
          Add post
        </div>
        {session && isopen && (
          <Modal
            isOpen={isopen}
            ariaHideApp={true}
            onRequestClose={() => setisopen(false)}
            className="w-[300px] p-3 absolute top-56 left-1/2 mx-auto  shadow-md -translate-x-1/2 border-2 rounded-md"
          >
            <div className="flex flex-col relative space-y-4 items-center">
              <AiOutlineClose
                size={24}
                className="absolute top-0 right-0 cursor-pointer hover:scale-105"
                onClick={() => setisopen(false)}
              />

              {selectedFile ? (
                <Image
                  onClick={() => setSelectedFile(null)}
                  src={imageFileurl}
                  width={200}
                  height={200}
                  alt="selected image"
                  className="cursor-pointer hover:scale-105"
                />
              ) : (
                <>
                  <HiCamera
                    size={50}
                    onClick={() => filepickerref.current.click()}
                    className="cursor-pointer hover:scale-105"
                  />
                  <input
                    hidden
                    type="file"
                    ref={filepickerref}
                    className="w-full"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </>
              )}

              <input
                type="text"
                placeholder="type your caption here..."
                name="caption"
                className="p-3 w-full border-2 outline-none"
                maxLength={300}
                onChange={(e) => setcaption(e.target.value)}
              />
              <button onClick={handlesubmit} className="bg-black w-full disabled:bg-slate-500 text-white p-2 rounded-md">
                Post
              </button>
            </div>
          </Modal>
        )}
        {session ? <Signout /> : <Signin />}
      </div>
    </div>
  );
};

export default Header;
