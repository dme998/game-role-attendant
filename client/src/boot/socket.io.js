import { boot } from 'quasar/wrappers'
import { v4 } from 'uuid'
import { io } from 'socket.io-client'

const socketIo = io("http://localhost:3000", {
  reconnectionDelayMax: 10000,
  auth: {
    token: v4(),
  },
});

export default boot(({ app }) => {
  app.config.globalProperties.$socketIo = socketIo
})

export { socketIo }
