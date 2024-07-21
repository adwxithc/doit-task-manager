import UserModel from "../model/UserMode";
import { IUser } from "../types/data";

class UserRepsitory {
    async findByEmail(email: string) {
        return await UserModel.findOne({ email });
    }

    async createUser(newUser: IUser) {
        const user = await UserModel.create(newUser);
        return await user.save();
    }
}

export default new UserRepsitory();
