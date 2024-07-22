import mongoose from "mongoose";

import TaskListModel, { ITask } from "../model/TaskListMode";
import { BadRequestError } from "../errors/bad-request-error";

class TaskListRepsitory {
    async create(name: string) {
        const list = await TaskListModel.create({name});
        return await list.save();
    }
    async addTask(listId: string, task: ITask) {
        return await TaskListModel.findOneAndUpdate(
            { _id: listId },
            { $push: { tasks: task } },
            { new: true }
        );
    }

    async deleteTask({ taskId, listId }: { taskId: string; listId: string }) {
        // Remove the Task from the Source List
        await TaskListModel.updateOne(
            { _id: listId },
            { $pull: { tasks: { _id: taskId } } }
        );
    }

    async deleteTaskList(listId: string){
        return await TaskListModel.findOneAndUpdate({_id:listId},{$set:{deleted:true}});

    }

    async getTaskListes(){
        return await TaskListModel.find();
    }

    async transferTask({
        taskId,
        sourceListId,
        targetListId,
    }: {
        taskId: string;
        sourceListId: string;
        targetListId: string;
    }) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find and Extract the Task from the Source List
            const sourceList = await TaskListModel.findOne(
                { _id: sourceListId, "tasks._id": taskId },
                { tasks: { $elemMatch: { _id: taskId } } } // Project the specific task
            ).session(session);

            if (!sourceList) {
                throw new BadRequestError(
                    `Source list with ID ${sourceListId} not found`
                );
            }

            const task = sourceList.tasks[0];
            if (!task) {
                throw new BadRequestError(
                    `Task with ID ${taskId} not found in source list`
                );
            }

            // Remove the Task from the Source List
            await TaskListModel.updateOne(
                { _id: sourceListId },
                { $pull: { tasks: { _id: taskId } } },
                { session }
            );

            //Add the Task to the Target List
            await TaskListModel.updateOne(
                { _id: targetListId },
                { $push: { tasks: task } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

export default new TaskListRepsitory();
