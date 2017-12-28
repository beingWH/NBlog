var User=require('../lib/mongo').User

UserModel={
    create:function create(user) {
        return User.create(user).exec()
    }
}
module.exports=UserModel