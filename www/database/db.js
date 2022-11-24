let server = require('../rest/server');
let dataAPI;

const startDB = (app)=>{
    switch(process.env.DATABASE){
        case "mysql":
            //Import the sequelize module
            const { Sequelize } = require('sequelize');

            const dbConfig = require("../../config/dbConfig.json")[process.env.NODE_ENV];

            dataAPI = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
            try{
                dataAPI.authenticate()
                .then(()=>{
                    console.log(`Database Connection open Success : ${JSON.stringify(dbConfig.host)}`);
                    module.exports.dataAPI = dataAPI;
                    server.startServer(app);
                });
            }catch(err){
                console.log(`Database Connection Open Error : ${err}`);
            }

            break;
        // case "mongo":
        //     //Import the mongoose module
        //     const mongoose = require('mongoose');
        //     //Set up default mongoose connection
        //     const mongoDB = process.env.DB_URL;
        //     mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
        //     //Get the default connection
        //     dataAPI = mongoose.connection;
                
        //     //Bind connection to error event (to get notification of connection errors)
        //     dataAPI.on('error', ()=>{
        //             console.error.bind(console, 'MongoDB connection error:');
        //         });
        //     dataAPI.on('connected', ()=>{
        //             //console.log(db.readyState);
        //             console.log('MongoDB Connected');
        //             /* Start http Server*/
        //             server.startServer(app);
        //  });
            
        // break;
        default:
            //default server
            console.log('No Database Connected,webserver starting!');
            server.startServer(app);

    }
}

module.exports = {
    startDB:startDB
}