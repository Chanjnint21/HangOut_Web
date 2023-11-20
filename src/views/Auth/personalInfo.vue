<template>
  <v-tab-item
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-form ref="form" v-model="regForm">
      <v-row no-gutters>
        <v-col cols="12" class="text-center pa-2">
          <!-- <v-img width="50" src="../../assets/Img/logo276678.png" /> -->
          <p class="text--disabled">Please type all the requirements below</p>
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            v-model="personalForm.firstName"
            color="#3b3b3b"
            label="First name"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            v-model="personalForm.lastName"
            color="#3b3b3b"
            label="Last name"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            v-model="personalForm.phoneNumber"
            color="#3b3b3b"
            label="Phone number"
            :rules="[rules.phoneNumber]"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            v-model="personalForm.email"
            color="#3b3b3b"
            label="Email"
            :rules="[rules.email]"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            :type="show ? 'text' : 'password'"
            v-model="passWords"
            color="#3b3b3b"
            label="Password"
            :rules="[rules.passwords]"
            :icons="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pa-2">
          <text-field
            v-model="cfPassword"
            color="#3b3b3b"
            :error-messages="passwordError"
            label="Confirm Password"
            :type="show ? 'text' : 'password'"
          />
        </v-col>
        <v-col cols="12" class="text-right">
          <!-- <slot v-if="regForm" name="personal_info"></slot> -->
          <trip-btn
            class="white--text mx-2"
            color="#fc9652"
            :disabled="!regForm"
            @click="nextTab"
          >
            <template #icon>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </trip-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-tab-item>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      regForm: false,
      rules: {
        passwords: v => {
          const pattern = /(?=.*[A-Z])(?=.*\d)/
          if (!pattern.test(v)) {
            return 'Must have at least one Capital letter and number';
          }
          return v.length >= 8 || 'Must be at least 8 characters long';
        },
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
        phoneNumber: v => {
          if (isNaN(v)) {
            return 'Invalid phone number';
          }
          return v.length >= 9 || 'Invalid phone number';
        }
      },
      passWords: '',
      cfPassword: '',
      personalForm: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
      },
      passwordError: ''
    }
  },
  watch: {
    cfPassword () {
      if (this.cfPassword !== this.passWords) {
        this.passwordError = 'confirm password not match to password'
      } else {
        this.passwordError = ''
        this.personalForm.password = this.cfPassword
      }
      return true
    }
  },
  methods: {
    nextTab () {
      this.$emit('personalForm', this.personalForm)
    }
  }
}
</script>
