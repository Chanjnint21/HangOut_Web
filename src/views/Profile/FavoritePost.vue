<template>
  <v-tab-item>
    <div v-if='EmptyFav' class='d-flex justify-center text--disabled'>
      <v-container class="d-flex justify-center">
        <v-col cols="12" class="d-flex align-center justify-center flex-column">
            <v-img max-width="400" src="../../assets/empty_Box.jpeg"/>
            <template v-if="asOwner">
              <p>You haven't favorite any post yet! <router-link to="/user/home">Explore now</router-link></p>
            </template>
            <template v-else>
              <p>This user haven't favorite on any post yet!</p>
            </template>
          </v-col>
      </v-container>
    </div>
    <v-row v-else>
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
    </v-row>
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
      FavCard: [],
      items: [],
      EmptyFav: false,
      UserID: '',
      RouteUser: this.$route.params.name
    }
  },
  watch: {
    FavCard () {
      if (this.FavCard.length === 0) {
        this.EmptyFav = true
      } else {
        this.EmptyFav = false
      }
    }
  },
  methods: {
    async thisFavCard (FavCard) {
      for (let i = 0; i < FavCard.length; i++) {
        const Data = await C_Service.thisIdData(FavCard[i].card_id)
        this.items.push(Data)
      }
    }
  },
  async mounted () {
    this.UserID = this.crrUserId
    try {
      this.FavCard = await C_Service.thisUserFav(this.UserID)
      this.thisFavCard(this.FavCard)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
