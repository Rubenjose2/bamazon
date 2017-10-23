//Requeriment from npm//
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");

//Some color cool Setups
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;


//Database Connection with Bamazon
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});
// Ending of DATABASE connection

//Making the connection to the Database
connection.connect(function(err) {
    if (err) throw err;
    list_of_product();
});
//Creation of the Table Container to Display in the console
var table = new Table({
    head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
});
// Creation of the First Query "Result of the all product"
function list_of_product() {
    var query = "SELECT product.`item_id`, product.`product_name` as Product_Name, `department`.`department_name` as Department,`product`.`price` as Price , product.`stock_quantity` as Stock from product INNER JOIN department ON product.`department_name` = `department`.`department_id`";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([ //start adding the result of the query inside the table to be diplay
                res[i].item_id,
                res[i].Product_Name,
                res[i].Department,
                res[i].Price,
                res[i].Stock
            ])
        }
        console.log(table.toString()) //display the table
        main_menu(); // call the prompt to display the user options
    })
}

function main_menu() {
    // list_of_product();
    inquirer.prompt({
        name: "main_menu",
        type: "list",
        message: "Are you?:",
        choices: [
            "User",
            "Manager",
            "Supervisor",
            "exit"
        ]
    }).then(function(ans) {
        switch (ans.main_menu) {
            case "User":
                UserOption();
                break;
            default:
                break;
        }
    })
}

function UserOption() {
    inquirer.prompt([{
        name: "productId",
        type: "input",
        message: "Please enter the Product ID"
    }, {
        name: "quantity",
        type: "input",
        message: "How many unit do you want?"
    }]).then(function(ans) {
        product_buy(ans.productId, ans.quantity);
    })
}




//function to query a product and returning the quantity

function product_buy(id, buy_amount) {
    var qta = 0;
    var prod_description = "";
    var prod_price = 0;
    var promise = new Promise(function(resolve, reject) { //We are creating a promise in order to Run the Query asynchronously
        var query = "SELECT `product`.`stock_quantity` as stock, `product`.`product_name` as Product_name, product.`price` as price from product WHERE product.`item_id` = ?;"
        connection.query(query, [id], function(err, result) {
            if (err) throw err;
            qta = result[0].stock;
            prod_description = result[0].Product_name;
            prod_price = result[0].price;
            resolve([qta, prod_description, prod_price]); // Will update the value once the Query is already resolved
        })
    });
    promise.then(function(val) { // After the query is completed then we go and update the database or check is there is stock
        var value_updated = val[0] - buy_amount;
        var purchase = buy_amount * val[2];
        if (value_updated >= 0) {
            var query = "UPDATE `product` set product.`stock_quantity`=? WHERE product.`item_id` = ?";
            connection.query(query, [value_updated, id], function(err, result) {
                console.log(notice("Thanks for buying " + val[1] + ", your order have been processed for $ " + purchase));
            })
        } else {
            console.log(error("**** We are sorry but there is no enough stock of this product *****"));
        }
    });
}