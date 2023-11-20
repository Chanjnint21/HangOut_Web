<template>
  <div>
    <c-dialog
    label1="Save or Discard?"
    label2="These changes can't be undone!"
    :icon="button ? false : true"
    :DioLabel="button ? 'Draft' : '' "
    DioColor="#3b3b3b"
    :DioValue="dio_val"
  >
    <template #agree>
      <v-btn color="#fc9652" text @click="emitSaveChanges(); dialog = false">
        Save
      </v-btn>
    </template>
    <template #disagree>
      <v-btn color="#3b3b3b" text @click="DiscardChanges(); dialog = false">
        Don't Save
      </v-btn>
    </template>
  </c-dialog>
  </div>
</template>

<script>
export default {
  name: 'SaveDialog',
  props: {
    button: {
      type: Boolean,
      default: false
    },
    dio_val: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitSaveChanges () {
      this.$emit('saveChanges')
      this.dialog = false
    },
    DiscardChanges () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
