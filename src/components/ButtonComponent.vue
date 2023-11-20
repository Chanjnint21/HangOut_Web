<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="icon"></slot>
    {{ BtnLabel }}
  </v-btn>
</template>
<script>
export default {
  name: 'TripBtn',
  props: {
    BtnLabel: {
      type: String
    },
    icons: {
      type: String
    },
    IconClass: String
  }
}
</script>
