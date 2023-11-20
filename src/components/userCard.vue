<template>
  <v-card class="pa-2 ma-lg-2">
    <v-row no-gutters>
      <v-col cols="3" class="my-2 text-center">
        <v-img
          @click="checkOutUser()"
          style="cursor: pointer"
          width="100"
          height="100"
          :src="userImg"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="#fc9652"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
      <v-col cols="9">
        <v-card-title>
          <v-badge
            inline
            color="#fc9652"
            :content="badgeText"
          >
            <span @click="checkOutUser()" style="cursor: pointer">
              {{ item.name }}
            </span>
            <v-icon
              v-if="item.verify"
              color="blue"
              small
            > mdi-check-decagram</v-icon>
          </v-badge>
        </v-card-title>
        <v-card-subtitle class="py-1" >
          {{ item.bio }}
        </v-card-subtitle>
        <v-card-subtitle class="py-1">
          {{ followingCount }} <span class="text--disabled mr-2"> following</span>{{ followerCount }} <span class="text--disabled"> follower</span>
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { Service } from '@/service/index.js'
import { storage } from '../firebase'
import { ref, getDownloadURL } from 'firebase/storage'

export default {
  name: 'userCard',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    crrUser: null,
    userImg: '',
    followingCount: 0,
    followerCount: 0,
    following: false,
    owner: false,
    badgeText: 'follow'
  }),
  methods: {
    checkOutUser () {
      this.$router.push(`/user/profile/${this.item.name}`)
    },
    async followList () {
      const FollowingList = await Service.followingList(this.item.id)
      this.followingCount = FollowingList.length
      const FollowerList = await Service.followerList(this.item.id)
      this.followerCount = FollowerList.length
    }, 
    async checkUser () {
      if (this.crrUser.id === this.item.id) {
        this.badgeText = 'owner'
      } else {
        const following = await Service.getFollow(this.crrUser.id, this.item.id)
        if (following) {
          this.badgeText = 'following'
        }
      }
    }
  },
  async mounted () {
    this.crrUser = await Service.crrUserData()
    const path = `profile/${this.item.image}`
    getDownloadURL(ref(storage, path)).then(
      (downLoadUrl) => (this.userImg = downLoadUrl)
    )
    this.followList()
    this.checkUser()
  }
}
</script>
