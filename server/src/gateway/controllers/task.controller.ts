import { Request, Response } from "express";
import * as TaskOrchestrator from "../services/task.orchestrator";

const getParam = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;

export const getTaskDetails = async (req: Request, res: Response) => {
  const taskId = getParam(req.params.taskId);//this is model task id
  const userId = req.user.id;

  const data = await TaskOrchestrator.getTaskDetails(taskId, userId);
  res.json(data);
};

export const startTask = async (req: Request, res: Response) => {
  const taskId = getParam(req.params.taskId);
  const userId = req.user.id;
  //incomplete: no taskscore
  const submission = await TaskOrchestrator.startTask(taskId, userId);
  res.json(submission);
};

export const submitTask = async (req: Request, res: Response) => {
  const taskId = getParam(req.params.taskId);
  const userId = req.user.id;

  const result = await TaskOrchestrator.submitTaskEvidence(
    taskId,
    userId,
    req.body
  );

  res.json(result);
};
