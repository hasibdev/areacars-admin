<script setup>
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/buttons/BackButton.vue'

const { t } = useI18n({ useScope: "global" })
</script>

<template>

  <BackButton :label="t('title.settings')" />
  <h5 class="mt-4 mb-3">Benutzer</h5>

  <div class="py-3">
    <div class="row">
      <!-- Nächste Rechnung -->
      <div class="col-md-6 mt-4">
        <div class="settings-box h-100 border rounded">
          <div class="d-flex ">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.3327 3.3335H9.99935C9.11529 3.3335 8.26745 3.68469 7.64233 4.30981C7.0172 4.93493 6.66602 5.78277 6.66602 6.66683V33.3335C6.66602 34.2176 7.0172 35.0654 7.64233 35.6905C8.26745 36.3156 9.11529 36.6668 9.99935 36.6668H29.9993C30.8834 36.6668 31.7312 36.3156 32.3564 35.6905C32.9815 35.0654 33.3327 34.2176 33.3327 33.3335V13.3335L23.3327 3.3335Z" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M23.334 3.3335V13.3335H33.334" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M26.6673 21.6665H13.334" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M26.6673 28.3335H13.334" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M16.6673 15H15.0007H13.334" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="ms-4">
              <h5 class="mb-5 ">Nächste Rechnung</h5>

              <h2>799,00 €</h2>

              <p class="text-muted text-13">Nächste Zahlung 31.12.2021</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Laufzeit -->
      <div class="col-md-6 mt-4">
        <div class="settings-box h-100 border rounded">
          <div class="d-flex ">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0007 36.6668C29.2054 36.6668 36.6673 29.2049 36.6673 20.0002C36.6673 10.7954 29.2054 3.3335 20.0007 3.3335C10.7959 3.3335 3.33398 10.7954 3.33398 20.0002C3.33398 29.2049 10.7959 36.6668 20.0007 36.6668Z" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 10V20L26.6667 23.3333" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="ms-4">
              <h5 class="mb-4 ">Laufzeit</h5>

              <p>01.01.2022 – 31.12.2022 (12 Monate)</p>
            </div>
          </div>

        </div>
      </div>
      <!-- Historie -->
      <div class="col-md-6 mt-4">
        <div class="settings-box h-100 border rounded">
          <div class="d-flex ">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0001 7.40002C16.7169 7.39561 13.5625 8.67714 11.2127 10.9701L11.0368 11.1417H11.2825H13.9583C14.2633 11.1417 14.5558 11.2628 14.7715 11.4785C14.9872 11.6942 15.1083 11.9867 15.1083 12.2917C15.1083 12.5967 14.9872 12.8892 14.7715 13.1049C14.5558 13.3205 14.2633 13.4417 13.9583 13.4417H8.54167C8.23667 13.4417 7.94416 13.3205 7.72849 13.1049C7.51283 12.8892 7.39167 12.5967 7.39167 12.2917V6.87502C7.39167 6.57002 7.51283 6.27751 7.72849 6.06184C7.94416 5.84618 8.23667 5.72502 8.54167 5.72502C8.84667 5.72502 9.13917 5.84618 9.35484 6.06184C9.57051 6.27751 9.69167 6.57002 9.69167 6.87502V9.00918V9.23898L9.85982 9.08236C12.6131 6.518 16.2373 5.09464 19.9999 5.10002H20C28.2289 5.10002 34.9 11.7711 34.9 20C34.9 28.229 28.2289 34.9 20 34.9C11.7711 34.9 5.1 28.229 5.1 20C5.1 19.5687 5.11821 19.1407 5.15463 18.7186L5.15465 18.7184C5.20901 18.0737 5.76997 17.6 6.4275 17.6C7.04494 17.6 7.51636 18.1696 7.45629 18.7988L7.45627 18.799C7.41932 19.1937 7.4 19.5935 7.4 20C7.4 26.9586 13.0414 32.6 20 32.6C26.9586 32.6 32.6 26.9586 32.6 20C32.6 13.0415 26.9586 7.40009 20.0001 7.40002ZM20.0001 7.40002L20 7.50002V7.40002C20 7.40002 20.0001 7.40002 20.0001 7.40002ZM20.7333 20V20.1H20.8333H23.75C24.055 20.1 24.3475 20.2212 24.5632 20.4368C24.7788 20.6525 24.9 20.945 24.9 21.25C24.9 21.555 24.7788 21.8475 24.5632 22.0632C24.3475 22.2789 24.055 22.4 23.75 22.4H19.5833C19.2783 22.4 18.9858 22.2789 18.7702 22.0632C18.5545 21.8475 18.4333 21.555 18.4333 21.25V12.9167C18.4333 12.6117 18.5545 12.3192 18.7702 12.1035C18.9858 11.8878 19.2783 11.7667 19.5833 11.7667C19.8883 11.7667 20.1808 11.8878 20.3965 12.1035C20.6122 12.3192 20.7333 12.6117 20.7333 12.9167V20Z" fill="#AAAAAA" stroke="white" stroke-width="0.2" />
            </svg>

            <div class="ms-4 w-100">
              <h5 class="mb-4 ">Historie</h5>

              <div class="row">
                <div class="col-md-6 mb-2">
                  <span class="me-2">Rechnung January 2022</span>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 10L12 15L17 10" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 15V3" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="col-md-6 mb-2">
                  <span class="me-2">Rechnung January 2022</span>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 10L12 15L17 10" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 15V3" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="col-md-6 mb-2">
                  <span class="me-2">Rechnung January 2022</span>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 10L12 15L17 10" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 15V3" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="col-md-6 mb-2">
                  <span class="me-2">Rechnung January 2022</span>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 10L12 15L17 10" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 15V3" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Laufzeit -->
      <div class="col-md-6 mt-4">
        <div class="settings-box h-100 border rounded">
          <div class="d-flex ">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0007 36.6668C29.2054 36.6668 36.6673 29.2049 36.6673 20.0002C36.6673 10.7954 29.2054 3.3335 20.0007 3.3335C10.7959 3.3335 3.33398 10.7954 3.33398 20.0002C3.33398 29.2049 10.7959 36.6668 20.0007 36.6668Z" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 10V20L26.6667 23.3333" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="ms-4">
              <h5 class="mb-4 ">Laufzeit</h5>

              <p>Banküberweisung</p>

              <ul class="text-14">
                <li>Workspacify UG</li>
                <li>Berliner Sparkasse</li>
                <li>IBAN DE24100500000191090883</li>
                <li>BIC BELADEBEXXX</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>


<style lang="scss" scoped>
.settings-box {
  padding: 33px;
  min-height: 230px;
}
</style>
