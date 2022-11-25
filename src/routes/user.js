const userController = require ('../controllers/userControllers')

let setRouter = (app) => {

    let baseUrl = `${process.env.BASEURL}`;

    app.post(`${baseUrl}/register`,userController.register);

    app.post(`${baseUrl}/login`,userController.login);

    app.post(`${baseUrl}/generatedOTP`,userController.generatedOTP);

    app.post(`${baseUrl}/otpLogin`,userController.otpLogin);

    app.post(`${baseUrl}/loginAllDetails`,userController.loginAllDetails);
}


module.exports = {
    setRouter:setRouter
}

