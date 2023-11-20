<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5 mb-5">Registration Form</span>
        </v-card-title>
        <v-card-text>
          <v-form ref='form' v-model="isFormComplete">
            <v-row>
              <v-col
                cols="12"
              >
              <text-field
                v-model="regisForm.userName"
                  label="Username"
                  required
                  readonly
                  :rules="[rules.createrule]"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <text-field
                  v-model="regisForm.firstName"
                  label="First name"
                  required
                  :rules="[rules.createrule]"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <text-field
                  v-model="regisForm.lastName"
                  label="Last name"
                  :rules="[rules.createrule]"

                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <text-field
                  v-model="regisForm.phoneNumber"
                  label="Phone number"
                  required
                  :rules="[rules.createrule]"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <text-field
                  v-model="regisForm.age"
                  type="number"
                  label="Age"
                  required
                  :rules="rules.ageRule"

                />
              </v-col>
              <v-col cols="12">
                <file-field
                  name="imageSrc"
                  label="Image"
                  color="#1687A7"
                  outlined
                  rounded
                  icon="mdi-image"
                  hint="Click to upload your national ID Card"
                  persistent-hint
                  :rules="[]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#3b3b3b"
                text
                @click="onCancel"
              >
                Cancel
              </v-btn>

              <v-btn
                color="#fc9652"
                text
                @click="submit(); dialog = false"
                :disabled='!isFormComplete || limitRegister'
                :rules="[]"
              > Submit
              </v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>

  </template>

<script>
import { C_Service } from '@/service/cards.js'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    },
    crrUser: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isFormComplete: false,
    isAgeValid: false,
    dialog: false,
    registeredUser: [],
    limitRegister: false,
    regisForm: {
      id: '',
      user_id: '',
      userName: '',
      firstName: '',
      age: '',
      lastName: '',
      phoneNumber: '',
      card_id: '',
      reg_date: new Date().toLocaleDateString(),
      reg_time: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  }),
  computed: {
    getMinAge () {
      return console.log('min', this.item.requirement?.age[1])
    },
    rules () {
      return {
        createrule: this.validateCreateRule,
        ageRule: [
          v => (v >= this.item.requirement.age[0] && v <= this.item.requirement.age[1]) || `Age must be between ${this.item.requirement.age[0]} and ${this.item.requirement.age[1]}`
        ]
      }
    }
  },
  watch: {
    dialog (newVal) {
      if (newVal) {
        this.regisForm.userName = this.crrUser.name
        this.regisForm.user_id = this.crrUser.id
        this.regisForm.card_id = this.item.id
        this.regisForm.phoneNumber = this.crrUser.phone
        this.regisForm.firstName = this.crrUser.firstName
        this.regisForm.lastName = this.crrUser.lastName
        console.log(this.crrUser)
        // this.validateForm()
      }
    },
    value (val) {
      this.dialog = val
    },
    age: {
      immediate: true,
      handler (newVal) {
        this.ageRule = newVal
      }
    }
  },
  methods: {
    async submit () {
      if (this.isFormComplete) {
        try {
          await C_Service.submitRegister(this.regisForm)
          this.clearForm()
          this.$emit('onRegister', true)
        } catch (e) {
          console.log(e)
        }
      }
    },
    onCancel () {
      this.$emit('onCancel')
    },
    // validateForm () {
    //   this.isFormComplete = this.$refs.form.validate()
    // },
    validateCreateRule (value) {
      return !!value || 'field required'
    },
    clearForm () {
      this.userName = ''
      this.firstName = ''
      this.age = ''
      this.lastName = ''
      this.phoneNumber = ''
      this.card_id = ''
    },
    countData (userData) {
      for (let i = 0; i < userData.length; i++) {
        this.registeredUser.push(userData[i])
        console.log(this.registeredUser)
      }
    },
    validateRegisUser () {
      if (this.countData < this.item.requirement.amount) {
        this.isFull = false
      } else {
        this.isFull = true
      }
    }
  }
}
</script>
