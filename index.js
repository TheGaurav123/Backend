require('dotenv').config()
const admin_Info = require("./Models/adminInfoSchema");
const admin_Reg = require("./Models/signupSchema");
const student = require("./Models/studentSchema");
const express = require("express");
const app = express();
const cors = require("cors");
const { request } = require("express");
const bcrypt = require("bcryptjs");
require("./config");

// CORS
app.use(
  cors({
    origin: '*'
  })
);

app.use(express.json());

// A D M I N   R E G I S T R A T I O N

app.post("/register", async (req, res) => {
  // Employee ID Search
  let empID = req.body.Employee_ID;

  let empInfo = await admin_Info
    .findOne({
      employee_ID: empID,
    })
    .select("-_id")
    .select("-admin_Post")
    .select("-__v");

  if (empInfo) {
    // Already registration check
    let checkUser = await admin_Reg.findOne({
      $or: [{ Employee_ID: empID }, { Email: req.body.Email }],
    });

    if (checkUser) {
      res.send({ result: "User Already Exist" });
    } else {
      // Pass Encryption
      const encryptPass = async (pass) => {
        return await bcrypt.hash(pass, 10);
      };

      let result = await admin_Reg({
        Employee_ID: empID,
        Admin_Name: empInfo.admin_Name,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Password: await encryptPass(req.body.Password),
        Confirm_Password: undefined,
      });
      result = await result.save();
      res.send({ result: "User Doesn't Exist" });
    }
  } else {
    res.send({ result: "Employee ID not found" });
  }
});



// L O G I N   A P I

app.post("/login", async (req, res) => {
  let userPass = req.body.Password;

  let checkUser = await admin_Reg.findOne({
    Email: req.body.Email,
  });


  if (checkUser) {
    // Encryption Pass With Hash
    const isMatched = await bcrypt.compare(userPass, checkUser.Password)

    if (isMatched) {
      res.send({ result: checkUser.Admin_Name });
    }
    else{
      res.send({result: "User not found..."})
    }
  } else {
    res.send({ result: "User not found..." });
  }
});

// S T U D E N T   R E G I S T R A T I O N    A P I

app.post("/streg", async (req, res) => {
  let checkStudent = await student.findOne({ Aadhaar: req.body.Aadhaar });

  if (checkStudent) {
    res.send({ result: "Student Already Exist !" });
  } else {
    let insertData = await student(req.body);
    insertData = await insertData.save();
    res.send({ result: "Student Not Found..." });
  }
});

// S T U D E N T   D A T A   G E T

app.get("/getstudent", async (req, res) => {
  let result = await student.find().select("-_id").select("-__v");

  if (result) {
    res.send({ result: result });
  } else {
    res.send({ result: "No Data Found..." });
  }
});

// S T U D E N T   S E A R C H

app.get("/search/:id", async (req, res) => {
  let requestID = req.params.id;

  if (requestID) {
    let result = await student
      .findOne({
        Aadhaar: requestID,
      })
      .select("-__v")
      .select("-_id");

    if (result) {
      res.send({ result: result });
    } else {
      res.send({ result: "Student Not Found..." });
    }
  }
});

// D E L E T E   S T U D E N T   D A T A
app.delete("/delete/:id", async (req, res) => {
  let requestID = req.params.id;

  if (requestID) {
    let checkExistence = await student.findOne({
      Aadhaar: requestID,
    });

    if (checkExistence) {
      let result = await student.deleteOne({
        Aadhaar: requestID,
      });
      res.send({ result: "Data Deleted Successfully..." });
    } else {
      res.send({ result: "Something went wrong..." });
    }
  } else {
    res.send({ result: "Something went wrong..." });
  }
});

// S T U D E N T   D A T A   U P D A T I O N   S E A R C H

app.get("/update/:id", async (req, res) => {
  let requestID = req.params.id;
  if (requestID) {
    let result = await student
      .findOne({
        Aadhaar: requestID,
      })
      .select("-_id")
      .select("-__v");

    if (result) {
      res.send({ result: result });
    } else {
      res.send({ result: "Student Not Found..." });
    }
  } else {
    res.send("Request ID not found...");
  }
});

// S T U D E N T   D A T A    U P D A T I O N

app.put("/update/:id", async (req, res) => {
  let requestID = req.params.id;

  if (requestID) {
    let findStudent = await student.findOne({
      Aadhaar: requestID,
    });

    if (findStudent) {
      let result = await student.updateOne(
        { Aadhaar: requestID },
        { $set: req.body }
      );
      if (result) {
        res.send({ result: "Data Updated Successfully..." });
      } else {
        res.send({ result: "Something went wrong..." });
      }
    } else {
      res.send("Student Doesnot Exist");
    }
  }
});

app.listen(5000, () => {
  console.log("Connected...");
});
