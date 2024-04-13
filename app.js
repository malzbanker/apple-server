
require("dotenv").config()
const express = require("express");
const mysql = require("mysql2");
const bodyParser=require("body-parser")
var app = express();
var cors = require("cors");
app.use(cors());
// Use  body parser as middle ware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const connection = mysql.createConnection({
    host     : 'localhost',
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });
   
  connection.connect((err) => {
      if (err) {
          console.log(err);
      } else {
          console.log('connected');
      }
  });


//Install: Create the tables necessary
app.get("/install", (req, res) => {
    let message = "Tables Created";
    let createProducts = `CREATE TABLE if not exists Products(
        product_id int auto_increment,
        product_url varchar(255) not null,
        product_name varchar(255) not null,
        PRIMARY KEY (product_id)
    )`;

    let createProductDescription = `CREATE TABLE if not exists ProductDescription(
        description_id int auto_increment,
        product_id int(11) not null,
        product_brief_description TEXT not null,
        product_description TEXT not null,
        product_img varchar(255) not null,
        product_link varchar(255) not null,
        PRIMARY KEY (description_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
      )`;
      let createProductPrice = `CREATE TABLE if not exists ProductPrice(
        price_id int auto_increment,
        product_id int(11) not null,    
        starting_price varchar(255) not null,
        price_range varchar(255) not null,
        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
      )`;
    
      let createUser = `CREATE TABLE if not exists User(
        user_id int auto_increment,
        user_name TEXT not null,   
        user_passward VARCHAR(255) not null,
        PRIMARY KEY (user_id)
      )`;
    
      let createOrder = `CREATE TABLE if not exists Orders(
        orders_id int auto_increment,
        product_id int(11) not null,    
        user_id int(11) not null,
        PRIMARY KEY (orders_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      )`;
    
     
  
    connection.query(createProducts, (err, results, fields) => {
        if (err) console.log(err);
    });

    connection.query(createProductDescription, (err, results, fields) => {
        if (err) console.log(err);
    });

    connection.query(createProductPrice, (err, results, fields) => {
        if (err) console.log(err);
    });

    connection.query(createUser, (err, results, fields) => {
        if (err) console.log(err);
    });

    connection.query(createOrder, (err, results, fields) => {
        if (err) console.log(err);
    });
    res.end(message);
});


app.post("/addiphones", (req, res) => {
  
  const { productid, productname, producturl, BriefDescription, productDescription, productimage, productlink, StartPrice, priceRange } = req.body;
  console.table(req.body);
 
  let addedProductId = 0;
  let sqlAddToProducts =
    `INSERT INTO Products (product_url, product_name) VALUES ('${producturl}','${productname}
  ' )`;
 

  let sqlAddToDescription =
    'INSERT INTO ProductDescription (product_id,product_brief_description, product_description,product_img,product_link) VALUES (?,?,?,?,?)';
  let sqlAddToPrice =
    'INSERT INTO ProductPrice (product_id,starting_price,price_range) VALUES (?,?,?)';

  connection.query(sqlAddToProducts, function (err, result) {
    if (err) throw err;
    console.table(result);

    const id = result.insertId;
    console.log("inserted id is >>>:", id);
    
    connection.query(sqlAddToDescription, [id, BriefDescription, productDescription, productimage, productlink], function (err, result) {
      if (err) console.log(`found error:${err}`);
    });

    connection.query(sqlAddToPrice, [id, StartPrice, priceRange], function (err, result) {
      if (err) console.log(`found error:${err}`);
    });
  });
})

  app.get("/malede", (req, res) => {
    connection.query(
      "SELECT * FROM Products JOIN ProductDescription JOIN ProductPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id = ProductPrice.product_id",
      (err, rows, fields) => {
        let iphones = { products: [] };
        iphones.products = rows;
        var stringIphones = JSON.stringify(iphones);
        if (!err) res.end(stringIphones);
        else console.log(err);
      }
    );
  });
  
  
  app.get("/", (req, res) => {
    res.end("<h1>The Server is Up and Running...</h1>");
  });
  
  const port = 3001; //for LOCAL
 
  app.listen(port, () => {
    console.log(
      "Listening to : " + port,
      `\nRunning on => http://localhost:${port}`)
  }
   
    
  );
