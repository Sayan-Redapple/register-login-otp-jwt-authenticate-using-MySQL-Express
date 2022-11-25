const passwordLib = require("../libs/passwordLib");
const response = require("../libs/responseLib");
const tokenLib = require("../libs/tokenLib");
const jwt = require("jsonwebtoken");


let register = async (req, res) => {
  try {

    let { dataAPI } = require("../../www/database/db");
    if (
      !req.body.full_name ||
      !req.body.mobile_no ||
      !req.body.email_id ||
      !req.body.password
    ) {
      res.status(412).send("There are some Information Missing");
    }

    let checkExist = await dataAPI.query(
      `SELECT* FROM tbl_register_details WHERE mobile_no = "${req.body.mobile_no}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );

    if (checkExist.length > 0) {
      res.status(200).send("Mobile Number already Exist");
    } else {
      const hash = await passwordLib.hash(req.body.password);

      let createUser = await dataAPI.query(
        `INSERT INTO tbl_register_details (full_name, mobile_no, email_id, password) VALUES ("${req.body.full_name}", "${req.body.mobile_no}", "${req.body.email_id}", "${hash}")`
      );let { dataAPI } = require("../../www/database/db");
      pullData1 = pullData[0];

      res.status(412).send({
        Status: "0",
        ...pullData1,
        Message:
          "Congratulation !! You have been Successfully Registered !! Welcome",
      });
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

let login = async (req, res) => {
  try {

    let { dataAPI } = require("../../www/database/db");
    if (!req.body.mobile_no || !req.body.password) {
      res.status(412).send("Some Feild Missing");
    }

    let checkExistData = await dataAPI.query(
      `SELECT* FROM tbl_register_details WHERE mobile_no = "${req.body.mobile_no}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );

    if (checkExistData.length <= 0) {
      res.status(200).send("Mobile No not Found");
    } else {
      let verify = await passwordLib.verify(
        req.body.password,
        checkExistData[0]["password"]
      );
      if (verify == true) {
        res
          .status(200)
          .send("Login Successful !! Please Authenticate With OTP");
      } else {
        res.status(200).send("Login Failed, Please Try Again");
      }
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

let generatedOTP = async (req, res) => {
  try {

    let { dataAPI } = require("../../www/database/db");
    if (!req.body.mobile_no) {
      res.status(412).send("Please Provide the Mobile Number");
    }

    let checkExist = await dataAPI.query(
      `SELECT* FROM tbl_register_details WHERE mobile_no = "${req.body.mobile_no}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );
    if (checkExist.length > 0) {
      let fetchOTP = generateOTP();

      let insertOTP = await dataAPI.query(
        `INSERT INTO tbl_otp_details
        (mobile_no, otp, expire_date) VALUES("${req.body.mobile_no}", "${fetchOTP}", NOW() + INTERVAL 2 MINUTE)`
      );

      console.log(insertOTP);

      let fetchData = await dataAPI.query(
        `SELECT expire_date FROM tbl_otp_details WHERE mobile_no = "${req.body.mobile_no}" `,
        { type: dataAPI.QueryTypes.SELECT }
      );

      let otpDATA = fetchData[0];

      res.status(412).send({
        mobile_no: req.body.mobile_no,
        otp: fetchOTP,
        ...otpDATA,
        Message: "OTP Generated Above",
      });
    } else {
      return res.send({
        status_code: "1",
        message: "something is wrong",
      });
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

let otpLogin = async (req, res) => {
  try {

    let { dataAPI } = require("../../www/database/db");
    if (!req.body.mobile_no || !req.body.otp) {
      res.status(412).send("Some Feild Missing");
    }

    let checkEXIST = await dataAPI.query(
      `SELECT* FROM tbl_otp_details WHERE mobile_no = "${req.body.mobile_no}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );

    if (checkEXIST.length <= 0) {
      res.status(200).send("Mobile Number Not Found");
    } else {
      let selectOTP = await dataAPI.query(
        `SELECT otp FROM tbl_otp_details WHERE mobile_no = "${req.body.mobile_no}" ORDER BY id DESC LIMIT 1`,
        { type: dataAPI.QueryTypes.SELECT }
      );

      if (selectOTP[0].otp == req.body.otp) {
        getData = await dataAPI.query(
          `SELECT full_name, email_id FROM  tbl_register_details WHERE mobile_no = "${req.body.mobile_no}" `,
          { type: dataAPI.QueryTypes.SELECT }
        );
        const token = await tokenLib.generateToken(req.body.mobile_no);
        const email = await tokenLib.verifyClaimWithoutSecret(token);

        let insertData = await dataAPI.query(
          `INSERT INTO tbl_login_details (mobile_no, token_generated) VALUES("${req.body.mobile_no}", "${token}")`
        );
        console.log(insertData);

        dataFetch = getData[0];

        return res.status(200).send({
          ...dataFetch,
          message: "Logged IN! Welcome !!",
          token: token,
          ...email,
        });
      } else {
        return res.status(401).send({
          message: "OTP is Invalid",
        });
      }
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

let loginAllDetails = async (req, res) => {
  try {
    let { dataAPI } = require("../../www/database/db");

    let allData = await dataAPI.query(
      `SELECT mobile_no, login_time FROM tbl_login_details ORDER BY login_time ASC`,  {type: dataAPI.QueryTypes.SELECT }
    );
    res.status(412).send({
      messgae: "Success",
     data : allData,
    });
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

module.exports = {
  register: register,
  login: login,
  generatedOTP: generatedOTP,
  otpLogin: otpLogin,
  loginAllDetails : loginAllDetails
};
