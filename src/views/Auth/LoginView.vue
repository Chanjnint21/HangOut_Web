<template>
  <v-container fluid class="Login d-flex align-center justify-center" style="height: 100%;">
    <template v-if="greeting">
      <h1 style="color:white">Welcome Back, {{ name }}<span id="fade-in-text"> !</span></h1>
    </template>
    <v-card class="LoginCard d-flex rounded-xl" elevation="8" v-else>
      <v-row class='pa-5 my-1'>
        <v-col
          class="d-flex align-center justify-center"
          cols="12"
          md="5"
          sm="5"
          xs="12"
        >
          <v-img
            contain src="@/assets/HangOut_logo.png"
            max-height="400"
            max-width="300"
          />
        </v-col>
        <v-col cols="12" md="7" sm="7" xs="12">
          <v-form ref="form">
            <v-row class="d-flex justify-center">
              <h1 style="color: #3b3b3b; margin-bottom: 20px;">Sign In</h1>
            </v-row>
            <v-col cols="12">
              <text-field
                v-model="email"
                label="Email"
                outlined
                color="#3b3b3b"
                name="email"
                hide-details="auto"
                rounded
              />
            </v-col>
            <v-col cols="12">
              <text-field
                v-model="password"
                label="Password"
                name="password"
                outlined
                :icons="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                hint="Password must be at least 8 characters"
                required
                color="#3b3b3b"
                :type="show ? 'text' : 'password'"
                hide-details="auto"
                rounded
              />
            </v-col>
            <v-col cols="12" >
              <trip-btn
                @click="loginToken"
                rounded
                class="white--text"
                color="#3b3b3b"
                btn-label="Login"
                dense
                block
              />
              <p class="text-center text-small error--text" style="margin: 0" v-if="login">Invalid email or password </p>
            </v-col>
            <v-col class="text-center py-0">
              <router-link to="/register" style="color: #3b3b3b">Register Now</router-link> | 
              <router-link to="/recover_password" style="color: #3b3b3b">Reset Password</router-link>
            </v-col>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import AuthService from '../../service/AuthService'

export default {
  data () {
    return {
      greeting: false,
      show: false,
      email: '',
      password: '',
      login: '',
      name: ''
    }
  },

  methods: {
    async loginToken () {
      const Token = await AuthService.login(this.email, this.password)
      if (Token) {
        this.name = Token.name
        this.greeting = true
        this.toHomePage()
      } else {
        this.login = true
      }
    },
    toHomePage () {
      setTimeout(() => {
        this.$router.push(`/user/home`).catch(() => {})
      }, 3000)
    }
  }
}
</script>

<!-- greeting animation -->
<style scoped>
#fade-in-text {
  font-family: Arial;
  animation: ease-in 2s infinite;
}

@keyframes ease-in {
  0% { opacity: 0; }
  25% { opacity: 1; }
  50% { opacity: 0; }
  75% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
