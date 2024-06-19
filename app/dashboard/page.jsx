import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { app } from '@/firebase'
import Image from 'next/image'

const Page = async() => {
  const session=await getServerSession(authOptions);

  const db=getFirestore(app);
  const q=query(collection(db,"post"),orderBy("timestamp","desc"));
  const datas=await getDocs(q);
 let data=[];
 datas.forEach((doc)=>{
  data.push({id:doc.id,...doc.data()})
 })
  return (
    <div>
    {
      data.map((single)=>{
        return (
          <div key={single.id}>
             {single.caption}
             <Image src={single.Image} alt="profile" width={100} height={100} />
            </div>
        )
      })
    }
    </div>
  )
}

export default Page
