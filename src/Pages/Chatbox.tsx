import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../CSS/Chatbox.module.css"
import {auth, db} from "../firebase.config"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"; 

const Chatbox = () => {
  const navigate = useNavigate()

  const handleSubmit = () => {
    
  }

  useEffect(()=>{
    if(!auth.currentUser) navigate("/")
    const func = async () => {
      const userRoomsRef = collection(db, "userRooms");
      const q = query(userRoomsRef, where("uid", "==", auth.currentUser?.uid))
      const userRooms = await getDocs(q)
      userRooms.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    }
    func()
  }, [])

  return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <div className={styles.header}>

            </div>
            <div className={styles.body}></div>
            <div className={styles.footer}>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter message"/>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Chatbox