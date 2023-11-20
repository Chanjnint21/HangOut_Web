<template>
  <v-container class="MainContain">
    <v-row>
      <v-col cols="12" class="d-flex align-center pb-1">
        <v-text-field
          v-model="searchQuery"
          @input="search(searchQuery)"
          label="Search"
          color="#3b3b3b"
          outlined
          rounded
          style="width: 1000px;"
          prepend-inner-icon="mdi-magnify"
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12">
        <v-btn-toggle v-model="selectedBtn" class="d-flex justify-space-around" dense :multiple="false" v-if="!sortStyle">
          <template v-for="(item, index) of Sortlabel" >
            <div :key="index">
              <trip-btn
                color="#3b3b3b"
                :btn-label="item"
                rounded
                :value="item"
                outlined
                :id="item"
                @click="sorting(item)"
              />
            </div>
          </template>
        </v-btn-toggle>
        <template v-else>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#3b3b3b"
                dark
                v-bind="attrs"
                v-on="on"
                text
              >
                Sort By :
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in Sortlabel"
                :key="index"
              >
                <v-list-item-title>
                  <trip-btn
                    color="#3b3b3b"
                    :btn-label="item"
                    text
                    :id="item"
                    block
                    @click="sorting(item)"
                  />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <span>{{ sortByValue }}</span>
        </template>
      </v-col>
    </v-row>
    <v-row>
      <vue-load v-if="isLoading" />
      <template v-else-if="itemEmpty && !isLoading">
        <v-col cols="12" class="text-center">
          <p class="text--disabled">No Matching Results</p>
        </v-col>
      </template>
      <template v-for="item in userlist" v-else-if="showUser && !isLoading">
        <v-col cols="12" sm="6" xl="4" :key="item.id">
          <user-card :item="item" />
        </v-col>
      </template>
      <template v-for="item in items" v-else-if="!showUser && !itemEmpty">
        <v-col col="12" lg="12" xl="6" :key="item.id">
          <card-component
            height="auto"
            elevation="8"
            :item="item"
          ></card-component>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import HomeImage from '@/assets/HomeImage.jpeg'
import userCard from '@/components/userCard.vue'
import { Service } from '@/service/index.js'
import { C_Service } from '@/service/cards'

export default {
  name: 'HomePage',
  components: {
    userCard
  },
  data () {
    return {
      page: 1,
      Sortlabel: [
        'newest',
        'oldest',
        'Price to High',
        'Price to Low',
        'User',
        'Recommend'
      ],
      image: HomeImage,
      items: [],
      userlist: [],
      searchQuery: '',
      Busy: false,
      selectedBtn: null,
      isLoading: true,
      showUser: false,
      itemEmpty: false,
      sortStyle: null,
      sortByValue: ''
    }
  },
  watch: {
    '$vuetify.breakpoint.width' (newVal) {
      if (newVal < 720) {
        this.sortStyle = true
      } else {
        this.sortStyle = false
      }
    },
    items: {
      immediate: true,
      handler () {
        if (this.items.length === 0) {
          this.itemEmpty = true
        } else {
          this.itemEmpty = false
        }
      }
    }
  },
  methods: {
    search (q) {
      setTimeout(async () => {
        if (this.showUser) {
          this.userlist = await Service.handleSearchUser(q)
          return
        }
        this.items = await C_Service.handleSearchQuery(q)
        return
      }, 1000)
    },
    async sorting (val) {
      try {
        this.sortByValue = val
        setTimeout(async () => {
          const sortdata = await C_Service.sorting(val)
          if (val === 'User') {
            this.showUser = true
            this.userlist = sortdata
          } else {
            this.showUser = false
            this.userlist = []
          }
          this.items = sortdata
        }, 300)
      } catch (e) {
        console.log(e)
      }
    }
  },
  async created () {
    try {
      this.items = await C_Service.getList()
      // this.checkEmpty(this.items)
    } catch (error) {
      console.log(error)
    }
  },
  async mounted () {
    const Inwidth = window.innerWidth
    if (Inwidth < 720 ) {
      this.sortStyle = true
    }
    setTimeout(() => {
      this.isLoading = false
    }, 1500)
  }
}
</script>
