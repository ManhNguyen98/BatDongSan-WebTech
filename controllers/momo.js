
const crypto = require('crypto');
const https = require('https')
const models = require('../models')
function kiemtra(request, response) {
    var partnerCode = "MOMOXSGV20190424"
    var accessKey = "mxX5K6WV2FRZxUUs"
    var serectkey = "mI7NugXjCv1egAg73vDKMBRqRt9lTsBi"
    var orderId = request.query.id_sanpham
    var requestId = request.query.id_sanpham
    var requestType = 'transactionStatus'
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&orderId=" + orderId + "&requestType=" + requestType
    var signature = crypto.createHmac('sha256', serectkey)
        .update(rawSignature)
        .digest('hex');
    var body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        orderId: orderId,
        requestType: requestType,
        signature: signature,
    })
    var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    console.log("Sending....")

    var req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        let d = ''
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            d = d + body;
            // console.log(body + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>" + d)
            // // let r=JSON.parse(body.replace(/\n/g,''))
            if (d[d.length - 1] == '}') {
                d = JSON.parse(d)
                response.json({
                    code: 1000,
                    data: {
                        errorCode: d.errorCode,
                        id_sanpham: d.orderId,
                        massage: d.message
                    }
                })
                if (d.errorCode == 0) {
                    models.sanpham.update({
                        trangthai: "Yes"
                    }, {
                            where: {
                                id: d.orderId,
                                trangthai: "No"
                            }
                        })
                }
            }
        });
        res.on('end', () => {
            console.log('No more data in response.');

        });
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(body);
    req.end();
}
module.exports = {
    async thanhtoan(request, response) {
        console.log(request.query)
        var partnerCode = "MOMOXSGV20190424"
        var accessKey = "mxX5K6WV2FRZxUUs"
        var serectkey = "mI7NugXjCv1egAg73vDKMBRqRt9lTsBi"
        var orderInfo = "pay with MoMo"
        var returnUrl = "http://localhost:1000/api/momo/result"
        var notifyurl = "http://localhost:1000/api/momo/result1"
        var amount = "1000"
        var orderId = request.query.id_sanpham
        var requestId = request.query.id_sanpham
        var requestType = "captureMoMoWallet"
        var extraData = "merchantName=;merchantId="
        var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
        var signature = crypto.createHmac('sha256', serectkey)
            .update(rawSignature)
            .digest('hex');
        var body = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            returnUrl: returnUrl,
            notifyUrl: notifyurl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
        })
        var options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/gw_payment/transactionProcessor',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };
        console.log("Sending....")
        var req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            let d = '';
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                d = d + body;
                // console.log(body + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>" + d)
                // // let r=JSON.parse(body.replace(/\n/g,''))
                if (d[d.length - 1] == '}') {
                    d=JSON.parse(d)
                    if(d.errorCode==0){
                        response.json({
                            code:1000,
                            data:{
                                url:d.payUrl
                            }
                        })
                    }else{
                        response.json({
                            code:1111,
                            data:{
                                errorCode:d.errorCode,
                                message:d.message
                            }
                        })
                    }
                }



            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        req.write(body);
        req.end();
    },
    async kiemtra(request, response) {
       await kiemtra(request,response)
    },
    async result(req, res) {
        // console.log(req)
        if (req.query.orderId) {
            if (req.query.errorCode == 0) {
                //update trang thai
                req.query.id_sanpham = req.query.orderId
                await kiemtra(req, res);
            }else{
                res.json({
                    code:9999,
                    data:{
                        error:req.query.errorCode,
                        message:req.query.message
                    }
                })
            }
        }
    }
}