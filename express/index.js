import express from "express";
const app = express()
const port = 3000


app.get('/',(req, res) => {
  res.send('contoh output dari index.js')

})

app.listen(port, () => {
    console.log(`contoh output dari get index ${port}`);
    
})