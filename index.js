const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
var myApp = express();

myApp.use(bodyParser.urlencoded({ extended: false }));

myApp.use(bodyParser.json())

myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

myApp.get('/', function (req, res) {
    res.render('index');
});

myApp.post('/reciept', [
    check('name', 'Please enter the name').not().isEmpty(),
    check('phone').not().isEmpty().withMessage('Mobile is Empty').isMobilePhone().withMessage("Please Enter Correct Mobile No."),
    check('email').not().isEmpty().withMessage('Email is Empty').isEmail().withMessage("Please Enter Correct Email Address."),
    check('address', 'Please enter Address').not().isEmpty(),
    check('pin', 'Please enter Pin Code').not().isEmpty(),
    check('city', 'Please enter City').not().isEmpty(),
    check('p1').isNumeric().withMessage("Product 1 Should Be number ."),
    check('p2').isNumeric().withMessage("Product 2 Should Be number ."),
    check('p3').isNumeric().withMessage("Product 3 Should Be number ."),
    check('confirmProduct').custom((value, { req }) => {
        if (parseInt(req.body.p1) > 0 || parseInt(req.body.p2) > 0 || parseInt(req.body.p3) > 0) {
            return true;
        } else {
            throw new Error('Buy Atleast One Product');
        }

    })

], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorsData = {
            errors: errors.array()
        }
        res.render('index', { errorsData, receiptData: req.body });
    }
    else {
        var amt = 0;
        var delivery = req.body.delivery;
        if (delivery == 'Day1') {
            var d = 40
        }
        if (delivery == 'Day2') {
            var d = 30
        }
        if (delivery == 'Day3') {
            var d = 20
        }
        if (delivery == 'Day4') {
            var d = 10
        }


        var tax = 0;
        var province = req.body.prv;
        if (province == 'Alberta' || province == 'Manitoba') {
            tax = 14;
        } else if (province == 'Nunavut' || province == 'Ontario') {
            tax = 9;
        }
        else {
            tax = 5;
        }


        var subtotal = (parseInt(req.body.p1) * 10) + (parseInt(req.body.p2) * 5) + (parseInt(req.body.p3) * 15) + d;
        var taxamt = parseFloat(((subtotal) * (tax / 100)).toFixed(2));
        var totalamt = subtotal + taxamt;


        var receiptData = req.body
        receiptData['tax'] = taxamt;
        receiptData['total'] = totalamt;
        receiptData['subtotal'] = subtotal;
        res.render('index', { receiptData });
    }
});

myApp.listen(8080);
console.log('Server started at 8080 for mywebsite...');