<template>
  <v-tab-item
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-row>
      <v-col cols="12">
        <text-field
          v-model="additionForm.username"
          id="username"
          name="Username"
          label="Username"
          color="#3b3b3b"
          hide-details="auto"
          @keyup="checkTakeName(additionForm.username)"
          :error-messages="usernameError"
        />
      </v-col>
      <v-col cols="12">
        <p class="text--disabled">Select at least 5 tags you inerest in :</p>
        <v-btn-toggle v-model="additionForm.Interest" class="d-flex justify-space-around" dense multiple>
          <v-row>
            <template v-for="n in tagLabel.length - 1" >
              <v-col cols="6" sm="3"  :key="n">
                <trip-btn
                  color="#3b3b3b"
                  :btn-label="tagLabel[n]"
                  rounded
                  outlined
                  :value="tagLabel[n]"
                  :id="tagLabel[n]"
                  block
                  :disabled="btnDisabled"
                />
              </v-col>
            </template>
          </v-row>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" class="text-right">
        <slot name="addi_info">
          <trip-btn
            class="white--text mx-2"
            color="#3b3b3b"
            @click="backTab('personal_info')"
          >
            <template #icon>
              <v-icon>mdi-chevron-left</v-icon>
            </template>
          </trip-btn>
        </slot>
        <trip-btn
          :disabled="!regForm"
          class="white--text mx-2"
          color="#fc9652"
          @click="nextTab"
        >
          <template #icon>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </trip-btn>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script>
import AuthService from '../../service/AuthService'

export default {
  data () {
    return {
      regForm: false,
      btnDisabled: false,
      rules: {
        createRule: value => !!value || 'field required'
      },
      usernameError: '',
      isError: false,
      tagLabel: [
        '',
        'Adventure',
        'One day Trip',
        'Multi day Trip',
        'Hiking',
        'Camping',
        'Mountain',
        'Sea',
        'Forest',
        'Diving',
        'Volunteer Trip',
        'Joining Event',
        'Heritage Walk'
      ],
      additionForm: {
        username: '',
        Interest: []
      }
    }
  },
  watch: {
    additionForm: {
      deep: true,
      immediate: true,
      async handler () {
        if (this.additionForm.Interest.length < 5 || this.additionForm.username === '') {
          this.regForm = false
        } else if (this.additionForm.Interest.length < 5 || this.isError === true) {
          this.regForm = false
        } else {
          this.regForm = true
        }
      }
    }
  },
  methods: {
    nextTab () {
      this.$emit('additionForm', this.additionForm)
    },
    checkTakeName (name) {
      setTimeout(async () => {
        this.usernameError = ''
        const TakenName = await AuthService.checkUsername(name)
        if (TakenName) {
          this.usernameError = 'this username have already taken'
          this.regForm = false
          this.isError = true
        } else {
          this.isError = false
        }
      }, 500)
    }
  }
}
</script>
