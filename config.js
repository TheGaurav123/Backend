const mongoose = require('mongoose')


// D A T A B A S E    C O N N E C T I O N



mongoose.connect(`${process.env.DB_URL}`,()=>console.log('Connected to DB...'))
