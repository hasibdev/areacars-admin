<script setup>
const props = defineProps({
   variant: {
      type: String,
      default: 'primary'
   },
   text: String
})
</script>

<template>
   <div class="badge__root">
      <span :class="`status-badge ${props.variant}`">
         <slot>{{ text }}</slot>
      </span>
   </div>
</template>

<style lang="scss" scoped>
.badge__root {
   .status-badge {
      min-width: 110px;
      border-radius: 5px;
      text-align: center;
      padding: 5px;
      display: inline-block;

      &.primary {
         background-color: #e3edff;
         color: #276ef1;
      }
      &.secondary {
         background-color: #f0f0f0;
         color: #333333;
      }
      &.info {
         background-color: #e3edff;
         color: #0dcaf0;
      }
      &.success {
         background-color: #d0ffe5;
         color: #1bce6c;
      }
      &.warning {
         background-color: #e3edff;
         color: #fd7e14;
      }
      &.danger {
         background-color: #f56c6b7d;
         color: #f23e3d;
      }
   }
}
</style>
