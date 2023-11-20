<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    rounded
    outlined
    :append-icon="icons"
    :color="color"
    :required="required"
    :name="name"
    :hint="hint"
    :counter="counter"
    dense
  />
</template>

<script>
export default {
  name: 'TextField',
  props: {
    label: {
      type: String,
      required: true
    },
    filled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#3b3b3b'
    },
    outlined: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    icons: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    hint: {
      type: String
    },
    counter: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {

  }
}
</script>
