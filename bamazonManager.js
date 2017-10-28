// This file would let the user enter as a manager
// and complete different types of operation.
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");
var dtb = require("./database_connect"); // Database information

var connection = mysql.createConnection({
    host: dtb.host,
    port: dtb.port,
    // Your username
    user: dtb.user,
    // Your password
    password: dtb.password,
    database: dtb.database
});


var manager = function manager_view() {
        inquirer.prompt({
                name: "manager_menu",
                type: "list",
                message: "Please select an option",
                choices: [
                    "View products on sale",
                    "View low Inventory",
                    "Add to Inventory",
                    "Add a New Product"
                ]
            }).then(function(ans) {
                switch (ans.manager_menu) {
                    case "View products on sale":
                        viewInventory();
                        break;
                    case "View low Inventory":
                        lowInventory();
                        break;
                    case "Add to Inventory":
                        addInventory();
                        break;
                    case "Add New Product":

                        break;
                    default:
                        break;
                }
            })
            // This function is to show to the manager all the products
            // Need to use Promises in order to show the menu one more time after displayin the results
        function viewInventory() {
            var table = new Table({
                head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
            });
            // This section would printout the table containing all the products
            var promise = new Promise(function(resolve, reject) {
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
                        console.log(table.toString());
                        resolve();
                    })
                }).then(function() {
                    manager_view();
                }) // End of promise
        }

        function lowInventory() {
            var table = new Table({
                head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
            });
            var promise = new Promise(function(resolve, reject) {
                    var query = "SELECT product.`item_id`, product.`product_name` as Product_Name, `department`.`department_name` as Department,`product`.`price` as Price , product.`stock_quantity` as Stock from product INNER JOIN department ON product.`department_name` = `department`.`department_id` WHERE `product`.`stock_quantity` = 0";
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
                        console.log(table.toString());
                        resolve();
                    })
                }).then(function() {
                    manager_view();
                }) // End of promise
        }

        function addInventory() {
            var table = new Table({
                head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
            });
            inquirer.prompt([{
                name: "productId",
                type: "input",
                message: "Please enter the Id of the product"
            }, {
                name: "amount",
                type: "input",
                message: "Please enter the amount to add"
            }]).then(function(ans) {
                var query = "UPDATE `product` SET `product`.`stock_quantity` = `product`.`stock_quantity` + ? WHERE `product`.`item_id` = ?";
                connection.query(query, [ans.amount, ans.productId], function(err, result) {})
                var query2 = "SELECT product.`item_id`, product.`product_name` as Product_Name, `department`.`department_name` as Department,`product`.`price` as Price , product.`stock_quantity` as Stock from product INNER JOIN department ON product.`department_name` = `department`.`department_id` WHERE `product`.`item_id` = ?";
                connection.query(query2, ans.productId, function(err, res) {
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
                    console.log("You Product have been updated");
                    manager_view();
                })


            })
        }




    } // End of function manager_view



// module.exports = manager;
manager();