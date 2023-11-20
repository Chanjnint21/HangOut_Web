<template>
  <div>
    <v-form ref="form" v-bind="$attrs" v-on="$listeners">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <text-field name="title" v-model="tripcard.title" label="Title" color="#1687A7" outlined rounded
              icons="mdi-alpha-t" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field name="destination" v-model="tripcard.destination" label="Destination" color="#1687A7" outlined
              rounded icons="mdi-map-marker" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <date-picker :value="DateDate[0]" name="startDate" @date-changed="StartDate" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <date-picker :value="DateDate[1]" name="endDate" @date-changed="EndDate" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12">
            <text-area name="details" v-model="tripcard.detail" outlined rounded label="Details" color="#1687A7"
              counter />
          </v-col>
          <v-col cols="12">
            <file-field name="imageSrc" label="Image(s)" color="#1687A7" outlined rounded icon="mdi-image"
              :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12">
            <select-field name="Categorise" v-model="tripcard.category" label="Category" color="#1687A7" outlined
              :SelectItem="Tags" multiple rounded small-chips :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" class="d-flex justify-center text-h6">- Departure -</v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field name="meetLocation" v-model="tripcard.departure.meet_location" label="Meet Location"
              color="#1687A7" outlined rounded icons="mdi-map-marker" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <time-picker :passData="timeData" name="timeLeave" @time-save="LeaveTime" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" class="d-flex justify-center text-h6">- Requirements -</v-col>
          <v-col cols="12" sm="6" md="6" class="d-flex align-center">
            <v-col cols=12>
              <range-slider-field name="ageRange" v-model="tripcard.requirement.Age" label="Age" hint="Im a hint" max="90"
                min="15" outlined color="#1687A7" ThumbLabel persistent-hint :rules="[rules.createrule]" />
            </v-col>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <text-field type="number" name="cost" v-model.number="tripcard.requirement.cost" label="Cost/Person"
              color="#1687A7" outlined rounded icons="mdi-currency-usd" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <select-field name="nationalId" v-model="tripcard.requirement.nationalId" label="National ID" color="#1687A7"
              outlined rounded :SelectItem="Choice" :rules="[rules.createrule]" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <select-field name="phoneNumber" v-model="tripcard.requirement.phoneNumber" label="Phone Number"
              color="#1687A7" outlined rounded :SelectItem="Choice" :rules="[rules.createrule]" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="d-flex justify-center pb-5">
          <slot name="FormBtn1"></slot>
          <slot name="FormBtn2">
          </slot>
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
    }
  },
  data () {
    return {
      Choice: ['Not Require', 'Require'],
      Tags: ['One day Trip', 'Hiking', 'Sea', 'Camping'],
      rules: {
        createrule: value => !!value || 'field required'
      },
      PostBtn: true,
      timeData: '',
      DateDate: [],
      tripcard: {
        id: '',
        postDate: '',
        title: '',
        author: {
          id: 2,
          name: 'user0101'
        },
        destination: '',
        start_date: '',
        end_date: '',
        detail: '',
        image: '',
        category: [],
        departure: {
          meet_location: '',
          leave_time: ''
        },
        requirement: {
          cost: '',
          nationalId: null,
          phoneNumber: ''
        }
      }
    }
  },
  methods: {
    StartDate (value) {
      this.tripcard.start_date = value
    },
    EndDate (value) {
      this.tripcard.end_date = value
    },
    LeaveTime (value) {
      this.tripcard.departure.leave_time = value
    },
    validate () {
      this.$refs.form.validate()
    },
    emitDisplayDataEvent () {
      this.$emit('display-data', this.tripcard)
    }
  }
}
</script>
