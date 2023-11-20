<template>
  <div>
    <v-form ref="form" @input="val => $emit('update:validity',val)">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <text-field
              name="title"
              v-model="form.title"
              label="Title"

              icons="mdi-alpha-t"
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field
              name="destination"
              v-model="form.destination"
              label="Destination"

              icons="mdi-map-marker"
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <date-picker
              v-model="form.start_date"
              label="Start Date"
              :min='currentDate'
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <date-picker
              :min="validateMinMax"
              v-model="form.end_date"
              label="End Date"
              :rules="[rules.createrule]"
              :err_msg="errorDate"
            />
          </v-col>
          <v-col cols="12">
            <text-area
              name="details"
              v-model="form.detail"
              outlined
              rounded
              label="Details"
              counter
            />
          </v-col>
          <v-col cols="12">
            <file-field
              name="imageSrc"
              label="Image(s)"
              multiple
              @files_item="imageData"
            />
          </v-col>
          <slot name="onUpdateRoute">
          </slot>
          <v-col cols="12">
            <select-field
              name="Categorise"
              v-model="form.category"
              label="Category"
              outlined
              :SelectItem="Tags"
              multiple
              rounded
              small-chips
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" class="d-flex justify-center text-h6">- Departure -</v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field
              name="meetLocation"
              v-model="form.meet_location"
              label="Meet Location"
              icons="mdi-map-marker"
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <time-picker
                name="timeLeave"
                v-model="form.leave_time"
                :rules="[rules.createrule]"
              />
          </v-col>
          <v-col cols="12" class="d-flex justify-center text-h6">- Requirements -</v-col>
          <v-col cols="12" sm="6" md="6" class="d-flex align-center">
            <v-col cols="12">
              <range-slider-field
                name="ageRange"
                v-model="form.age"
                label="Age"
                hint="Im a hint"
                max="90"
                min="15"
                thumb-label
                persistent-hint
                :rules="[rules.createrule]"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field
              type="number"
              name="cost"
              v-model.number="form.cost"
              label="Cost/Person"

              icons="mdi-currency-usd"
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <select-field
              name="nationalId"
              v-model="form.nationalId"
              label="National ID"

              outlined
              rounded
              :SelectItem="Choice"
              :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <select-field
            name="phoneNumber"
            v-model="form.phoneNumber"
            label="Phone Number"
            color="#1687A7"
            outlined
            rounded
            :SelectItem="Choice"
            :rules="[rules.createrule]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field
              type="number"
              name="amount"
              v-model.number="form.amount"
              label="People"
              outlined
              rounded
              icons="mdi-account-multiple-outline"
              :rules="[rules.amount]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <select-field
              name="transportation"
              v-model="form.transportation"
              label=" Transportation"

              outlined
              rounded
              :SelectItem="Choice"
              :rules="[rules.createrule]"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="d-flex justify-center pb-5">
          <v-col cols='1' class="d-flex justify-center">
            <slot name="FormBtn1"></slot>
            <slot name="FormBtn2"></slot>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'tripForm',
  props: {
    value: {
      type: Object
    },
    validity: {
      type: Boolean,
      default: false
    },
    crrUser: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      Choice: ['Not Require', 'Require'],
      Tags: [
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
        'Event Traveling',
        'Heritage Walk'
      ],
      rules: {
        createrule: value => !!value || 'field required',
        amount: v => v >= 1 || 'invalid amount'
      },
      emitImageData: [],
      PostBtn: true,
      errorDate: '',
      form: {
        id: '',
        postDate: '',
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        detail: '',
        image: [],
        category: null,
        meet_location: '',
        age: [],
        leave_time: '',
        cost: '',
        nationalId: '',
        phoneNumber: '',
        amount: '',
        transportation: ''
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (val) {
        this.form = val
        if (this.form.start_date > this.form.end_date) {
          this.errorDate = 'End Date must not end before Start Date'
        } else {
          this.errorDate = ''
        }
      }
    },
    emitImageData (newVal) {
      this.$emit('testing', newVal)
    }
  },
  computed: {
    currentDate () {
      const currentDate = new Date()
      const day = String(currentDate.getDate()).padStart(2, '0') // Ensure two digits, e.g., 05 instead of 5
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Months are zero-based, so add 1, and ensure two digits
      const year = currentDate.getFullYear()
      return day + '/' + month + '/' + year
    },
    validateMinMax () {
      const startDate = this.form.start_date || this.currentDate
      return startDate
    }
  },
  methods: {
    validate () {
      this.isFormComplete = this.$refs.form.validate()
      this.$emit('form-complete', this.isFormComplete)
    },
    StartDate (value) {
      this.form.start_date = value
    },
    EndDate (value) {
      this.form.end_date = value
    },
    LeaveTime (value) {
      this.form.leave_time = value
    },
    imageData (newVal) {
      this.emitImageData = newVal
      const getImage = []
      for (let i = 0; i < newVal.length; i++) {
        const date = new Date().toJSON().slice(0, 10)
        const time = new Date().toLocaleTimeString('en-US', { hour12: false })
        const fileName = `${this.crrUser.name}${date}${time}_${i}`
        getImage.push(fileName)
      }
      this.form.image = getImage
    }
  },
}
</script>
