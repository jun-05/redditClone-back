import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source"

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get("/",(_,res) => res.send("running"));

let port =4000;
app.listen(port,async () =>{
    console.log(`server runnit at port... : ${port}`)
    AppDataSource.initialize().then(async () => {
        console.log("database initialize")
    }).catch(error => console.log(error))
     
})