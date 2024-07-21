import mongoose, { Schema } from "mongoose";


interface IUser{
    name:string,
    email:string,
    password:string
}




const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        password: {
            type: String,
            required: true,
        },
      
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const UserModel = mongoose.model<IUser>("User", userSchema);


export default UserModel;
