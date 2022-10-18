<script setup>
import { ref } from "vue"
import { useAuthStore } from "../../stores/auth"
const auth = useAuthStore()

const geetingTime = ref("")

let day = new Date()
let hr = day.getHours()

geetingTime.value =
  hr >= 0 && hr < 11
    ? "Guten Morgen,"
    : hr >= 11 && hr <= 18
      ? "Guten Tag,"
      : "Guten Abend,";
</script>

<template>

  <div class="row">
    <div class="col-12">
      <div class="welcome">
        <div v-if="auth.user" class="welcome__content">
          <div class="user-img">
            <img v-if="auth.user.picture" :src="getImgUrl(`public/profile/${auth.user.picture}`)" alt="" srcset="" />
            <span v-else>{{ auth?.user?.name?.charAt(0) }}</span>
          </div>
          <h2 class="name">
            {{ geetingTime }} {{ auth.user.first_name }}
            {{ auth.user.last_name }}
          </h2>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss">
.stat-card.user,
.stat-card.notification {
  svg path {
    stroke: #ffa42f;
  }
}
</style>

<style lang="scss">
.welcome {
  min-height: 85vh;
  border-radius: 5px;
  border: 1px solid #ddd;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  &__content {
    .name {
      font-size: 2rem;
      font-weight: 500;
      text-transform: capitalize;
    }
    text-align: center;
    .user-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #eee;
      margin: 1rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      font-weight: 600;
      background-color: #eee;
      text-transform: uppercase;
      box-shadow: 0 4px 16px rgb(0 0 0 / 16%);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
