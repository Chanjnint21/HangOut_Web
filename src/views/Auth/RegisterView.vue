<template>
  <v-container fluid class="Login d-flex align-center justify-center" style="height: 100%; width:100%">
      <template v-if="greeting">
        <h1 style="color:white">Welcome to Outdoor Traveler, {{ name }}<span id="fade-in-text"> !</span></h1>
      </template>
      <v-card class="RegisterCard rounded-xl" elevation="5" v-else>
        <v-toolbar>
          <v-col cols="2">
            <trip-btn
                icon
                @click="back">
                <template #icon>
                  <v-icon class="pa-2">mdi-arrow-left</v-icon>
                </template>
              </trip-btn>
          </v-col>
          <v-col cols="8" class="text-center">
            <v-toolbar-title style="color: #3b3b3b;" ><h3>Register</h3></v-toolbar-title>
          </v-col>
          <v-spacer></v-spacer>
          <template v-slot:extension>
            <v-tabs
              v-model="tabs"
              fixed-tabs
              color="#3b3b3b"
              show-arrows
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab
                href="#personal_info"
              >
                <span class><v-icon>mdi-numeric-1-circle</v-icon>Personal Information</span>
              </v-tab>
              <v-tab
                href="#additional_info"
              >
                <span class><v-icon>mdi-numeric-2-circle</v-icon>Additional Info</span>
              </v-tab>
              <v-tab
                href="#profile_info"
                :disabled="additionTab"
              >
                <span class><v-icon>mdi-numeric-3-circle</v-icon>Profile Setup</span>
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-tabs-items v-model="tabs" class="pa-5">
          <personal-info value="personal_info" @personalForm="getPersonalForm"/>
          <additional-info value="additional_info" @additionForm="getAdditionForm">
            <template #addi_info>
              <trip-btn
                class="white--text mx-2"
                color="#3b3b3b"
                @click="backTab('personal_info')"
              >
                <template #icon>
                  <v-icon>mdi-chevron-left</v-icon>
                </template>
              </trip-btn>
            </template>
          </additional-info>
          <profile-info value="profile_info" :userName="passUsername" @profileInfo="getProfileInfo">
            <template #profileSetup>
              <trip-btn
                class="white--text mx-2"
                color="#3b3b3b"
                @click="backTab('additional_info')"
              >
                <template #icon>
                  <v-icon>mdi-chevron-left</v-icon>
                </template>
              </trip-btn>
            </template>
          </profile-info>
        </v-tabs-items>
      </v-card>
  </v-container>
</template>

<script>
// import bcrypt from 'bcryptjs'
import personalInfo from './personalInfo.vue'
import additionalInfo from './AdditionalInfo.vue'
import profileInfo from './ProfileInfo.vue'
import { storage } from '@/firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { Service } from '@/service/index.js'
import AuthService from '../../service/AuthService'

export default {
  components: {
    personalInfo,
    profileInfo,
    additionalInfo
  },
  data () {
    return {
      greeting: false,
      tabs: null,
      passUsername: '',
      additionTab: true,
      profileTab: true,
      name: '',
      userForm: {
        name: '',
        image: '',
        email: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        bio: '',
        verify: false
      }
    }
  },
  methods: {
    back () {
      this.$router.push('/login')
    },
    backTab (val) {
      this.tabs = val
    },
    nextTab (val) {
      this.tabs = val
    },
    getPersonalForm (newVal) {
      this.userForm = { ...newVal }
      if (newVal) {
        this.additionTab = false
        this.tabs = 'additional_info'
      }
    },
    getAdditionForm (newVal) {
      this.userForm.name = newVal.username
      this.userForm.Interest = newVal.Interest
      if (newVal) {
        this.profileTab = false
        this.passUsername = newVal.username
        this.tabs = 'profile_info'
      }
    },
    getProfileInfo (newVal) {
      this.userForm.bio = newVal.bio
      this.userForm.image = newVal.image
      if (newVal.imgdata.length !== null) {
        const file = newVal.imgdata
        const storageRef = ref(storage, `profile/${newVal.image}`)
        uploadBytes(storageRef, file).then(() => {
          {console.log("success")}
        })
      }
      // on register
      if (newVal) {
        this.addUserAuth()
      }
    },
    // add the user auth
    async addUserAuth () {
      const Token = await AuthService.signup(this.userForm.email, this.userForm.password)
      if (Token !== false) {
        this.name = this.userForm.name
        this.greeting = true
        this.onRegister(Token)
      }
    },
    // register it into database
    async onRegister (uid) {
      const RegisterList = {
        name: this.userForm.name,
        image: this.userForm.image,
        email: this.userForm.email,
        role: 'user',
        tokenId: uid,
        phone: this.userForm.phoneNumber,
        firstName: this.userForm.firstName,
        lastName: this.userForm.lastName,
        bio: this.userForm.bio,
        Interest: this.userForm.Interest,
        verify: false
      }
      try {
        await Service.Register(RegisterList)
        this.toHomePage()
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    },
    toHomePage () {
      setTimeout(() => {
        this.$router.push('/user/home').catch(() => {})
      }, 5000)
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
