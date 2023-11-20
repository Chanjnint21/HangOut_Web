<template>
    <v-carousel
      v-bind="$attrs"
      v-on="$listeners"
      cycle
      :show-arrows="arrow"
      :hide-delimiters="delimiters"
      hide-delimiter-background
    >
      <v-carousel-item
        v-for="(item,i) in url"
        :key="i"
        :src="url[i]"
      ></v-carousel-item>
    </v-carousel>
</template>
<script>
import { storage } from '../firebase'
import { ref, getDownloadURL } from 'firebase/storage'

export default {
  props: {
    files: {
      type: Array
    }
  },
  data: () => {
    return {
      url: [],
      arrow: false,
      delimiters: true
    }
  },
  watch: {
    // if one image dun display as carousel
    url (newVal) {
      if (newVal.length !== 1) {
        this.arrow = true
        this.delimiters = false
      }
    }
  },
  mounted () {
    // download image from firebase and pass to url to display
    for (let i = 0; i < this.files.length; i++) {
      const path = `folder/${this.files[i]}`
      getDownloadURL(ref(storage, path)).then(
        (downLoadUrl) => (this.url.push(downLoadUrl))
      )
    }
  }
}
</script>
