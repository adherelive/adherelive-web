import express from "express";
import Config from "../config/config";
import mysql from "../libs/mysql";


const app = express();

mysql();

app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(
    express.urlencoded({
        extended: false,
        limit: "50mb"
    })
);

app.listen(process.config.PORT, () => {
    console.log(`Server listening on port ${process.config.PORT}`);
});
