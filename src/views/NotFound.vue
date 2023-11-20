<template>
  <v-container class=" d-flex align-center justify-center" style="height: 100%;">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <div>
          <v-img src="../assets/Img/404.png" width="300" />
        </div>
      </v-col>
      <v-col cols="12" class="text-center">
        <h1>OOPS! PAGE NOT FOUND</h1>
      </v-col>
      <v-col cols="12" class="text-center">
        <trip-btn
          class="white--text"
          color="#fc9652"
          btn-label="Back to home"
          @click="backHome"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    backHome () {
      this.$router.push('/user/home')
    }
  }
}
</script>
