<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:activator="{ on, attrs }">
          <v-btn
            :color="DioColor"
            v-bind="attrs"
            v-on="on"
            :class="DioBtnClass"
            :icon='icon'
          >
            {{ DioLabel }}
            <slot name='icon'></slot>
          </v-btn>
      </template>
      <v-card>
        <v-card-title>
          {{ label1 }}
        </v-card-title>
        <v-card-text>{{label2}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot name="disagree">
            <v-btn
              color="#3b3b3b"
              text
              @click="dialog = false"
            > No
            </v-btn>
          </slot>
          <slot name="agree">
          </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      item: {
        type: Object,
        default: () => {}
      }
    }
  },
  props: {
    label1: {
      type: String
    },
    label2: {
      type: String
    },
    DioBtnClass: {
      type: String,
      default: 'white--text icon'
    },
    icon: {
      type: Boolean,
      default: false
    },
    DioLabel: String,
    DioColor: String,
    DioValue: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    DioValue (val) {
      this.dialog = val
    }
  }
}
</script>
