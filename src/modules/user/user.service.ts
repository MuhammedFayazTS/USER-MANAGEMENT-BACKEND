import db from "../../database/database";

export class UserService {
    public async findUserById(userId:number){
        const user = await db.User.scope('withoutPassword').findOne({
            where: {id: userId}
        })
console.log("user: ",user)
        return user || null;
    }
}