import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const username = "";
const password = "";
const apiKey = "";
const token = "";
const credential = `${username}:${password}`;
const authHeader = 'Basic '+Buffer.from(credential).toString('base64');
const bearerkey = `Bearer ${token}`

app.get("/", (req, res)=>{
   res.render('index.ejs');
});

app.post('/noauth', async (req, res) => {
  try {
    const response = await axios.get('https://secrets-api.appbrewery.com/random');
    console.log(response.data);
    res.render('index.ejs', {
      data: response.data
    });
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
    res.status(500).send('Failed to fetch data');
  }
});

app.post("/basicauth", async (req, res) =>{
    try{
       var derData = await axios.get("https://secrets-api.appbrewery.com/all?page=1", {
        headers: {Authorization: authHeader}
       })
       res.render('index.ejs', {
        data: derData.data
       });
    }
    catch (error){
        console.log(`${error.message}`);
        res.status(500).send('Failed to fetch data');
    }
});

app.post("/apikey", async (req, res) =>{
    try{
        var derData = await axios.get(`https://secrets-api.appbrewery.com/filter?score=5&apiKey=${apiKey}`)
        res.render('index.ejs', {
            data: derData.data
        });
    }
    catch (error){
        console.log(`${error.message}`);
        res.status(500).send('Failed to fetch data');
    }
});

app.post("/bearertoken", async (req, res) => {
    try{
        var derData = await axios.get("https://secrets-api.appbrewery.com/user-secrets", {
           headers: {Authorization: bearerkey}
        });
        res.render('index.ejs', {
            data: derData.data
        });
    }
    catch (error){
        console.log(`Failed to fetch data ${error.message}`);
        res.status(500).send('Failed to fetch data');
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
