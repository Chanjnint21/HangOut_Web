<template>
  <v-tab-item>
    <div v-if='EmptyPost' class='d-flex justify-center pt-5 text--disabled'>
      <v-container class="d-flex justify-center">
          <v-col cols="12" class="d-flex align-center justify-center flex-column">
            <template v-if="asOwner">
              <p>You haven't published any post yet !</p>
              <router-link to="/user/create"><p>Create your first posts now</p></router-link>
            </template>
            <template v-else>
              <p>This user haven't published any post yet !</p>
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
            :item="item"
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
      items: [],
      EmptyPost: false,
      UserID: '',
      RouteUser: this.$route.params.name
    }
  },
  watch: {
    items: {
      immediate: true,
      handler () {
        if (this.items.length === 0) {
          this.EmptyPost = true
        } else {
          this.EmptyPost = false
        }
      }
    }
  },
  async mounted () {
    this.UserID = this.crrUserId
    // get the card belong to only this user
    try {
      this.items = await C_Service.thisUserCard(this.UserID)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
