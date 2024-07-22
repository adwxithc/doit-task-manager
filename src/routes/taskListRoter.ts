import { Router } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validateRequest";
import {taskListController} from "../controller/TaskListController";

export function authRouter(router: Router) {
    router.post(
        "/create",
        [
            body("name").notEmpty().withMessage("name is required"),
        ],
        validateRequest,
        taskListController.create
    );

    router.patch(
        "/add-task",
        [
            body("name").notEmpty().withMessage("name is required"),
            body("listId").notEmpty().withMessage("listId is required"),
            
        ],
        validateRequest,
        taskListController.addNewTask
    );

    router.patch(
        "/delete-task",
        [
            body("taskId").notEmpty().withMessage("taskId is required"),
            body("listId").notEmpty().withMessage("listId is required"),
            
        ],
        validateRequest,
        taskListController.deleteTask
    );

    router.patch(
        "/delete-task-list",
        [
            body("listId").notEmpty().withMessage("listId is required"),
        ],
        validateRequest,
        taskListController.deleteTaskList
    );

    router.patch(
        "/transfer-task",
        [
            body("taskId").notEmpty().withMessage("listId is required"),
            body("sourceListId").notEmpty().withMessage("sourceListId is required"),
            body("targetListId").notEmpty().withMessage("targetListId is required"),
        ],
        validateRequest,
        taskListController.transferTask
    );

    router.get(
        "/task-list",
        taskListController.transferTask
    );

   
    return router;
}
