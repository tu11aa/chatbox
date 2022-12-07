import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../CSS/Chatbox.module.css"
import { db } from "../firebase.config"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { AiOutlineMenu } from "react-icons/ai"
import { IconContext } from "react-icons";

const Chatbox = () => {
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  const [chats, setChats] = useState(Array)
  const [users, setUsers] = useState(Object)
  const [message, setMessage] = useState("")
  const [noitice, setNoitice] = useState("")
  const [avaIndexs, setAvaIndexs] = useState({})
  const [uid] = useState(window.sessionStorage.getItem("uid"))
  const avaSlide = 5000
  //set message
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
  //handle enter press
  const handleKeydown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }
  //get data
  useEffect(() => {
    if (!uid) return navigate("/")

    const func = async () => {
      const roomSnap = await getDoc(doc(db, "rooms", "roomSample"))
      setChats(roomSnap.data()?.messages)

      setNoitice(await roomSnap.data()?.noitice)

      const uids = await roomSnap.data()?.uids
      uids.forEach(async (uid: string) => {
        const userSnap = await getDoc(doc(db, "users", uid))
        setUsers((prev: Object) => ({ ...prev, [uid]: userSnap.data() }))
      })
    }
    func()
  }, [])
  //realtime chat
  useEffect(() => {
    const func = async () => {
      const unsub = onSnapshot(doc(db, "rooms", "roomSample"), (_doc) => {
        const currentRoom = _doc.data()

        if (currentRoom?.messages.length !== chats.length) setChats(currentRoom?.messages)

        if (currentRoom?.uids.length !== Object.keys(users).length) {
          currentRoom?.uids.forEach(async (uid: string) => {
            const userSnap = await getDoc(doc(db, "users", uid))
            setUsers((prev: Object) => ({ ...prev, [uid]: userSnap.data() }))
            setAvaIndexs((prev: Object) => ({ ...prev, [uid]: 0 }))
          })
        }
      });
    }
    func()
  })
  //alternative method
  // useEffect(() => {
  //   for (const uid in users)
  //     setAvaIndexs((prev: Object) => ({ ...prev, [uid]: Math.floor(Math.random() * users[uid].image.length) }))
  // }, [users])
  //auto scroll down
  useEffect(() => {
    //@ts-ignore
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats])
  //slide avata
  useEffect(() => {
    const timer = setTimeout(() => {
      const temp = {}
      //@ts-ignore
      for (const i in avaIndexs) temp[i] = (avaIndexs[i] + 1) % users[i].image.length
      setAvaIndexs(temp)
    }, avaSlide);
    return () => clearTimeout(timer);
  }, [avaIndexs, users])

  return (
    <IconContext.Provider value={{ size: "3rem" }}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {/* @ts-ignore */}
              <img src={uid && users[uid]?.image[avaIndexs[uid]]} alt="Avatar" onClick={() => { window.open(uid && users[uid]?.image[avaIndexs[uid]], "_blank") }} />
            </div>
            <h1>{noitice}</h1>
            <AiOutlineMenu />
          </div>
          <div className={styles.body}>
            {chats.map((chat: any, index) =>
              <div className={styles.messageContainer} key={index}>
                {chat.uid === uid ?
                  <>
                    <p className={`${styles.message} ${styles.floatRight}`}>{chat.content}
                      <p className={`${styles.floatRight} ${styles.timestamp}`}>{chat.timestamp.toDate().toLocaleDateString('en-US')} {chat.timestamp.toDate().toLocaleTimeString('en-US')}</p>
                    </p>
                  </> :
                  <>
                    {//@ts-ignore
                      (chats[index - 1] != undefined && chats[index - 1].uid !== chat.uid) &&
                      <div className={styles.displayName}>
                        {/* @ts-ignore */}
                        <img src={users[chat.uid]?.image[avaIndexs[chat.uid]]} alt="" onClick={() => { window.open(users[chat.uid]?.image[avaIndexs[chat.uid]], "_blank") }} />
                        <span>{users[chat.uid].displayName}</span>
                      </div>
                    }
                    <p className={styles.message}>{chat.content}
                      <p className={styles.timestamp}>{chat.timestamp.toDate().toLocaleDateString('en-US')} {chat.timestamp.toDate().toLocaleTimeString('en-US')}</p>
                    </p>
                  </>
                }
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className={styles.footer}>
            <input type="text" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeydown} />
            <input type="submit" value="Send" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </IconContext.Provider>

  )
}

export default Chatbox