<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useNotificationsStore } from '../../stores/notifications'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const authStore = useAuthStore()
const notificationHub = useNotificationsStore()

async function logOut() {
  await notificationHub.stopSignalR()
  await authStore.logout()
  push({ name: 'login' })
}

onMounted(async () => {
  console.log('mounted')
  await logOut()
})
</script>
