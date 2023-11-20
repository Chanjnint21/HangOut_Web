<template>
  <div>
    <v-textarea
      v-bind="$attrs"
      v-on="$listeners"
      :outlined="outlined"
      :label="label"
      :required="required"
      :counter="counter"
      :color="color"
      dense
    />
  </div>
</template>

<script>

export default {
  name: 'TextField',
  props: {
    outlined: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'Text Area'
    },
    required: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#3b3b3b'
    },

  }

}
</script>
