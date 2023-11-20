<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <trip-btn
        v-bind="attrs"
        v-on="on"
        class="white--text"
        color="#3b3b3b"
        btn-label="Profile"
        rounded
        @click="displayData"
        >
        <template v-slot:icon>
          <v-icon>mdi-account-edit</v-icon>
        </template>
      </trip-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Edit Profile</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-col cols="12" class="d-flex justify-center ">
                <v-avatar size="150">
                  <v-img :src="uImg" alt="user_profile"/>
                </v-avatar>
              </v-col>
              <v-col cols="12" class="pa-0 ma-0">
                <file-field
                  name="imageSrc"
                  hide-details="auto"
                  label="Change profile"
                  @files_item="imageData"
                />
              </v-col>
            </v-col>
            <v-col cols="12" sm="6">
              <text-field
                v-model="userName"
                name="Username"
                label="Username"
              />
              <text-area
                v-model="userBio"
                name="Bios"
                outlined
                rounded
                label="Bio"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12">
              <p class="text-center">- comfirm change -</p>
              <text-field
                type="password"
                v-model="password"
                :error-messages="errorMessages"
                name="destination"
                label="password"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#3b3b3b"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="#fc9652"
          text
          :disabled="Valid"
          @click="onCheckPassword()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Service } from '@/service/index.js'
import AuthService from '@/service/AuthService'
import TextField from '@/components/TextField.vue'
import { storage } from '@/firebase'
import { ref, uploadBytes } from 'firebase/storage'

export default {
  components: { TextField },
  props: {
    crrUserData: {
      type: Object,
      default: () => {}
    },
    profileUrl: {
      type: String
    }
  },
  data: () => ({
    dialog: false,
    Valid: true,
    uImg: '',
    userName: '',
    userBio: '',
    password: '',
    errorMessages: '',
    changePic: null,
    thisUser: null,
    imgData: null
  }),
  watch: {
    password (newVal) {
      if (newVal !== '') {
        this.Valid = false
      } else {
        this.Valid = true
      }
    }
  },
  methods: {
    displayData () {
      this.thisUser = this.crrUserData
      this.uImg = this.profileUrl
      this.userName = this.thisUser.name
      this.userBio = this.thisUser.bio
    },
    async onCheckPassword () {
      try {
        const Token = await AuthService.login(this.crrUserData.email, this.password)
        if (Token) {
          if (this.imgData === null) {
            this.changePic = this.crrUserData.image
            this.onUpdatingProfile(this.changePic)
          } else {
            const file = this.imgData
            const date = new Date().toJSON().slice(0, 10)
            const time = new Date().toLocaleTimeString('en-US', { hour12: false })
            const fileName = `${this.crrUserData.name}${date}${time}`
            const storageRef = ref(storage, `profile/${fileName}`)
            uploadBytes(storageRef, file).then(() => {
              this.onUpdatingProfile(fileName)
            })
          }
        } else {
          this.errorMessages = 'Invalid password'
        }
      } catch (e) {
        console.log(e)
      }
    },
    async onUpdatingProfile (newImage) {
      const pfInfo = {
        name: this.userName,
        bio: this.userBio,
        image: newImage
      }
      this.thisUser.name = pfInfo.name
      this.thisUser.bio = pfInfo.bio
      this.thisUser.image = pfInfo.image
      await Service.updateUser(this.thisUser.id, pfInfo)
      this.$router.push(`/user/profile/${pfInfo.name}`)
    },
    imageData (newVal) {
      if (newVal === null) {
        this.imgData = null
        return
      }
      this.uImg = URL.createObjectURL(newVal)
      this.imgData = newVal
    },
  }
}
</script>
