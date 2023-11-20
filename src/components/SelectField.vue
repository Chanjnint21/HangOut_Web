<template>
  <div>
    <v-autocomplete
      v-bind="$attrs"
      v-on="$listeners"
      :label="label"
      :outlined="outlined"
      :items="SelectItem"
      :color="color"
      dense
    />
  </div>
</template>

<script>
export default {
  name: 'SelectField',
  props: {
    label: {
      type: String
    },
    outlined: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#3b3b3b'
    },
    SelectItem: {
      type: Array
    }
  }
}
</script>
