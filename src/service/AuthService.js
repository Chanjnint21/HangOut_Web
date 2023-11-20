import VueCookie from 'vue-cookie';
import { Service } from '@/service/index.js'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

class AuthService {
  
  static async signup(email, password) {
    const auth = getAuth()
	let Token;
    await createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const uid = userCredential.user.uid
			Token = uid
			this.onStoringAuth(uid)
		})
		.catch(() => {
			Token = false
		})
	return Token
  }

	static async checkUsername(name) {
		const TakenName = await Service.allUsers()
		let Taken;
		for (const userId in TakenName) {
			const userData = TakenName[userId];
			if (userData.name === name) {
				Taken = true
				break
			} else {
				Taken = false
				break
			}
		}
		return Taken;
	}

  static async login(email, password) {
    const auth = getAuth()
		let Token;
		await signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const uid = userCredential.user.uid
				Token = this.onStoringAuth(uid)
			})
			.catch(() => {
				Token = false
			})
		return Token
  }

	// storing login token in session
  static async onStoringAuth (uid) {
	await VueCookie.set('session',  uid, { expires: '1D' })
	const crrUser = await Service.crrUserData()
	return crrUser
  }

  // Check if the user is logged in
  static isLoggedIn() {
    const session = VueCookie.get('session');
    return !!session;
  }

  // Log out the user and remove the session cookie
  static logout() {
    VueCookie.delete('session')
  }
}

export default AuthService