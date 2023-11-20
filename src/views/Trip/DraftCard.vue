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
          />
        </v-col>
      </v-row>
      <v-row>
        <vue-load v-if="isLoading" />
        <template v-else-if="itemEmpty && !isLoading">
          <v-col cols="12" class="text-center">
            <p class="text--disabled">No Drafts</p>
          </v-col>
        </template>
        <template v-for="item in items" v-else>
            <v-col cols="12" xs="12" sm="6" md="6" lg="4" class="mb-5" :key="item.id">
              <v-card>
                <v-row>
                    <v-col cols="8">
                        <v-card-title>{{ item.title || 'No Title' }}</v-card-title> 
                        <v-card-subtitle class="text--disabled">{{ item.detail || 'No detail have been written' }}</v-card-subtitle>
                    </v-col>
                    <v-col cols="4" class="d-flex align-center">
                        <v-card-actions>
                            <trip-btn
                                name="ToDraft"
                                @click="editDraft(item.id)"
                                color="#fc9652"
                                text
                                x-small
                            >
                                <template #icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </template>
                            </trip-btn>
                            <trip-btn
                                name="ToDraft"
                                @click="deleteDraft(item.id)"
                                x-small
                                color="error"
                                text
                            >
                                <template #icon>
                                    <v-icon>mdi-delete</v-icon>
                                </template>
                            </trip-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
              </v-card>
            </v-col>
        </template>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { Service } from '@/service/index.js'
  import { C_Service } from '@/service/cards'
  
  export default {
    name: 'DraftPage',
    components: {
    },
    data () {
      return {
        page: 1,
        items: [],
        searchQuery: '',
        Busy: false,
        selectedBtn: null,
        isLoading: true,
        showUser: false,
        itemEmpty: false,
        title: '',
        description: ''
      }
    },
    watch: {
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
        editDraft (id) {
            this.$router.push(`/user/draft/${id}`)
        },
        async deleteDraft (id) {
            await C_Service.deleteDraft(id)
            this.$router.go()
        },
      checkEmpty (resultList) {
        if (resultList.length === 0) {
          this.itemEmpty = true
          return
        }
        this.itemEmpty = false
      },
      search (q) {
        setTimeout(async () => {
          this.items = await C_Service.handleSearchDraft(q)
          return this.checkEmpty(this.items)
        }, 1000)
      },
    },
    async created () {
      try {
        const crrUser = await Service.crrUserData()
        this.items = await C_Service.getAllDrafts(crrUser.id)
      } catch (error) {
        console.log(error)
      }
    },
    async mounted () {
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    }
  }
  </script>
  