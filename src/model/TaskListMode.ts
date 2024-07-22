import mongoose, { Schema } from "mongoose";

export interface ITask  {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITaskList {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    tasks: ITask[];
    deleted:boolean;
}

const taskSchema = new Schema<ITask>(
    {
        name: { type: String, required: true },
        description: String,
        
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const taskListSchema = new Schema<ITaskList>(
    {
        name: {
            type: String,
            required: true,
            
        },
        tasks:{
            type:[taskSchema],
            default:[]
        },
        deleted:{
            type:Boolean,
            default:false

        }
        
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

const TaskListModel = mongoose.model<ITaskList>("TaskList", taskListSchema);

export default TaskListModel;
