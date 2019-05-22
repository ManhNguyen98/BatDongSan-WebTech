const Express = require('express');
const app = Express();
const models = require('./models');
const bodyParser = require('body-parser')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const path = require('path')
const schedule = require('node-schedule')
const fs = require('fs-extra')

var busboy = require('connect-busboy');

//clould
var cloudinary = require('cloudinary');


cloudinary.config({
    cloud_name: 'dunguyen',
    api_key: '384762415366912',
    api_secret: 'BqcHoIOoc0f9SrNfbauhN3hIj4k'
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(Express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.use(Express.static(__dirname + '/public'));
app.use(busboy());
schedule.scheduleJob({ hour: 0, minute: 0, second: 10 }, () => {
    models.sanpham.findAll({
        where: {

            [Op.or]: [
                {
                    trangthai: "Yes",
                    createdAt: {
                        [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000 * 30)
                    }
                }, {
                    trangthai: "No",
                }
            ]
        }
    }).then(re => {
        re.map(x => x.destroy())
    })

})


models.sequelize.sync().then(() => {
    console.log("fine")
}).catch((err) => {
    console.log(err)
})

app.post('/upload', models.user.logined, function (req, res) {

    var fstream;
    req.pipe(req.busboy);
    console.log(req)
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + file._readableState);
        if (filename) {
            
                fstream = fs.createWriteStream(__dirname + '/public/' + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    cloudinary.v2.uploader.upload(__dirname + '/public/' + filename,
                        function (error, result) {
                                fs.unlink(__dirname + '/public/' + filename)
                            console.log(result)
                            if (error)
                                res.json({ code: 9999, message: "loi ket noi server" })
                            else res.json(result.secure_url ? result.secure_url : "")
                            console.log(result, error)

                        });
                });
           
        } else {
            res.send("loi")
            console.log("loi")
        }

    });

});

require('./routes')(app);



app.listen( process.env.PORT || 1000, () => {
    console.log("server is starting at 1000 ")
})

module.exports = app
