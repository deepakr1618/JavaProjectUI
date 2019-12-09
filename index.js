const fetch = require('node-fetch')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

//ALL THE ROUTES ARE SERVED IN THE SAME FILE FOR SIPLICITY
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }))
app.use(express.static(path.join(__dirname, 'views')));

const getDoc = (id="")=>{
  return new Promise((res,rej)=>{
    fetch('https://javaproject-humble-bonobo-ph.cfapps.io/api/doctors/'+id, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }).then(async (response) => {
        res(response.json())
    }).catch(err => {rej(err)});
  })
}


const deleteDoc = (id="")=>{
  return new Promise((res,rej)=>{
    fetch('https://javaproject-humble-bonobo-ph.cfapps.io/api/doctors/'+id, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
      'Access-Control-Allow-Methods' : 'DELETE'}
    }).then(async (response) => {
      res(response)
    }).catch(err => {rej(err)});
  })
}

const addDoc = (id="",body={})=>{
  body = JSON.stringify(body)
  return new Promise((res,rej)=>{
    fetch('https://javaproject-humble-bonobo-ph.cfapps.io/api/doctors/'+id, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:body,
    }).then(async (response) => {
        res(response.json())
    }).catch(err => {rej(err)});
  })
}


app.get("/",(req,res)=>{
  res.render("home/index.ejs")
})


app.get("/doctors",(req,res)=>{
  const data = getDoc();
  data.then((x)=>{
    res.render("viewall/index.ejs" , {data:x})
  })
  .catch((err)=>{
      res.send(err)
  })
})


app.get("/doctors/:id",(req,res)=>{
  const data = getDoc(req.params.id);
  data.then((x)=>{
    res.render("indivisual/index.ejs" , {data:[x]})
  })
  .catch((err)=>{
      res.send(err)
  })
})


app.get("/insert",(req,res)=>{
  res.render("insert/index.ejs")
})

app.post("/insert",(req,res)=>{
  const name = req.body.name;
  const special = req.body.special
  const degree = req.body.degree
  const salary = parseInt(req.body.salary)
  const room = parseInt(req.body.room)
  const body1 = {"name":name , "special":special , "degree":degree , "salary":salary , "room":room}
  const data = addDoc("" , body1);
  data.then((x)=>{
    console.log(x)
    res.redirect("doctors/"+x.id)
  })
  .catch((err)=>{
      res.send(err)
  })
})



app.post("/updateExisting",(req,res)=>{
  const name = req.body.name;
  const special = req.body.special
  const degree = req.body.degree
  const salary = parseInt(req.body.salary)
  const room = parseInt(req.body.room)
  const id = parseInt(req.body.id)
  const body1 = {"name":name , "special":special , "degree":degree , "salary":salary , "room":room,  "id":id }
  const data = addDoc("", body1);
  data.then((x)=>{
    console.log(x)
    res.render("indivisual/index.ejs" , {data:[x]})
  })
  .catch((err)=>{
      res.send(err)
  })
})


app.post("/delete",(req,res)=>{
  const id  = req.body.id;
  console.log("deleting : "+id);
  const data = deleteDoc(id);
  data.then((x)=>{
    res.redirect("/doctors")
  })
  .catch((err)=>{
      res.send("Could not delete because : "+err)
  })
})


app.post("/update",(req,res)=>{
  const id  = req.body.id;
  console.log("Updating : "+id);
  const data = getDoc(id);
  data.then((x)=>{
    res.render("update/index.ejs" , {data:x})
  })
  .catch((err)=>{
      res.send(err)
  })
})


app.get("*",(req,res)=>{
  res.redirect("/")
})

app.listen(8080);
