import {Request, Response, NextFunction, Router, Express} from "express";

// export  req,res and next object types to the adapter layer(controll)

export type Req=Request 
export type Res=Response
export type Next= NextFunction

export type serverPackage= Express
export type Route = Router
