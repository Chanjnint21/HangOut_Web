<template>
  <v-file-input
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    prepend-icon=""
    :append-icon="icon"
    accept="image/*"
    color="#3b3b3b"
    v-model="imagesi"
    outlined
    rounded
    dense
    @change="handleFileChange"
  />
</template>

<script>
export default {
  name: 'FileField',
  props: {
    label: {
      type: String,
      default: 'File input'
    },
    icon: {
      type: String
    }
  },
  data () {
    return {
      imagesi: []
    }
  },
  methods: {
    handleFileChange () {
      this.$emit('files_item', this.imagesi)
    }
  }
}
</script>
