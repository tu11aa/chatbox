import { useEffect, useState } from "react"
import styles from "../CSS/Login.module.css"
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from "../firebase.config"

const Login = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState({ email: "", password: "", image: "" })
  const [checked, setChecked] = useState(false)

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )

      if (userCredential.user) {
        window.sessionStorage.setItem("uid", userCredential.user.uid)
        navigate("/chatbox")
      }
    }
    catch (error) {
      console.log(error);
      toast.error('Bad User Credentials')
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Welcome</h1>
        <input type="email" value={user.email} onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
        <input type={checked ? "" : "password"} value={user.password} onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))} placeholder="Password" />
        <div onClick={() => setChecked(!checked)}><input type="checkbox" value="Remember me?" checked={checked} onChange={() => setChecked(!checked)} />Show password</div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  )
}

export default Login