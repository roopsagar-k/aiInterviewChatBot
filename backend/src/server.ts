import { app } from "./index";
import { ENV } from "./config/env";
const PORT = ENV.PORT;

const startServer = () => {
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${ENV.PORT}`);
    });
}

startServer();