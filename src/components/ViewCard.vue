<template>
  <div>
    <v-card
      v-bind="$attrs"
      v-on="$listeners"
      :elevation="elevation"
      class="pa-4 rounded-xl"
    >
      <v-row no-gutters>
        <v-col cols="12" xs='12' sm="6" md="6" lg="6">
          <v-row no-gutters>
            <v-col cols="12" class='d-flex justify-start'>
              <trip-btn
                icon
                @click="back">
                <template #icon>
                  <v-icon class="pa-2">mdi-arrow-left</v-icon>
                </template>
              </trip-btn>
              <v-avatar class="ml-3" size="40">
                <v-img :src="authorImg" :alt="item.author.name"/>
              </v-avatar>
              <p class="text-h5 mx-4 mt-1">{{ item.author.name }}</p>
            </v-col>
            <v-col>
              <v-card-title class="text-h5"><b>{{ item.title }}</b></v-card-title>
              <v-card-text class="text-left">{{ item.detail }}</v-card-text>
              <v-card-title class="text-left" style="font-size: larger; color:#fc9652"> About Trip </v-card-title>
              <v-card-text v-for="itemData in  aboutTripLists" :key="itemData.data" class="text-left">
                <v-icon>{{ itemData.icon }}</v-icon> {{ itemData.text}} {{ itemData.data }}
              </v-card-text>
              <v-card-text class="text-left"><v-icon>mdi-heart</v-icon>
                Categorize:
                <v-chip-group>
                  <v-chip
                    color="#fc9652"
                    v-for="tag in item.category"
                    :key="tag"
                    class="white--text"
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-title class="text-left" style="font-size: larger ; color:#fc9652"> Departure </v-card-title>
              <v-card-text v-for="itemData in  departureLists" :key="itemData.data" class="text-left">
                <v-icon>{{ itemData.icon }}</v-icon> {{ itemData.text }} {{ itemData.data }} {{ itemData.text1 }}
              </v-card-text>
              <v-card-title class="text-left" style="font-size: larger ; color:#fc9652"> Requirements </v-card-title>
              <v-card-text v-for="itemData in requirementLists" :key="itemData.data" class="text-left">
                <v-icon>{{ itemData.icon }}</v-icon> {{ itemData.text }} {{ itemData.data }} {{ itemData.text1 }}
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" xs='12' sm="6" md="6" lg="6">
          <v-row class="d-flex align-start" no-gutters>
            <v-col cols='12'>
              <cloud-image
                height="450"
                class="align-end"
                :files='item.image'
              />
            </v-col>
            <v-col cols="12" class="ma-0">
              <p class="text-left">Participator : {{ countUser }}</p>
            </v-col>
            <div class="container pa-0">
              <v-col cols='12'>
              <v-list class="scrollable-list">
                <v-list-item
                  class="rounded-xxl mb-3"
                  v-for="(list, i) in userlists"
                  :key="list.fullName"
                  style="background-color: #fc965263; "
                >
                  <v-list-item-avatar>
                    <v-img :src="list.avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title ><router-link style="color: #3b3b3b" :to='`/user/profile/${nameList[i]}`'>{{ list.fullName }}</router-link> </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </div>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { Service } from '@/service/index.js'
import { C_Service } from '@/service/cards.js'
import CloudImage from './CloudImage.vue'
import { storage } from '../firebase'
import { ref, getDownloadURL } from 'firebase/storage'

export default {
  name: 'ViewCard',
  components: {
    CloudImage
  },
  props: {
    elevation: {
      type: String
    },
    color: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      userlists: [],
      aboutTripLists: [
        { icon: 'mdi-map-marker', text: 'Destination:', data: this.item.destination },
        { icon: 'mdi-calendar-range', text: 'Start_Date :', data: this.item.start_date },
        { icon: 'mdi-calendar-range', text: 'End_Date :', data: this.item.end_date },
        { icon: 'mdi-account-group-outline', text: 'Amount :', data: this.item.requirement.amount, text1: 'people' },
      ],
      departureLists: [
        { icon: 'mdi-map', text: 'Location :', data: this.item.departure.meet_location },
        { icon: 'mdi-clock', text: 'Time :', data: this.item.departure.leave_time },
      ],
      requirementLists: [
        { icon: 'mdi-cash', text: 'Cost : ', data: this.item.requirement.cost, text1: '$' },
        { icon: 'mdi-check-underline-circle', text: 'Age :', data: `${this.item.requirement.age[0]} - ${this.item.requirement.age[1]}` , text1: 'years old' },
        { icon: 'mdi-card-account-details', text: 'National ID :', data: this.item.requirement.nationalId },
        { icon: 'mdi-car-side', text: 'Transportation :', data: this.item.requirement.transportation }
      ],
      emptyMatching: false,
      countUser: 0,
      userImg: '',
      authorImg: '',
      nameList: []
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    async pushData (data) {
      for (let i = 0; i < data.length; i++) {
        const thisUserImg = await Service.getUser(data[i].user_id)
        const path = `profile/${thisUserImg.image}`
        getDownloadURL(ref(storage, path)).then(
          async (downLoadUrl) => {
            const userData = await Service.getUser(data[i].user_id)
            this.nameList.push(userData.name)
            this.userlists.push({ fullName: `${data[i].firstName} ${data[i].lastName} `, avatar: downLoadUrl })
            this.countUser = this.userlists.length
          }
        )
      }
    }
  },
  async mounted () {
    const users = await C_Service.registeredCard(this.item.id)
    const authorInfo = await Service.getUser(this.item.author.id)
    const path = `profile/${authorInfo.image}`
    getDownloadURL(ref(storage, path)).then(
      (downLoadUrl) => {
        this.authorImg = downLoadUrl
      }
    )
    this.pushData(users)
  }
}
</script>
<style scoped>
.container {
  height: calc(100% - 100px);
  overflow-y: scroll;
}
.scrollable-list {
  height: 400px;
}
</style>
