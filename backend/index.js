import app from "./server.js"

import mongoose from "mongoose"
import dotenv from "dotenv"

const PORT = process.env.PORT || 8000

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));




