<script setup>
import { ref } from "vue"
import Loading from "@/components/views/Loading.vue"

const emit = defineEmits(["onSearch"])
const props = defineProps({
  data: { type: [Array, null], required: true },
  fields: { type: Array, required: true },
  tableRootClass: { type: String, default: "" },
  tableClasses: { type: String, default: "base-table" },
  searchable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
})

const capitalize = (string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return ''
  }
}

// Get the table Head
const getTh = (col) => {
  if (typeof col === "object") {
    // eslint-disable-next-line no-prototype-builtins
    if (col.hasOwnProperty("label")) {
      return col.label
    }
    return col.field
      .split("_")
      .map((t) => capitalize(t))
      .join(" ")
  }

  return col
    .split("_")
    .map((t) => capitalize(t))
    .join(" ")
}

// Get the table Data
const getTd = (row, col) => {
  if (typeof col === "object") {
    // eslint-disable-next-line no-prototype-builtins
    if (col.hasOwnProperty("handler")) {
      return col.handler(row)
    }
    return row[col.field]
  }

  return row[col]
}

// Get Coulmn Name
const getColName = (col) => {
  if (typeof col === "object") {
    return col.field
  }
  return col
}

// Searching
const searchText = ref("")
const onSearch = () => {
  emit("onSearch", searchText.value)
};
</script>

<template>
  <div class="table-root">
    <!-- Toolbar -->
    <div class="d-flex justify-content-end align-items-center mb-3">
      <!-- Brefore content slot -->
      <slot name="toolbar-prepend" />

      <!-- Search Input -->
      <div v-if="props.searchable" class="search-input-root mx-3">
        <input v-model="searchText" @input="onSearch" type="text" class="search-input" placeholder="Suche" />
        <div class="search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.9984 20.9999L16.6484 16.6499" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- Filter Icon -->
      <div v-if="props.filterable">
        <slot name="filters">
          <svg width="40" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 33V26" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 22V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 33V24" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 20V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 33V28" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 24V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 26H19" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 20H27" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29 28H35" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#DDDDDD" />
          </svg>
        </slot>
      </div>

      <!-- After content slot -->
      <slot name="toolbar-append" />
    </div>

    <!-- Table -->
    <div :class="props.tableRootClass" class="table__wrapper">
      <div class="table-responsive">
        <table class="table table-borderless w-100" :class="props.tableClasses">
          <thead>
            <tr>
              <th v-for="(col, i) in props.fields" :key="i" :class="col.thClass" scope="col">
                <span class="span" :class="`${col.hideTh ? 'text-transparent' : ''}`">
                  <slot :name="`th-${getColName(col)}`" :col="col">
                    {{ getTh(col) }}
                  </slot>
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-if="!props.loading">
            <tr v-for="(row, i) in props.data" :key="i" :class="{ bordered: props.bordered, even: i%2!=0 }">
              <td v-for="(col, ii) in props.fields" :key="ii" :class="col.tdClass">
                <slot :name="getColName(col)" :row="row" :index="i" :col="row[getColName(col)]">
                  {{ getTd(row, col) ?? "-" }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- No data -->
        <p v-if="!props.loading && !props.data.length" class="text-center">
          No Data found!
        </p>

        <!-- Loading -->
        <Loading v-if="props.loading" />
      </div>

      <!-- Pagination -->
      <slot v-if="props.data.length" name="pagination"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .table-responsive {
//   min-height: 300px;
// }
.table-root {
  .search-input-root {
    position: relative;
    background-color: #f2f2f2;
    border-radius: 5px;
    .search-input {
      border: 0;
      outline: 0;
      padding: 6px 10px 6px 45px;
      background: transparent;
      color: #444;
      display: block;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.table__wrapper {
  display: flex;
  flex-direction: column;
  // min-height: 60vh;
  justify-content: space-between;

  .table-responsive {
    height: calc(100vh - 230px);
    overflow: auto;

    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 9px;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
      background: #dadce0;
    }
  }
}

.base-table {
  color: #666;
  // min-height: 250px;
  thead {
    position: sticky;
    top: 0;
    z-index: 6;
    th {
      padding: 0 !important;
      white-space: nowrap;
      .span {
        background-color: #f6f7fb;
        display: block;
        padding: 10px;
        margin-bottom: 5px;
        font-weight: 500;
      }
      &:first-child {
        .span {
          padding-left: 25px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
      }
      &:last-child {
        .span {
          padding-right: 25px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
    }
  }
  tbody {
    tr {
      // &.bordered:not(:last-child) {
      //   border-bottom: 1px solid #eee;
      // }
      &.even {
        background-color: #f6f7fb;
      }

      td {
        padding: 1rem 0.5rem;
        color: #666;
        &:first-child {
          padding-left: 25px;
        }
        &:last-child {
          padding-right: 25px;
        }
      }
    }
  }
}

.pagination_wrapper {
  display: flex;
  justify-content: end;
  align-items: center;
  .page_item {
    background-color: #fff;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    color: #444;
    font-weight: bold;
    &:hover {
      background-color: var(--color-primary);
      color: #fff;
    }
  }
}
</style>
