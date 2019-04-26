const models = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = {

    //get thong tin co ban n tin tuc
    async getntintuc(req, res) {
        let id = 100000000;
        req.body.id ? id = req.body.id : id = id
        let result = await models.tintuc.findAll({
            where: {
                id: {
                    [Op.lt]: id
                }
            },
            attributes: ['id', 'ten', 'image', 'id_loaitin'],
            order: [['id', 'DESC']],
            limit: 10
        })
        res.json(result)
    },
    // lay thong tin chi tiet 1 tim tuc
    async getinfor(req, res) {
        models.tintuc.findAll({
            where: {
                id: req.params.id_tin
            }
        }).then(re => {

            re[0] ? res.json({ code: 1000, data: re[0] }) : res.json({ code: 1111, message: "not found" })
        })

    },
    //tao 1 tin tuc(chi dnah cho doi ngu admin
    async create(req, res) {
        models.tintuc.create({
            ten: req.body.ten,
            noidung: req.body.noidung,
            id_loaitin: req.body.id_loaitin,
            image: req.body.image
        }).then(re => {
            res.json(re)
        }).catch(err => {
            console.log(err)
            res.json({
                mes: 'loi'
            })
        })
    },
    async delete(req, res) {
        let result = await models.tintuc.findAll({
            where: {
                id: req.body.id_tin,

            }
        })
        console.log(result)
        if (result[0]) {
            result[0].destroy(err => {

            })
            res.json({
                code: 1000,
                message: "ok"
            })
        } else res.json({
            code: 1111,
            message: "khong tim thay "
        })
    }
}