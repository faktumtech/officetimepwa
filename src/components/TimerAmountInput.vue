<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    :overlayColor="$vuetify.theme.dark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <template v-slot:activator="{ on, attrs }">
      <span
        class="amountDisplay"
      >
        {{ formatAmount(session.a) }}
      </span>
      <v-icon
        small
        class="ml-1"
        v-bind="attrs"
        v-on="on"
      >
        {{ mdiPencil }}
      </v-icon>
    </template>
    <v-card>
      <v-form
        @submit.prevent="save()"
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-card-title>
          <span class="headline">{{ session.e ? 'Adjust expense' : 'Adjust rate' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-if="session.e"
                cols="12"
              >
                <v-text-field
                  v-model="amount"
                  label="Amount *"
                  type="number"
                  :rules="amountRules"
                ></v-text-field>
              </v-col>
              <v-col
                v-else
                cols="12"
              >
                <v-text-field
                  :value="formatTime(session.t)"
                  label="Time"
                  type="text"
                  disabled
                ></v-text-field>
                <v-text-field
                  v-model="rate"
                  label="Rate/Hour*"
                  type="number"
                  :rules="rateRules"
                  min="0"
                ></v-text-field>
                <v-text-field
                  :value="formatAmount(amount)"
                  label="Amount"
                  type="text"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiPencil } from '@mdi/js'

export default {
  name: 'TimerTimeInput',
  data: () => ({
    show: false,
    valid: false,
    mdiPencil: mdiPencil,
    amount: 0,
    rate: 0,
    amountRules: [
      // positive decimal
      (v) => /^\d*\.{0,1}\d+$/.test(v) || 'A amount is required and has to be >= 0'
    ],
    rateRules: [
      // positive decimal
      (v) => /^\d*\.{0,1}\d+$/.test(v) || 'A rate is required and has to be >= 0'
    ]

  }),
  props: {
    session: {
      type: Object,
      default () {
        return {
          id: null,
          t: 0
        }
      }
    }
  },
  computed: {
    hours: {
      get () {
        return Math.floor(this.session.t / 60)
      },
      set (newHours) {
        this.timerValue = this.minutes + 60 * +newHours
      }
    },
    minutes: {
      get () {
        return this.session.t - Math.floor(this.session.t / 60) * 60
      },
      set (newMinutes) {
        this.timerValue = this.hours * 60 + +newMinutes
      }
    }
  },
  mounted: function () {
  },
  watch: {
    show: function (show) {
      if (show) {
        this.rate = this.session.r
        this.amount = this.session.a
      }
    },
    rate: function (rate) {
      if (!this.session.e) {
        this.amount = Math.round((+rate * this.session.t / 60 + 0.00001) * 100) / 100
      }
    }
  },
  methods: {
    formatTime: function (time) {
      const hours = Math.floor(time / 60)
      const minutes = time - hours * 60
      return '' + hours + ' : ' + ('0' + minutes).slice(-2)
    },
    formatAmount: function (amount) {
      // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
      return Math.round((amount + 0.00001) * 100) / 100
    },
    save: async function () {
      if (this.session.e) {
        // cast to number
        const amount = +this.amount
        if (this.session.a !== amount) {
          const payload = { id: this.session.id, changes: { a: amount } }
          await this.$store.dispatch('updateSession', payload)
        }
      } else {
        // cast to number
        const rate = +this.rate
        if (this.session.r !== rate) {
          const payload = { id: this.session.id, changes: { r: rate, a: this.amount } }
          await this.$store.dispatch('updateSession', payload)
        }
      }
      this.show = false
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .timerTimeInput {
    display: flex;
    flex: 1 1 auto;
  }
  .timerTimeInputHours, .timerTimeInputMinutes {
    max-width: 50px !important;
  }
  .timerTimeInput input {
    text-align: right;
  }
  .timerTimeInput .separator {
    margin-top: 4px;
  }

</style>