var fs = require('fs');
var csv = require('fast-csv');

const pool = require('./pgdb');
const express = require('express');

const router = express.Router();
console.log("Program is running!");

pool.connect(function(err){
    if(err)
    {
        console.log(err);
    }
    else{
     console.log("db connected");
     
    }
});

router.get('/upload', (req, res) => {
    console.log("Inside Post Request");
    let counter = 0; 

    let csvStream = csv.parseFile(".\\5m Sales Records.csv", { headers: ['Region', 'Country','ItemType','SalesChannel',
    'OrderPriority','OrderDate','OrderID','ShipDate','UnitsSold','UnitPrice','UnitCost','TotalRevenue','TotalCost','TotalProfit'], renameHeaders: true })
        .on("data", function(record){
            csvStream.pause();
              console.log("inside csvStream");
            if(counter <= 100) // only 100 records to be saved.
            {
                let Region = record.Region;
                let Country = record.Country;
                let ItemType = record.ItemType;
                let SalesChannel = record.SalesChannel;
                let OrderPriority = record.OrderPriority;
                let OrderDate = record.OrderDate;
                let OrderID = record.OrderID;
                let ShipDate = record.ShipDate;
                let UnitsSold = record.UnitsSold;
                let UnitPrice = record.UnitPrice;
                let UnitCost = record.UnitCost;
                let TotalRevenue = record.TotalRevenue;
                let TotalCost = record.TotalCost;
                let TotalProfit = record.TotalProfit;
                
                pool.query("INSERT INTO sales(region, country, item_type, sales_channel, order_priority, order_date, order_id, ship_date, units_sold, unit_price, unit_cost, total_revenue, total_cost, total_profit) \
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", [Region, Country, ItemType, SalesChannel, OrderPriority, OrderDate, OrderID, ShipDate, UnitsSold, UnitPrice, UnitCost, TotalRevenue, TotalCost, TotalProfit], function(err){    
                if(err)
                    {
                        console.log("Insert Error:",err);
                    }
                });
                ++counter;
                csvStream.resume();
            }
    if(counter==100){
        csvStream.pause();
    }
        }).on("end", function(){
            res.send("Congrats! Data Stored Successfully.");
        }).on("error", function(err){
            console.log(err);
            res.send("Error Occured!");
        }); 
});
    module.exports = router;