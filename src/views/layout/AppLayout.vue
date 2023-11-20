<template>
  <v-app>
    <v-navigation-drawer
      v-model='drawer'
      app
      dark
      v-if='LoggedIn'
      evaluation="6"
      color='#3b3b3b'
      style="height: 100%;"
    >
      <v-row class='d-flex justify-center' style="height: 50%">
        <v-col cols='12'>
          <v-row no-gutters>
            <v-col class='d-flex justify-center'>
                <v-img
                contain
                src='@/assets/HangOut_logo.png'
                max-width='250'
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols='9' class='pa-1 ma-1'>
          <trip-btn
            class="RouteBtn rounded-lg"
            icon-class="pa-2"
            color="#fc9652"
            BtnLabel="Home"
            @click="toHome"
            block
            x-large
          >
          <template #icon>
            <v-icon class="pa-2">mdi-home</v-icon>
          </template>
          </trip-btn>
        </v-col>
        <v-col cols='9' class='pa-1 ma-1'>
          <trip-btn
            class="RouteBtn rounded-lg"
            icon-class="pa-2"
            color="#fc9652"
            BtnLabel="Drafts"
            @click="toDrafts"
            block
            x-large
          >
          <template #icon>
            <v-icon class="pa-2">mdi-credit-card-edit</v-icon>
          </template>
          </trip-btn>
        </v-col>
        <v-col cols='9' class='pa-1 ma-1'>
          <trip-btn
            class="RouteBtn rounded-lg"
            color="#fc9652"
            BtnLabel="Profile"
            @click="ToProfile"
            block
            x-large
          >
            <template #icon>
              <v-icon class="pa-2">mdi-account-circle-outline</v-icon>
            </template>
          </trip-btn>
        </v-col>
      </v-row>
      <v-row class='d-flex justify-center align-end' style="height: 50%">
        <v-col cols='9' class='pa-1 mx-1' >
          <trip-btn
            class="RouteBtn rounded-lg"
            color="#fc9652"
            BtnLabel="Log Out"
            @click="LogOut"
            block
            x-large
          >
            <template #icon>
              <v-icon class="pa-2">mdi-logout</v-icon>
            </template>
          </trip-btn>
        </v-col>
      </v-row>
    </v-navigation-drawer>
    <v-app-bar app elevation="0" v-if='LoggedIn' color="white">
      <v-app-bar-nav-icon @click='drawer = !drawer'></v-app-bar-nav-icon>
      <v-toolbar-title style="font-size: 1.5rem;">{{ $route.meta.RouteName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <trip-btn
        v-if="!!$route.meta.isCreate"
        class="white--text"
        color="#3b3b3b"
        BtnLabel="Create"
        rounded
        @click="toCreatePage"
        >
        <template v-slot:icon>
          <v-icon class="pr-1">mdi-plus-circle-outline</v-icon>
        </template>
    </trip-btn>
    </v-app-bar>
    <v-main class="hey" style="width: 100%;">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AuthService from '../../service/AuthService'
import { C_Service } from '@/service/cards'
import { Service } from '@/service/index'

export default {
  name: 'BoilerPlate',
  data () {
    return {
      currentRoute: '',
      drawer: true,
      LoggedIn: AuthService.isLoggedIn(),
      crrUser: null
    }
  },
  methods: {
    async checkExpireTrip () {
      const card = await C_Service.getList()
      const todayDate = new Date().toJSON().slice(0, 10)
      for (let i = 0; i < card.length; i++) {
        const cardDate = `${card[i].start_date.slice(6, 10)}-${card[i].start_date.slice(3, 5)}-${card[i].start_date.slice(0, 2)}`
        if (cardDate < todayDate && !card[i].expiry) {
          await C_Service.expiryCard(card[i].id)
        }
      }
    },
    LogOut () {
      AuthService.logout()
      this.$router.push('/login')
    },
    toCreatePage () {
      this.$router.push('/user/create').catch(() => {})
    },
    toHome () {
      this.$router.push('/user/home').catch(() => {})
    },
    toDrafts () {
      this.$router.push('/user/draft').catch(() => {})
    },
    ToProfile () {
      this.$router.push(`/user/profile/${this.crrUser.name}`).catch(() => {})
    }
  },
  async created() {
    this.crrUser = await Service.crrUserData()
    this.checkExpireTrip()
  }
}
</script>

<style scoped>
.RouteBtn{
  display: flex;
  justify-content: start;
}
</style>
