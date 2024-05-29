import { defineStore } from 'pinia'
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr'
import settings from '../api/services.config'

export const useNotificationsStore = defineStore('notifications', {
  state: () => {
    return {
      connection: null,
      connectionStarted: false,
    }
  },
  actions: {
    async startSignalR(jwtToken: string) {
      this.connection = this.createConnection({
        url: settings.moneyManageApi.signalRHubUrl,
        token: jwtToken,
      })

      const start = () => {
        this.connection
          .start()
          .then(() => {
            this.connectionStarted = true
          })
          .catch((err) => {
            console.log(err)
            this.connectionStarted = false
            setTimeout(start, 5000)
          })
      }

      // connection.invoke
      this.connection.onclose(() => {
        this.connectionStarted = false
        // start()
      })

      start()
    },

    async stopSignalR() {
      try {
        await this.connection.stop()
      } catch (err) {
        console.error(err)
      } finally {
        this.connection = null
      }
    },

    createConnection(config) {
      return new HubConnectionBuilder()
        .withUrl(config.url, {
          accessTokenFactory: () => config.token,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .build()
    },

    signalOn(methodName: string, newMethod = () => {}) {
      // tryOnScopeDispose(() => {
      //     this.connection.off(methodName)
      // })

      return this.connection.on(methodName, (...arg) => {
        newMethod(...arg)
      })
    },
  },
})
