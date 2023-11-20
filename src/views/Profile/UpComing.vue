<template>
  <v-tab-item>
    <div v-if='EmptyReg' class='d-flex justify-center text--disabled'>
      <v-container class="d-flex align-center justify-center vh-100">
          <v-col cols="12" class="d-flex align-center justify-center flex-column">
            <v-img max-width="400" src="../../assets/empty_Box.jpeg"/>
            <template v-if="asOwner">
              <p>There's no upcoming trip that you have register! <router-link to="/user/home">Explore now</router-link></p>
            </template>
            <template v-else>
              <p>This user haven't register to any posy yet!</p>
            </template>
          </v-col>
      </v-container>
    </div>
    <template v-for="item in items">
      <v-col col="12" lg="12" xl="6" :key="item.id">
        <card-component
          height="auto"
          elevation="8"
          :item='item'
        >
        </card-component>
      </v-col>
    </template>
  </v-tab-item>
</template>

<script>
import { C_Service } from '@/service/cards'

export default {
  name: 'HomePage',
  props: {
    crrUserId: {
      type: String
    },
    asOwner: Boolean
  },
  data () {
    return {
      RegCard: [],
      items: [],
      EmptyReg: false,
      UserID: '',
      RouteUser: this.$route.params.name
    }
  },
  watch: {
    items: {
      deep: true, // Watch for changes in nested properties of RegCard (if applicable)
      handler () {
        if (this.items.length === 0) {
          this.EmptyReg = true
        } else {
          this.EmptyReg = false
        }
      }
    }
  },
  methods: {
    // push the upcoming data that's not yet expired
    async thisRegCard (RegCard) {
      if (RegCard.length === 0) return this.items = []
      for (let i = 0; i < RegCard.length; i++) {
        const Data = await C_Service.thisIdData(RegCard[i].card_id)
        if (!Data.expiry) {
          this.items.push(Data)
        }
      }
    }
  },
  async mounted () {
    this.UserID = this.crrUserId
    try {
      this.RegCard = await C_Service.showRegister(this.UserID)
      this.thisRegCard(this.RegCard)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
