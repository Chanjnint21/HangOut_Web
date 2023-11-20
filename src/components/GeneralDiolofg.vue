<template>

      <v-dialog
        v-model="dialog"
        persistent
        max-width="400"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <v-card>
          <v-card-title class="text-h6">
            {{ label1 }}
          </v-card-title>
          <v-card-text>{{label2}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <slot name="close">
              <v-btn
                color="#276678"
                text
                @click="dialog = false, $emit('Dio-clicked')"
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
      }
    },
    props: {
      label1: {
        type: String
      },
      label2: {
        type: String
      },
      textProp: String,
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
      },
      block: Boolean,
      rounded: Boolean
    },
    watch: {
        DioValue (val) {
            this.dialog = val
        }
    }
  }
  </script>
  