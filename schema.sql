-- Starting with making sure the database dont exits
DROP DATABASE IF EXISTS bamazon;
-- create de database bamazon
CREATE DATABASE bamazon;
-- use the database 
USE bamazon;
-- let create the table products
CREATE TABLE product(
item_id INT AUTO_INCREMENT,
product_name VARCHAR(255),
department_name INT,
price DECIMAL(10,2),
stock_quantity INT DEFAULT NULL,
PRIMARY KEY(item_id)
);
-- let create the table department
CREATE TABLE department(
    department_id INT AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_cost INT,
    PRIMARY KEY (department_id)
)