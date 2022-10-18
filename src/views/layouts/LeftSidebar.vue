<script setup>
import { ref } from 'vue'
import AppLogo from "@/components/icons/AppLogo.vue"
import BellIcon from "@/components/icons/BellIcon.vue"
import CarIcon from "@/components/icons/CarIcon.vue"
import SettingsIcon from "@/components/icons/SettingsIcon.vue"
import CarcopyIcon from "@/components/icons/CarcopyIcon.vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../stores/auth"

const router = useRouter()
const auth = useAuthStore()
const navigationKey = ref(1)

const meneus = [
  {
    id: 2,
    text: "Fahrzeuge",
    route: "/vehicles",
    icon: CarIcon,
  },
  {
    id: 3,
    text: "Car Copy",
    route: "/carcopy",
    icon: CarcopyIcon,
  },
  {
    id: 4,
    text: "Einstellungen",
    route: "/settings",
    icon: SettingsIcon,
  },

]

const onLogout = async () => {
  await auth.logout()

  router.replace("/login")
};
</script>

<template>
  <div class="nav-sidebar">
    <!-- logo -->
    <div class="nav-sidebar__logo">
      <router-link to="/">
        <AppLogo />
      </router-link>
    </div>

    <!-- navigations -->
    <div :key="navigationKey" class="nav-sidebar__content">
      <ul class="nav-sidebar__links">
        <!-- sin -->
        <li v-for="menu in meneus" :key="menu.id" class="nav-sidebar__link-item">
          <router-link @click="++navigationKey" :to="menu.route" class="nav-sidebar__link">
            <span class="icon">
              <component :is="menu.icon" />
            </span>
            <h6 class="nav-label">{{ menu.text }}</h6>
          </router-link>
        </li>
      </ul>

      <!-- support links -->
      <ul class="nav-sidebar__user-settings mb-3">
        <li>
          <router-link to="/settings/notifications" class="nav-sidebar__link">
            <span class="icon">
              <BellIcon />
            </span>
            <h6 class="nav-label">Benachrichtigungen</h6>
          </router-link>
        </li>
        <li class="mt-2">
          <a class="nav-sidebar__user nav-sidebar__link pointer">
            <template v-if="auth.user">
              <div class="user-avater overflow-hidden">
                <img v-if="auth.user.picture" :src="getImgUrl(`public/profile/${auth.user.picture}`)" />
                <span v-else>{{ auth?.user?.name?.charAt(0) }}</span>
              </div>
            </template>

            <ul class="nav-sidebar__link__sub">
              <li class="nav-sidebar__link__sub-item">
                <!-- <router-link to="/profile" class="text-dark text-decoration-none">
                  Profil
                </router-link> -->
                <router-link @click="++navigationKey" to="/profile" class="text-dark text-decoration-none d-block">
                  Profil
                </router-link>
              </li>
              <li class="divider"></li>
              <li class="nav-sidebar__link__sub-item">
                <a href="javascript:void(0)" @click="onLogout" class="text-dark d-block text-decoration-none">
                  Abmelden
                </a>
              </li>
            </ul>
          </a>

        </li>

      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.nav-sidebar {
  height: 100vh;
}

.nav-sidebar__link__sub {
  position: absolute;
  min-width: 14rem;
  max-width: 17rem;
  left: 4rem;
  color: var(--color-text);
  background-color: var(--color-white);
  // top: 0;
  border: 1px solid var(--color-light-grey);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 99;
  bottom: 0;

  &-item {
    font-size: 15px;
    font-weight: 500;
    padding: 0.875rem 0 0.875rem 1.5rem;
    &:hover {
      background-color: var(--color-light-grey);
    }
  }

  .divider {
    margin: 0.25rem auto;
    height: 1px;
    width: 85%;
    background-color: #ccced1;
  }
}

.nav-sidebar {
  &__logo {
    margin: 1.75rem 0;
    text-align: center;
    width: 100%;

    .logo {
      max-width: 100%;
      height: auto;
    }

    svg {
      --size: 60px;
      width: var(--size);
      height: var(--size);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 7rem);
    padding: 0 8px;
  }

  &__link {
    height: 3rem;
    width: 100%;
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    margin-bottom: 1px;
    margin-top: 5px;
    position: relative;

    .icon {
      text-transform: uppercase;
      svg {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .nav-label {
      position: absolute;
      left: 4rem;
      color: #4f4444;
      background-color: var(--color-white);
      top: 0;
      border: 1px solid var(--color-light-grey);
      overflow: hidden;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 99;
      margin-left: 0.5rem;
      padding: 0.875rem 0 0.875rem 1.5rem;
      min-width: 12.5rem;
      font-size: 15px;
    }

    &.router-link-active,
    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
      svg {
        &.car__icon {
          path {
            fill: #fff;
          }
        }
        &.carcopy__icon {
          g {
            opacity: 1 !important;
          }
        }
        &.settings__icon,
        &.bell__icon {
          path {
            stroke: #fff !important;
          }
        }
      }
    }

    &:hover {
      .nav-label {
        left: 3rem;
        visibility: visible;
      }

      .nav-sidebar__link__sub {
        visibility: visible;
        left: 3rem;
      }
    }

    &.nav-sidebar__user {
      background: var(--color-grey);
      width: 2rem;
      height: 2rem;
      margin: 0 auto;
      padding: 0;
      border-radius: 50%;

      .user-avater {
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
      }
    }
  }

  &__user-settings {
    position: absolute;
    bottom: 1rem;
    width: 100%;
    left: 0;
    padding: 0 8px;
  }
}
</style>
