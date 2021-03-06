
const controllers = require('../controllers')
const models = require('../models')

const https = require('https')

const path = require('path')
module.exports = (app) => {

    app.get('/api/sanpham/getAll', controllers.sanpham.getAll)
    app.get('/api/sanpham/getnsanpham', controllers.sanpham.getnsanpham)
    app.get('/api/sanpham/getinfor', controllers.sanpham.chitietsanpham)
    app.get('/api/tintuc/getntintuc', controllers.tintuc.getntintuc)
    app.get('/api/tintuc/getinfor', controllers.tintuc.getinfor)


    app.get('/api/duan/getinfor', controllers.duan.getinfor)
    app.get('/api/duan/getnduan', controllers.duan.getnduan)
    app.get('/kichhoat', controllers.user.kichhoat)
    app.get('/api/user/taoma', models.user.logined, controllers.user.taoma)
    app.get('/api/user/checkma', models.user.logined, controllers.user.checkma)
    app.get('/api/huyen', controllers.huyen.select)

    app.post('/api/sanpham/getbyuser', models.user.logined, controllers.sanpham.getbuyuser)
    app.post('/api/user/change_password', models.user.logined, controllers.user.thaymatkhau)
    app.post('/api/user/update', models.user.logined, models.user.checkemail, models.user.checksodienthoai, controllers.user.update)
    app.post('/api/user/getinfor', models.user.logined, controllers.user.getinfor)
    app.post('/api/user/dangki', models.user.checksingup, models.user.checksodienthoai, controllers.user.singup)
    app.post('/api/user/login', controllers.user.login)
    app.post('/api/sanpham/dangsanpham', models.user.logined, models.sanpham.check, controllers.sanpham.create)
    app.post('/api/sanpham/deletebyadmin', models.user.logined, models.user.checkadmin, controllers.sanpham.deletemany)
    app.post('/api/sanpham/delete', models.user.logined, models.sanpham.checkuser, controllers.sanpham.delete)
    app.post('/api/tintuc/taotintuc', models.user.logined, models.tintuc.check, controllers.tintuc.create)
    app.post('/api/tintuc/delete', models.user.logined, models.user.checkadmin, controllers.tintuc.delete)
    app.post('/api/duan/taoduan', models.user.logined, controllers.duan.create)
    app.post('/api/duan/delete', models.user.logined,models.user.checkadmin, controllers.duan.delete)
    app.post('/api/duan/deletebyadmin', models.user.logined, models.user.checkadmin, controllers.sanpham.deletebyadmin, controllers.duan.deletebyadmin)

    //momo
    app.get('/api/momo/result', controllers.momo.result)
    app.post('/api/momo/thanhtoan', models.user.logined, models.sanpham.checkthanhtoan, controllers.momo.thanhtoan);
    app.post('/api/momo/kiemtra', models.user.logined, models.sanpham.checkuser, controllers.momo.kiemtra)

    app.post('/api/checkadmin', models.user.logined, models.user.checkadmin, controllers.user.admin)
    app.post('/api/admin/user', models.user.logined, models.user.checkadmin, controllers.user.getAllUser)
    app.post('/api/admin/userauth', models.user.logined, models.user.checkadmin, controllers.user.reauth)
    app.post('/api/admin/deleteuser', models.user.logined, models.user.checkadmin, controllers.sanpham.deletebyuser, controllers.duan.deletebyuser, controllers.user.delete)

    app.get('/', (req, res) => {
        res.render('trangchu')
    })
    app.get('/chitiet', (req, res) => {
        res.render('chitiet')
    })
    app.get('/chitietbaiviet', (req, res) => {
        res.render('chitietbaiviet')
    })
    app.get('/dangtin', (req, res) => {
        res.render('dangraotin')
    })

    app.get('/muathue', (req, res) => {
        res.render('muathue')
    })
    app.get('/nhadatban', (req, res) => {
        res.render('nhadatban')
    })
    app.get('/nhadatthue', (req, res) => {
        res.render('nhadatthue')
    })
    app.get('/canmuathue', (req, res) => {
        res.render('canmuathue')
    })
    app.get('/duan', (req, res) => {
        res.render('duan')
    })
    app.get('/chitietduan', (req, res) => {
        res.render('chitietduan')
    })
    app.get('/user', (req, res) => {
        res.render('trangcanhan')
    })
    app.get('/admin', (req, res) => {
        res.render('admin')
    })

}