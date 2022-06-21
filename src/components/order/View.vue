<template>
  <v-container>
    <template v-slot:[`item.invoice`]="{ item }">
      <a href="#" @click="viewOrder(item.invoice)">
        {{ item.invoice }}
      </a>
    </template>

    <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ idHeader }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-card outlined>
                <v-data-table
                  :headers="headers"
                  :items="transactions.data"
                  :options.sync="options"
                  :server-items-length="total"
                  class="mt-12"
                >
                  <!-- <ViewForm /> -->

                  <template v-slot:[`item.invoice`]="{ item }">
                    <a href="#" @click="viewOrder(item.invoice)">
                      {{ item.invoice }}
                    </a>
                  </template>

                  <template v-slot:[`item.created_at`]="{ item }">
                    {{ dateFromNow(item.created_at) }}
                  </template>

                  <template v-slot:[`item.updated_at`]="{ item }">
                    {{ dateFromNow(item.updated_at) }}
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex justify-end align-center">
                      <Form :transaction="item" />

                      <Delete
                        :item="item"
                        :name="item.invoice"
                        :delete="deleteTransaction"
                      />
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog2 = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog2 = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
