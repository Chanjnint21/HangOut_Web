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
        <v-row class="cardInfoSection d-flex align-start" no-gutters>
          <v-col cols="12">
            <v-card-title class="text-h5" v-if="!expireCard && register">
              <v-badge
                inline
                color="#fc9652"
                :content="badgeText"
              >
                <span @click="checkOutUser()" style="cursor: pointer">
                  {{ item.title }}
                </span>
              </v-badge>
            </v-card-title>
            <v-card-title class="text-h5" v-else>{{ item.title }}</v-card-title>
            <v-card-text class="text-left">{{ cardDetail }}</v-card-text>
          </v-col>
        </v-row>
        <v-row class="cardBtnSection d-flex align-end" no-gutters>
          <v-col class="d-flex align-center justify-space-around " cols="12" sm="12" md="6" lg="6">
            <v-card-subtitle class="grey--text">
              Post by : {{ item.author?.name }}
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
              <trip-btn
                class="white--text"
                BtnLabel="expire"
                disabled
                v-if="expireCard && !joined"
              />
              <trip-btn
                class="white--text"
                BtnLabel="Joined"
                disabled
                v-if='expireCard && joined'
              />
              <trip-btn
                color="#fc9652"
                :class="['white--text', { 'disabled': getParticipator()}]"
                :BtnLabel="showRegisterButton ? 'Register' : 'Full'"
                @click="showRegisterButton ? onRegister() : onFullRegister()"
                v-if='!cardOwner && !register'
                :disabled="!showRegisterButton"
              />
              <c-dialog
                label1="Are you sure?"
                label2="Are you sure you want to unregister this trip?"
                DioColor="error"
                DioBtnClass="ml-3"
                DioLabel="Unregister"
                v-if="!expireCard && register"
              >
                <template #agree>
                  <v-btn
                    color="#fc9652"
                    text
                    @click="dialog = false, unRegister(crrUser.id, item.id)"
                  >
                    Yes
                  </v-btn>
                </template>
              </c-dialog>
              <c-dialog
                label1="Are you sure?"
                label2="You can't undo this action.Are you sure , you wanna delete this card?"
                DioColor="error"
                DioBtnClass="ml-3"
                v-if='cardOwner'
              >
                <template #agree>
                  <v-btn
                    color="#fc9652"
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
  <r-dialog
    v-model="isToggledRegister"
    @onCancel="onCancelRegister"
    @onRegister="onSuccessRegister"
    :item="tripItem"
    :crr-user="crrUser"
  />
  </div>
</template>
<script>
// import axios from 'axios'
import RDialog from './RegisterDialog.vue'
import CloudImage from './CloudImage.vue'
import { Service } from '@/service/index.js'
import { storage } from '../firebase'
import { ref, deleteObject } from 'firebase/storage'
import { C_Service } from '@/service/cards'

export default {
  name: 'CardComponent',
  components: {
    RDialog,
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
      FavIcon: 'mdi-heart-outline',
      badgeText: '',
      crrUser: null,
      cardDetail: ''
    }
  },
  computed: {
    showRegisterButton () {
      // return !this.getParticipator(this.item)
      return !this.limitRegister
    }
  },
  async mounted() {
    this.crrUser = await Service.crrUserData();
    // Use Promise.all to parallelize asynchronous operations
    await Promise.all([
      this.joinedCard(),
      this.showRegister(),
      this.ownerCard(),
      this.showFav(),
      this.shortenDetail(),
      this.getParticipator()
    ]);
  },
  methods: {
    async deleteItem (id) {
      for (let i = 0; i < this.item.image.length; i++) {
        const desertRef = ref(storage, `folder/${this.item.image[i]}`)
        deleteObject(desertRef).catch((e) => {
          console.log(e)
        })
      }
      await C_Service.deleteItem(id)
      this.$router.go()
    },
    onRegister () {
      this.tripItem = this.item
      this.isToggledRegister = true
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
      this.FavIcon = 'mdi-heart'
      await C_Service.addFav(this.crrUser.id, this.item.id)
    },
    async removeFav () {
      this.FavIcon = 'mdi-heart-outline'
      await C_Service.removeFav(this.crrUser.id, this.item.id)
    },
    async getParticipator () {
      try {
        if (this.item) {
          const data = await C_Service.getParticipator(this.item.id)
          this.limitRegister = data.length === this.item.requirement.amount
          return true
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    async showFav () {
      const FavId = await C_Service.getFav(this.crrUser.id, this.item.id)
      if (FavId) {
        this.FavIcon = 'mdi-heart'
        this.Fav = true
      } else {
        this.FavIcon = 'mdi-heart-outline'
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
      const DifferenceInTime = date2.getTime() - date1.getTime()
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
      const regCard = await C_Service.getRegister(this.crrUser.id, this.item.id)
      if (regCard) {
        this.register = true
        this.countDate()
      } else {
        this.register = false
      }
    },
    async unRegister () {
      const regCard = await C_Service.getRegister(this.crrUser.id, this.item.id)
      console.log(regCard)
      await Service.unRegister(regCard.id)
      this.register = false
    },
    async joinedCard () {
      const regCard = await C_Service.getRegister(this.crrUser.id, this.item.id)
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
  }
}
</script>
