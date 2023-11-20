<template>
  <div>
    <v-range-slider
      v-bind="$attrs"
      v-on="$listeners"
      :hint="hint"
      :color="color"
      :thumb-label="ThumbLabel"
      :label="label"
      dense
    />
  </div>
</template>

<script>
export default {
  name: 'RangeSlider',
  props: {
    hint: {
      type: String,
      default: 'Im a hint'
    },
    label: {
      type: String
    },
    color: {
      type: String,
      default: '#fc9652'
    },
    ThumbLabel: {
      type: Boolean,
      default: false
    }

  }
}
</script>
