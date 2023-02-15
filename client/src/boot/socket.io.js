import { boot } from "quasar/wrappers";
import { io } from "socket.io-client";

const socketIo = io(
  `http://${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}`,
  {
    autoConnect: false,
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$socketIo = socketIo;
});

export { socketIo };
