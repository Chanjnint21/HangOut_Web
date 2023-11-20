<template>
  <v-container class="MainContain">
    <v-card class="rounded-xl">
      <v-col cols="1">
        <v-btn @click="back" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-card-title class="d-flex justify-center">Event Card</v-card-title>
      <form-component ref="form" v-model="form" :validity.sync="isFormComplete" @testing="passimagedata" :crrUser="crrUser">
        <template v-slot:FormBtn1>
          <trip-btn
            name="Publish"
            @click="publishPost(true)"
            class="white--text mx-3"
            color="#fc9652"
            btn-label="Publish"
            :disabled="!isFormComplete"
          />
        </template>
        <template v-slot:FormBtn2>
          <save-dialog button @saveChanges="publishPost(false)"/>
        </template>
      </form-component>
    </v-card>
    <save-dialog :dio_val="Sdialog" @saveChanges="publishPost(false)"/>
  </v-container>
</template>

<script>
import { Service } from '@/service/index.js'
import { C_Service } from '@/service/cards'
import FormComponent from './Component/FormComponent.vue'
import SaveDialog from './Component/SaveDialog.vue'
import { storage } from '@/firebase'
import { ref, uploadBytes } from 'firebase/storage'

export default {
  name: 'TripCard',
  components: {
    FormComponent,
    SaveDialog
  },
  data () {
    return {
      originalTripCard: null,
      Sdialog: false,
      form: {},
      crrUser: null,
      isFormComplete: false,
      tripDate: [],
      time: '',
      Images: [],
      IMageData: null
    }
  },
  methods: {
    passimagedata (newVal) {
      this.IMageData = newVal
    },
    async publishPost (publish) {
      // if (this.isFormComplete) {
        const form = {
          id: '',
          postDate: new Date().toLocaleDateString(),
          postTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
          author: {
            id: this.crrUser.id,
            name: this.crrUser.name
          },
          title: this.form.title,
          destination: this.form.destination,
          start_date: this.form.start_date,
          end_date: this.form.end_date,
          detail: this.form.detail,
          image: this.form.image,
          category: this.form.category,
          departure: {
            meet_location: this.form.meet_location || '',
            leave_time: this.form.leave_time || ''
          },
          requirement: {
            age: this.form.age || '',
            cost: this.form.cost || '',
            nationalId: this.form.nationalId || '',
            phoneNumber: this.form.phoneNumber || '',
            amount: this.form.amount || '',
            transportation: this.form.transportation || ''
          },
          expiry: false
        }
        try {
          if (publish) {
            if (this.IMageData !== null) {
              for (let i = 0; i < this.IMageData.length; i++) {
                const file = this.IMageData[i]
                const storageRef = ref(storage, `folder/${this.form.image[i]}`)
                uploadBytes(storageRef, file).then((snapshot) => {
                  console.log(snapshot)
                })
              }
            } else {
              form.image = ['NoImage.jpg']
            }
            await C_Service.newTripCard(form)
            this.$router.back()
          } else {
            this.SaveChanges (form)
          }
        } catch (e) {
          console.log(e)
        }
    },
    async SaveChanges (form) {
      try {
        await C_Service.draftCard(form)
        this.$router.back()
      } catch (e) {
        console.log(e)
      }
    },
    draftPost () {
      this.$router.back()
    },
    back () {
      if (Object.keys(this.form).length === 1) {
        this.$router.back()
      } else {
        this.Sdialog = true
      }
    },
    isFormModified () {
      return JSON.stringify(this.originalTripCard) !== JSON.stringify(this.form)
    }
  },
  async created () {
    this.crrUser = await Service.crrUserData()
  }
}
</script>
