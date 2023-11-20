<template>
  <v-container fluid class="Login d-flex align-center justify-center" style="height: 100%;">
    <v-card class="LoginCard d-flex rounded-xl" elevation="5">
      <v-row class='pa-5 my-1'>
        <v-col cols="12">
          <v-form ref="form">
            <v-col cols="12" class="text-center pa-0">
              <h1 style="color: #3b3b3b">Recovering Password</h1>
            </v-col>
            <v-col cols="12" class="text-center">
              <p>Please type your account email below, and You will received a reset password link.</p>
            </v-col>
            <v-col cols="12" class="mb-2">
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
              <trip-btn
                @click="onReset"
                rounded
                class="white--text"
                color="#3b3b3b"
                btn-label="SEND"
                dense
                block
              />
              <p class="text-center text-small error--text" style="margin: 0;" v-if="resetMsg">email is not found in our server </p>
            </v-col>
            <p class="text-center text-small" ><router-link to="/login" style="color: #3b3b3b">Back to Login</router-link></p>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
    <GDialog
      DioLabel="SEND"
      DioColor="#3b3b3b"
      label1="Reset Password"
      :label2="`Your reset password link has been sent to email ${email}`"
      :textProp ="email"
      rounded
      block
      :DioValue="ToggleDialog"
      @Dio-clicked="closeDio"
    />
  </v-container>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

export default {
  data () {
    return {
      greeting: false,
      show: false,
      email: '',
      resetMsg: '',
      ToggleDialog: false
    }
  },

  methods: {
    closeDio () {
      this.ToggleDialog = false
      this.email = ' '
    },
    onReset () {
      const auth = getAuth()
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.ToggleDialog = true
        })
        .catch(() => {
          this.resetMsg = true
        });
    },
    toHomePage () {
      setTimeout(() => {
        this.$router.push('/user/home')
      }, 3000)
    }
  }
}
</script>

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
