<template>
  <div>
    <v-card
    v-bind="$attrs"
    v-on="$listeners"
    :elevation="elevation"
    class="pa-2 ma-lg-2 text-center">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="5"
        md="5"
        lg="5"
        xl="12"
        class="pa-5">
        <cloud-image
          height="400"
          :files='item.image'
        />
      </v-col>
      <v-col cols="12" sm="7" md="7" lg="7" xl="12">
        <v-row class="d-flex align-start" style="height: 60%" no-gutters>
          <v-col cols="12">
            <v-card-title class="text-h5">{{ item.title }}</v-card-title>
            <v-card-text class="text-left">{{ cardDetail }}</v-card-text>
          </v-col>
        </v-row>
        <v-row class="d-flex align-end" style="height: 40%" no-gutters>
          <v-col class="d-flex align-center justify-space-around " cols="12" sm="12" md="6" lg="6">
            <v-card-subtitle class="grey--text">
              By : {{ item.author?.name }}
            </v-card-subtitle>
            <v-card-subtitle class="grey--text">Cost: {{ item.requirement.cost }} $/person</v-card-subtitle>
          </v-col>
          <v-col class="d-flex align-center justify-center mb-2" cols="12" sm="12" md="6" lg="6">
            <v-card-actions>
              <trip-btn @click='ToFav' icon>
                <template #icon>
                  <v-icon color="#fc9652" class="pa-2">{{ FavIcon }}</v-icon>
                </template>
              </trip-btn>
              <trip-btn
                color="#3b3b3b"
                class="white--text"
                btn-label="Detail"
                @click="ViewClick(item.id)"
              />
              <trip-btn
                class="white--text"
                color="#fc9652"
                @click="toUpdate(item.id)"
                v-if="!expireCard && cardOwner"
              >
                <template #icon>
                  <v-icon>mdi-pencil</v-icon>
                </template>
              </trip-btn>
              <c-dialog
                label1="Are you sure?"
                label2="You can't undo this action.Are you sure , you wanna delete this card?"
                DioColor="error"
                DioBtnClass="ml-3"
                v-if='cardOwner'
              >
                <template #agree>
                  <v-btn
                    color="#1687A7"
                    text
                    @click="dialog = false; deleteItem(item.id)"
                  >
                    Yes
                  </v-btn>
                </template>
                <template #icon>
                  <v-icon>mdi-delete</v-icon>
                </template>
              </c-dialog>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
  </div>
</template>

<script>
import CloudImage from './CloudImage.vue'
import { Service } from '@/service/index.js'
import { storage } from '../firebase'
import { ref, deleteObject } from 'firebase/storage'

export default {
  name: 'CardComponent',
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
      expireCard: false,
      isToggledRegister: false,
      limitRegister: false,
      tripItem: null,
      joined: false,
      register: true,
      cardOwner: false,
      Fav: false,
      FavIcon: 'mdi-bookmark-outline',
      badgeText: '',
      crrUser: null,
      cardDetail: ''
    }
  },
  computed: {
    showRegisterButton () {
      return !this.limitRegister
    }
  },
  methods: {
    async deleteItem (id) {
      for (let i = 0; i < this.item.image.length; i++) {
        const desertRef = ref(storage, `folder/${this.item.image[i]}`)
        deleteObject(desertRef).catch((e) => {
          console.log(e)
        })
      }
      await Service.deleteItem(id)
      this.$router.go()
    },
    onRegister () {
      this.tripItem = this.item
      this.isToggledRegister = true
      console.log('this have been registered !')
    },
    onSuccessRegister () {
      this.register = true
      this.countDate()
    },
    onFullRegister () {
      console.log('this card is already full !!!')
    },
    onCancelRegister () {
      this.isToggledRegister = false
      this.register = false
    },
    toUpdate (id) {
      this.$router.push(`/user/update/${id}`)
    },
    submitRegis () {
      this.register = true
    },
    ViewClick (id) {
      this.$router.push({ name: 'view', params: { id } })
    },
    async addFav () {
      this.FavIcon = 'mdi-bookmark'
      await Service.addFav(this.crrUser.id, this.item.id)
    },
    async removeFav () {
      this.FavIcon = 'mdi-bookmark-outline'
      await Service.removeFav(this.crrUser.id, this.item.id)
      // await axios.delete(`http://localhost:3000/Favorite/${FavId[0].id}`)
    },
    async getParticipator () {
      try {
        if (this.item) {
          const data = await Service.getParticipator(this.item.id)
          this.limitRegister = data.length === this.item.requirement.amount
          return true
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async showFav () {
      const FavId = await Service.getFav(this.crrUser.id, this.item.id)
      if (FavId) {
        this.FavIcon = 'mdi-bookmark'
        this.Fav = true
      } else {
        this.FavIcon = 'mdi-bookmark-outline'
        this.Fav = false
      }
    },
    ToFav () {
      this.Fav = !this.Fav
      if (this.Fav) {
        this.addFav()
      } else {
        this.removeFav()
      }
    },
    async ownerCard () {
      if (this.item.author.id === this.crrUser.id ) {
        this.cardOwner = true
      } else {
        this.cardOwner = false
      }
    },
    countDate () {
      const todayDate = new Date().toJSON().slice(0, 10)
      const date1 = new Date(todayDate)
      const cardDate = `${this.item.start_date.slice(6, 10)}-${this.item.start_date.slice(3, 5)}-${this.item.start_date.slice(0, 2)}`
      const date2 = new Date(cardDate)
      // To calculate the time difference of two dates
      const DifferenceInTime = date2.getTime() - date1.getTime()
      // To calculate the no. of days between two dates
      const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24)
      if (DifferenceInDays === 0) {
        this.badgeText = 'today'
      } else if (DifferenceInDays > 0) {
        this.badgeText = `${DifferenceInDays} days left`
      } else {
        this.badgeText = 'ended'
      }
    },
    async showRegister () {
      const regCard = await Service.getRegister(this.crrUser.id, this.item.id)
      if (regCard) {
        this.register = true
        this.countDate()
      } else {
        this.register = false
      }
    },
    async unRegister () {
      const regCard = await Service.getRegister(this.crrUser.id, this.item.id)
      await Service.unRegister(regCard[0].id)
      this.register = false
    },
    async joinedCard () {
      const regCard = await Service.getRegister(this.crrUser.id, this.item.id)
      if (this.item.expiry === true && !regCard) {
        this.register = true
        this.expireCard = true
      } else if (this.item.expiry === true && regCard) {
        this.joined = true
        this.expireCard = true
      } else if (this.item.expiry === true && this.item.author.id === this.crrUser.id) {
        this.joined = true
        this.expireCard = true
        this.cardOwner = true
      }
    },
    shortenDetail () {
      const text = this.item.detail
      const count = 270
      this.cardDetail = text.slice(0, count) + (text.length > count ? '...' : '')
    }
  },
  async mounted () {
    this.crrUser = await Service.crrUserData()
    this.ownerCard()
    this.showRegister()
    this.joinedCard()
    this.showFav()
    this.shortenDetail()
    // this.getParticipator()
  }
}
</script>
