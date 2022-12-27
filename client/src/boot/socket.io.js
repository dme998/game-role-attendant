import { boot } from "quasar/wrappers";
import { io } from "socket.io-client";

const socketIo = io("http://localhost:3000", {
  autoConnect: false,
});

export default boot(({ app }) => {
  app.config.globalProperties.$socketIo = socketIo;
});

export { socketIo };
