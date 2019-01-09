<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xs3>
          <v-text-field
            append-icon="search"
            label="用户名"
            single-line
            hide-details
            @input="filterUserName"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            append-icon="search"
            label="手机号"
            single-line
            hide-details
            @input="filterMobile"
          ></v-text-field>
        </v-flex>

        <v-flex xs3>
          <v-menu
            ref="show_start_date"
            :close-on-content-click="false"
            v-model="show_start_date"
            :nudge-right="40"
            :return-value.sync="start_date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="start_date"
              label="From"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="start_date" @input="filterStartDate"></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs3>
          <v-menu
            ref="show_end_date"
            :close-on-content-click="false"
            v-model="show_end_date"
            :nudge-right="40"
            :return-value.sync="end_date"
            lazys
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="end_date"
              label="To"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="end_date" @input="filterEndDate"></v-date-picker>
          </v-menu>
        </v-flex>
        <!-- <v-flex sm12>
          <h3>会员列表</h3>
        </v-flex>-->
        <v-flex lg12>
          <v-card>
            <!--搜索栏-->
            <!--操作栏-->
            <v-toolbar flat color="white">
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2" @click="openDialog(null)">New Item</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field v-model="editedItem.username" label="姓名"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field v-model="editedItem.mobile" label="手机号"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field v-model="editedItem.gender" label="性别"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">取消</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">保存</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text class="pa-0">
              <v-data-table
                :headers="complex.headers"
                :search="searchForm"
                :items="complex.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':99999}]"
                class="elevation-1"
                item-key="id"
                :pagination.sync="pagination"
                :total-items="pagination.total"
                :loading="loading"
                @update:pagination="onPageChange"
                select-all
                v-model="complex.selected"
              >
                <template slot="items" slot-scope="props">
                    <td>
                      <v-checkbox primary hide-details v-model="props.selected"></v-checkbox>
                    </td>
                    <td>{{ props.item.id }}</td>
                    <td>
                      <v-avatar size="32">
                        <img :src="props.item.avatar" alt>
                      </v-avatar>
                    </td>
                    <td @click="expanded(props)">{{ props.item.username }}</td>
                    <td>{{ props.item.gender }}</td>
                    <td>{{ props.item.mobile }}</td>
                    <td>
                      <v-btn depressed outline icon fab dark color="primary" small slot="activator" @click="openDialog(props)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-btn depressed outline icon fab dark color="pink" small>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </td>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card class="elevation-10">
                    <v-card-text>
                      <v-data-table
                        :headers="subHeaders"
                        :items="subItems"
                        item-key="color"
                        hide-actions
                        class="elevation-10"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs">{{ props.item.color }}</td>
                          <td class="text-xs">{{ props.item.value }}</td>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </template>
              </v-data-table>
              <div class="text-xs-center pt-2">
                <v-pagination
                  v-model="pagination.current"
                  :length="pagination.pages"
                  @input="onPageChange"
                  @next="onPageChange"
                ></v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
