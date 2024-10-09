import express from 'express'
import dotenv from 'dotenv'
const app =express();
dotenv.config();
const portnumber=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Hi Sanika")
})
app.get("/start",async (req,res)=>{
    const response=await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    res.send(await response.json());
})
app.listen(portnumber,()=>console.log(`Listening on port ${portnumber}`));