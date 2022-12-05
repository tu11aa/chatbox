import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../CSS/Chatbox.module.css"
import { db } from "../firebase.config"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

const Chatbox = () => {
  const navigate = useNavigate()

  const [chats, setChats] = useState(Array)
  const [users, setUsers] = useState(Object)
  const [message, setMessage] = useState("")
  const [uid] = useState(window.sessionStorage.getItem("uid"))

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (message === "") return

    const messageObject = {
      content: message,
      timestamp: Timestamp.now(),
      uid: uid
    }

    setChats(prev => ([...prev, messageObject]))
    await updateDoc(doc(db, "rooms", "roomSample"), {
      messages: arrayUnion(messageObject)
    })

    setMessage("")
  }

  const handleKeydown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (!uid) return navigate("/")

    const func = async () => {
      const roomSnap = await getDoc(doc(db, "rooms", "roomSample"))
      setChats(roomSnap.data()?.messages)
      const uids = await roomSnap.data()?.uids

      uids.forEach(async (uid: string) => {
        const userSnap = await getDoc(doc(db, "users", uid))
        setUsers((prev: Object) => ({ ...prev, [uid]: userSnap.data() }))
      })
    }
    func()
  }, [])

  useEffect(() => {
    const func = async () => {
      const unsub = onSnapshot(doc(db, "rooms", "roomSample"), (_doc) => {
        const currentRoom = _doc.data()

        if (currentRoom?.messages.length !== chats.length) setChats(currentRoom?.messages)

        if (currentRoom?.uids.length !== Object.keys(users).length) {
          currentRoom?.uids.forEach(async (uid: string) => {
            const userSnap = await getDoc(doc(db, "users", uid))
            setUsers((prev: Object) => ({ ...prev, [uid]: userSnap.data() }))
          })
        }
      });
    }
    func()
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header} onClick={() => console.log(uid && users[uid].image)}>
          <div className={styles.avatar}>
            <img src={uid && users[uid]?.image} alt="None" />
          </div>
        </div>
        <div className={styles.body}>
          {chats.map((chat: any, index) =>
            <div className={styles.messageContainer} key={index}>
              {chat.uid === uid ?
                <>
                  <p className={`${styles.message} ${chat.uid === uid && styles.floatRight}`}>{chat.content}</p>
                  <img src={users[chat.uid]?.image} alt="" />
                </> :
                <>
                  <img src={users[chat.uid]?.image} alt="" />
                  <p className={`${styles.message} ${chat.uid === uid && styles.floatRight}`}>{chat.content}</p>
                </>
              }
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <input type="text" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeydown} />
          <input type="submit" value="Send" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Chatbox