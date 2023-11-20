<template>
  <v-row justify="center">
    <v-dialog
    v-model="dialog"
    scrollable
    max-width="400px"
    v-bind="$attrs"
    v-on="$listeners">
  <template v-slot:activator="{ on, attrs }">
    <v-col cols="12" class="d-flex">
      <p
        v-bind="attrs"
        v-on="on"> {{ followerCount }}
        <span class="text--disabled mr-2">follower</span>
      </p>
    </v-col>
  </template>
  <v-card>
    <v-card-title>
      <span>Follower</span>
    </v-card-title>
    <v-list-item v-for="(list, i) in followerList" :key="list">
        <v-list-item-content class="d-flex justify-space-between">
          <div>
            <v-avatar size="40" class="mx-3">
              <v-img :src="followerImg[i]" />
            </v-avatar>
            <router-link class="text-decoration-none black--text" :to="`/user/profile/${followerList[i]}`" >{{ list }}</router-link>
          </div>
        </v-list-item-content>
      </v-list-item>
    <div v-if='emptyFollower' class='d-flex justify-center mt-5'>
      <span class="text--disabled">No follower. </span> &#x1f62d;
    </div>
      <v-card-actions>
        <v-btn
          color="#fc9652"
          text
          @click="dialog = false">
          Close
        </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
  </v-row>
</template>

<script>
import { storage } from '../../../firebase'
import { ref, getDownloadURL } from 'firebase/storage'
import { Service } from '@/service/index.js'
export default {
  name: 'FollowerDialog',
  props: {
    followerCount: {
      type: Number,
      required: true
    },
    crrUser: {
      type: String,
      require: true
    }
  },
  data: () => ({
    dialog: false,
    followerList: [],
    followerImg: [],
    emptyFollower: false
  }),
  watch: {
    followerCount: {
      immediate: true,
      handler () {
        this.emptyFollower = this.followerCount === 0
      }
    }
  },
  methods: {
    followerData (data) {
      for (let i = 0; i < data.length; i++) {
        this.onGetFollowerName(data[i].user_id)
      }
    },
    async onGetFollowerName (data) {
      const userName = await Service.getUser(data)
      const path = `profile/${userName.image}`
      getDownloadURL(ref(storage, path)).then(
        (downLoadUrl) => {
          this.followerImg.push(downLoadUrl)
          this.followerList.push(userName.name)
        }
      )
    }
  },
  async mounted () {
    const routeName = this.$route.params.name
    const userData = await Service.handleSearchUser(routeName)
    if (this.crrUser === userData.id) {
      this.UserID = this.crrUser
    } else {
      this.UserID = userData.id
    }
    const follower = await Service.followerList(this.UserID)
    this.followerData(follower)
  }
}

</script>
