<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12 pt-0">
          <v-img :max-height="bgSize" class="grey darken-4" src="../../assets/Img//cover.jpg" />
        </v-col>
        <v-col cols="12" id="prof">
          <v-row no-gutters>
            <v-col cols="3" xs="3" sm="2" md="2" class="d-flex justify-center" order="first">
              <div >
                <v-avatar :size="pfSize">
                  <v-img :src="userImg" alt="user_profile" >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                        style="background-color: rgba(187, 187, 187, 0.253);"
                      >
                        <v-progress-circular
                          indeterminate
                          color="#fc9652"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="7" md="7" class="pfName pl-3" :order="nameOrder">
              <v-row no-gutters>
                <v-col cols="12">
                  <p class="text-h6 font-weight-bold mb-0">{{ userName }} <v-icon :color="verify_color">mdi-check-decagram</v-icon></p>
                </v-col>
                <v-col cols="12">
                  <p class=" mb-0"> {{ userBio }}</p>
                </v-col>
                <v-col cols="12" class="d-flex">
                  <div>
                    <f-dialog class="text--disabled mr-2" :crrUser="userID" :followingCount="followingCount"/>
                  </div>
                  <div>
                    <f-r-dialog class="text--disabled mr-2" :crrUser="userID" :followerCount="followerCount"/>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="8" xs="8" sm="3" md="3" class="editProf" >
              <prof-dialog :pfPic="userImg" v-if="asOwner" :profile-url="userImg" :crr-user-data="crrUser"/>
              <trip-btn
                class="white--text"
                color="#3b3b3b"
                btn-label="Follow"
                rounded
                @click="follow()"
                v-else-if="!asOwner && !following"
              />
              <trip-btn
                class="white--text"
                color="#3b3b3b"
                btn-label="unfollow"
                rounded
                @click="unFollow()"
                v-else
              />
              <!-- <trip-btn
                color="#3b3b3b"
                icon
                >
                <template v-slot:icon>
                  <v-icon >mdi-dots-horizontal</v-icon>
                </template>
              </trip-btn> -->
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" id="tab">
          <v-row no-gutters>
            <v-tabs
              v-model="tab"
              fixed-tabs
              :hide-slider="true"
              color="#fc9652"
              show-arrows
              active-class="orange--text"
            >
              <template v-for="t in tabs">
                <v-tab
                :key="t"
                >
                  {{ t }}
                </v-tab>
              </template>
            </v-tabs>
            <v-divider></v-divider>
            <v-container v-if="checkUserCompleted" class="MainContain">
              <v-tabs-items v-model="tab">
                <your-blog :crr-user-id="userID" :as-owner="asOwner"/>
                <favorite-post :crr-user-id="userID" :as-owner="asOwner"/>
                <up-coming :crr-user-id="userID" :as-owner="asOwner"/>
                <joined-trip :crr-user-id="userID" :as-owner="asOwner"/>
              </v-tabs-items>
            </v-container>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>
</style>

<script>
import '@/assets/css/profile.css'
import YourBlog from './YourBlog.vue'
import UpComing from './UpComing.vue'
import FavoritePost from './FavoritePost.vue'
import JoinedTrip from './JoinedTrip.vue'
import ProfDialog from './components/ProfDialog.vue'
import FDialog from './components/FollowingComponent.vue'
import FRDialog from './components/FollowerComponent.vue'
import { Service } from '@/service/index.js'
import { storage } from '../../firebase'
import { ref, getDownloadURL } from 'firebase/storage'

export default {
    components: {
    YourBlog,
    FavoritePost,
    UpComing,
    JoinedTrip,
    ProfDialog,
    FDialog,
    FRDialog
  },
  data () {
    return {
      tab: null,
      tabs: ['Posts', 'Favorite', 'Upcoming', 'Joined'],
      userName: '',
      userID: '',
      userImg: '',
      userBio: '',
      RouteUser: this.$route.params.name,
      crrUser: null,
      asOwner: true,
      following: false,
      followId: '',
      followingCount: 0,
      followerCount: 0,
      verify_color: '',
      followingList: [],
      followerList: [],
      pfSize : 180,
      bgSize: 230,
      nameOrder: '',
      checkUserCompleted: false
    }
  },
  watch: {
    $route (to, from) {
      if (to.path !== from.path) {
        this.$router.go()
      }
    },
    following () {
      return this.checkUser(this.crrUser)
    },
    '$vuetify.breakpoint.width' (newVal) {
      if (newVal < 720) {
        this.pfSize = 100
        this.nameOrder = 12
      } else {
        this.pfSize = 180
        this.nameOrder = ''
      }
    }
  },
  methods: {
    // follow function on visit profile
    async follow () {
      const thisUserProfile = await Service.handleSearchUser(this.RouteUser)
      const followData = {
        user_id: this.crrUser.id,
        following: thisUserProfile.id
      }
      await Service.follow(followData)
      this.following = true
    },
    // unFollow function on visit profile
    async unFollow () {
      this.following = false
      await Service.unfollow(this.followId)
    },
    // check if the crrUser have follow the visit profile
    async checkFollow () {
      const thisUserFollow = await Service.getFollow(this.crrUser.id, this.userID)
      if (thisUserFollow) {
        this.following = true
        this.followId = thisUserFollow.id
      } else {
        this.following = false
      }
    },
    // // get the list of the crr visit pf following and follower
    async followList (userId) {
      const FollowingList = await Service.followingList(userId)
      this.followingCount = FollowingList.length
      this.$emit('followingCount', this.followingCount)
      const FollowerList = await Service.followerList(userId)
      this.followerCount = FollowerList.length
      this.$emit('followerCount', this.followerCount)
    },
    checkVerification (verify) {
      if (verify) {
        this.verify_color = 'blue'
      } else {
        this.verify_color = 'grey'
      }
    },
    // check the visit profile to display the correct personal data
    async checkUser (crrUser) {
      // this.userID = this.crrUser.id
      const thisUser = await Service.handleSearchUser(this.RouteUser)
      let path
      if (thisUser.id === crrUser.id) {
        this.userID = crrUser.id
        this.userName = crrUser.name
        this.userBio = crrUser.bio
        path = `profile/${crrUser.image}`
        this.asOwner = true
        this.followList(crrUser.id)
        this.checkVerification(crrUser.verify)
      } else {
        this.userID = thisUser.id
        this.userName = thisUser.name
        this.userBio = thisUser.bio
        path = `profile/${thisUser.image}`
        this.asOwner = false
        this.checkFollow()
        this.followList(thisUser.id)
        this.checkVerification(thisUser.verify)
      }
      getDownloadURL(ref(storage, path)).then(
        (downLoadUrl) => (this.userImg = downLoadUrl)
      )
      this.checkUserCompleted = true;
    }
  },
  async created () {
    const Inwidth = window.innerWidth
    if (Inwidth < 720 ) {
      this.pfSize = 100
      this.nameOrder = 12
    }
    this.crrUser = await Service.crrUserData()
    this.checkUser(this.crrUser)
  }
}
</script>
