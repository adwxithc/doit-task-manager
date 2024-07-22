import taskListRepository from "../repository/taskListRepository";
import { Req, Res } from "../types/expressTypes";

class TaskListController {
    async create(req: Req, res: Res) {
        const { name } = req.body as {name:string};
        const newList = await taskListRepository.create(name);
        res.json({
            success:true,
            data:newList,
            message:"new TaskList created"
        });
    }

    async addNewTask(req: Req, res: Res){
        const {name, description, listId} = req.body as {name:string, description:string, listId:string};
        const list = await taskListRepository.addTask(listId,{name, description});
        res.json({
            success:true,
            data:list,
            message:"new task added to list"
        });
    }

    async deleteTask(req: Req, res: Res){
        const {taskId, listId} = req.body as {taskId:string, listId:string};
        const list = await taskListRepository.deleteTask({taskId, listId});
        res.json({
            success:true,
            data:list,
            message:"deleted task from  list"
        });
    }

    async deleteTaskList(req: Req, res: Res){
        const {listId} = req.body as {listId:string};
        const list = await taskListRepository.deleteTaskList(listId);
        res.json({
            success:true,
            data:list,
            message:"deleted taskList"
        });
    }

    async transferTask(req: Req, res: Res){
        const {taskId, sourceListId, targetListId} = req.body as {taskId:string, sourceListId:string, targetListId:string};
        const list = await taskListRepository.transferTask({taskId,sourceListId, targetListId});
        res.json({
            success:true,
            data:list,
            message:"new task added to list"
        });
    }

    async getTakLists(req: Req, res: Res){
        const taskLists = await taskListRepository.getTaskListes();
        res.json({
            success:true,
            data:taskLists,
        });
    }
}

export const taskListController = new TaskListController();