import { Items as Users } from "@/api/user";
export default {
  data() {
    return {
      loading: true,
      search: "",
      formTitle: "新增",
      dialog: false,
      start_date: null,
      end_date: null,
      show_start_date: false,
      show_end_date: false,
      filters: {
        search: '',
        added_by: '',
        start_date: null,
        end_date: null,
      },      
      pagination: {
        descending: false,
        current: 1,
        rowsPerPage: 10,
        sortBy: "registerTime",
        totalItems: 20,
        total: 20
      },
      searchForm: {
        current: 1,
        size: 10,
        isAsc: false,
        descs: "",
        ascs: ""
      },
      editedItem: {
        username: '',
        mobile:'',
        gender:''
      },
      authors: [],
      complex: {
        selected: [],
        headers: [
          {
            text: "编号",
            value: "id"
          },
          {
            text: "头像",
            value: "avatar"
          },
          {
            text: "姓名",
            value: "username"
          },
          {
            text: "性别",
            value: "gender"
          },
          {
            text: "手机",
            value: "mobile"
          },
          {
            text: "操作",
            value: ""
          }
        ],
        items: []
      },
      subHeaders: [
        { text: "Color", value: "color" },
        { text: "Value", value: "value" }
      ],
      subItems: [
        { color: "Red", value: "1" },
        { color: "Green", value: "2" },
        { color: "Blue", value: "3" },
        { color: "Black", value: "4" }
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.searchForm.current = this.pagination.current;
      this.searchForm.size = this.pagination.rowsPerPage;
      this.searchForm.isAsc = !this.pagination.descending;
      if (this.searchForm.isAsc) {
        this.searchForm.descs = "";
        this.searchForm.ascs = this.pagination.sortBy;
      } else {
        this.searchForm.descs = this.pagination.sortBy;
        this.searchForm.ascs = "";
      }
      this.getRequest("/members", this.searchForm).then(res => {
        this.loading = false;
        if (res.status === 200) {
          this.complex.items = res.data.records;
          this.pagination.totalItems = res.data.total;
          this.pagination.total = res.data.total;
          this.pagination.pages = res.data.pages;
        }
      });
    },
    save() {
      this.dialog = false;
    },
    close() {
      this.dialog = false;
    },
    openDialog(props) {
        this.editedItem={};
        if(props == null ) {
        this.editedItem.username='';
        this.editedItem.mobile='';
        this.editedItem.gender='';
        }
        else {
        this.editedItem = props.item;
        }
        this.dialog = true;
    },
    onPageChange(newPage) {
      this.loadData();
      this.pagination.current = this.searchForm.current;
    },
    expanded(props) {
      console.log(props);
      props.expanded = !props.expanded;
    },
    filterUserName(val) {
      this.searchForm = this.$MultiFilters.updateFilters(this.searchForm, {
        username: val
      });
    },
    filterMobile(val) {
      this.searchForm = this.$MultiFilters.updateFilters(this.searchForm, {
        mobile: val
      });
    },

    filterStartDate(val) {
      // Close the date picker.
      this.$refs.show_start_date.save(val);
      //Convert the value to a timestamp before saving it.
      const timestamp = new Date(val + "T00:00:00Z").getTime();
      this.searchForm = this.$MultiFilters.updateFilters(this.filters, {
        start_date: timestamp
      });
    },
    filterEndDate(val) {
      // Close the date picker.
      this.$refs.show_end_date.save(val);
      //Convert the value to a timestamp before saving it.
      const timestamp = new Date(val + "T00:00:00Z").getTime();
      this.searchForm = this.$MultiFilters.updateFilters(this.searchForm, {
        end_date: timestamp
      });
    },
    customFilter(items, filters, filter, headers) {
      // Init the filter class.
      const cf = new this.$MultiFilters(items, filters, filter, headers);
      // Use regular function(),
      // arrow functions does not allow context binding.
      // Register the global standard filter.
      cf.registerFilter("search", function(searchWord, items) {
        if (searchWord.trim() === "") return items;
        return items.filter(item => {
          return item.name.toLowerCase().includes(searchWord.toLowerCase());
        }, searchWord);
      });
      // Use regular function(),
      // arrow functions does not allow context binding.
      // Register "added_by" filter.
      cf.registerFilter("added_by", function(added_by, items) {
        // If the filter has not been applied yet
        // just return all available items.
        if (added_by.trim() === "") return items;
        // Compare each item added_by and just return the matching ones.
        return items.filter(item => {
          return item.added_by.toLowerCase() === added_by.toLowerCase();
        }, added_by);
      });
      // Use regular function(),
      // arrow functions does not allow context binding.
      // Register "start_date" filter.
      cf.registerFilter("start_date", function(start_date, items) {
        // If the filter has not been applied yet
        // just return all available items.
        if (start_date === null) return items;
        // Compare each item start_date and just return the matching ones.
        return items.filter(item => {
          return item.birth_date >= start_date;
        }, start_date);
      });
      // Use regular function(),
      // arrow functions does not allow context binding.
      // Register "end_date" filter.
      cf.registerFilter("end_date", function(end_date, items) {
        // If the filter has not been applied yet
        // just return all available items.
        if (end_date === null) return items;
        // Compare each item end_date and just return the matching ones.
        return items.filter(item => {
          return item.birth_date <= end_date;
        }, end_date);
      });
      // Its time to run all created filters.
      // Will be executed in the order thay were defined.
      return cf.runFilters();
    }
  }
};
</script>
