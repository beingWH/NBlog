var User=require('../lib/mongo').User

UserModel={
    create:function create(user) {
        // return User.create(user).exec()
        return User.create(user).exec()

    },
    getUserByName:function getUserByName(name) {
        return User.findOne({name:name}).addCreatedAt().exec()
    }
}
module.exports=UserModel