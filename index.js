const express = require('express');
const AppRoutes = require('./src/routes');
const app = express();
app.use(express.json());

app.use('/', AppRoutes);


app.listen(8000, () => console.log("Server listening to Port 8000"));