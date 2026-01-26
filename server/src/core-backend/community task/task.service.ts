import { prisma } from "../../lib/prisma"
import { TaskStatus } from "@prisma/client"





// Create Task -> NGO's Supervisor Work.

export interface CreateTaskParams {
  ngoId:            string
  title:            string
  description:      string
  startAt:          Date
  endAt:            Date
  maxParticipants?: number
  minParticipants?: number
}

export const createTask = async ({ ngoId, title, description, startAt, endAt, maxParticipants, minParticipants }: CreateTaskParams) => {

  if (!title.trim())       throw new Error("Task title cannot be empty")
  if (startAt >= endAt)    throw new Error("Invalid time range for task")
  if (!description.trim()) throw new Error("Task description cannot be empty")

  if (maxParticipants !== undefined && minParticipants !== undefined && minParticipants > maxParticipants) 
    throw new Error("Min participants cannot exceed max participants")
  

  const task = await prisma.communityTask.create({
    data: {
      ngoId:           ngoId,
      title:           title.trim(),
      description:     description.trim(),
      startAt:         startAt,
      endAt:           endAt,
      maxParticipants: maxParticipants,
      minParticipants: minParticipants,
    }
  })

  return {
    id:        task.id, 
    createdAt: task.createdAt.toISOString()
  }
}





// Get Task by ID.

export interface GetTaskParams {
  taskId: string
}

export const taskById = async ({ taskId }: GetTaskParams) => {

  const task = await prisma.communityTask.findUnique({
    where: { id: taskId }, include: { ngo: true, registrations: true }
  })

  if (!task) throw new Error("Community task not found")

  return {
    id:              task.id,
    title:           task.title,
    description:     task.description,
    startAt:         task.startAt.toISOString(),
    endAt:           task.endAt.toISOString(),
    maxParticipants: task.maxParticipants,
    registeredCount: task.registrations.length,
    isActive:        task.isActive
  }
}





// All Available Tasks.

export const availableTasks = async () => {

  const now = new Date()

  const tasks = await prisma.communityTask.findMany({
    where:   { isActive: true, startAt: { lte: now }, endAt: { gte: now } },
    orderBy: { startAt: "asc" },
    include: { ngo: true }
  })

  return {
    items: tasks.map(task => ({
      id:      task.id,
      title:   task.title,
      ngoName: task.ngo.name,
      startAt: task.startAt.toISOString(),
      endAt:   task.endAt.toISOString()
    }))
  }
}





// Register User for Task.

export interface RegisterTaskParams {
  taskId: string
  userId: string
}

export const registerTask = async ({ taskId, userId }: RegisterTaskParams) => {

  return prisma.$transaction(async (tx) => {

    const task = await tx.communityTask.findUnique({
      where: { id: taskId }
    })

    if (!task)          throw new Error("Task not found")
    if (!task.isActive) throw new Error("Task is not active")

    const count = await tx.communityTaskRegistration.count({
      where: { taskId }
    })

    if (task.maxParticipants !== null && count >= task.maxParticipants) throw new Error("Task registration is full")
    
    const existing = await tx.communityTaskRegistration.findUnique({
      where: { taskId_userId: { taskId, userId } }
    })
    if (existing) throw new Error("Already registered")

    const registration = await tx.communityTaskRegistration.create({
      data: {
        taskId: taskId,
        userId: userId,
        status: TaskStatus.REGISTERED
      }
    })

    return {
      id:        registration.id,
      status:    registration.status,
      createdAt: registration.createdAt.toISOString()
    }
  })
}





// Get User’s Tasks.

export interface UserTasksParams {
  userId: string
}

export const userTasks = async ({ userId }: UserTasksParams) => {

  const registrations = await prisma.communityTaskRegistration.findMany({
    where: { userId }, include: { task: true }, orderBy: { createdAt: "desc" }
  })

  return registrations.map(t => ({
    taskId:    t.taskId,
    title:     t.task.title,
    status:    t.status,
    createdAt: t.createdAt.toISOString()
  }))
}





// Task is Approved.

export interface ApproveTaskParams {
  taskId:          string
  supervisorNote?: string
}

export const taskApproval = async ({ taskId, supervisorNote }: ApproveTaskParams) => {

  await prisma.$transaction(async (tx) => {

    const task = await tx.communityTask.findUnique({
      where: { id: taskId }
    })
    if (!task) throw new Error("Task not found")

    if (new Date() < task.endAt) throw new Error("Task is still ongoing. Cannot approve now.")

    if (!task.isActive) throw new Error("Task already closed")
    
    await tx.communityTask.update({
      where: { id: taskId },
      data:  { isActive: false }
    })

    await tx.communityTaskRegistration.updateMany({
      where: {
        taskId,
        status: { in: [TaskStatus.REGISTERED, TaskStatus.SUBMITTED, TaskStatus.UNDER_VERIFICATION] }
      },
      data: {
        completionConfirmed: true,
        status:              TaskStatus.COMPLETED,
        supervisorNote:      supervisorNote,
        reviewedAt:          new Date()
      }
    })
  })
}





// Task is Rejected.

export interface RejectTaskParams {
  taskId:         string
  supervisorNote: string
}

export const taskRejection = async ({ taskId, supervisorNote }: RejectTaskParams) => {

  if (!supervisorNote.trim()) throw new Error("Rejection reason is required")

  await prisma.$transaction(async (tx) => {

    const task = await tx.communityTask.findUnique({
      where: { id: taskId }
    })
    if (!task) throw new Error("Task not found")

    if (new Date() < task.endAt) throw new Error("Task is still ongoing. Cannot reject now.")

    if (!task.isActive) throw new Error("Task already closed")

    await tx.communityTask.update({
      where: { id: taskId },
      data:  { isActive: false }
    })

    await tx.communityTaskRegistration.updateMany({
      where: { taskId },
      data: {
        completionConfirmed: false,
        status:              TaskStatus.REJECTED,
        supervisorNote:      supervisorNote,
        reviewedAt:          new Date()
      }
    })
  })
}





// Task is Under Verification.

export const taskVerification = async (taskId: string) => {

  const task = await prisma.communityTask.findUnique({
    where: { id: taskId }
  })
  if (!task) throw new Error("Task not found")

  if (new Date() < task.endAt) throw new Error("Task is still ongoing")

  await prisma.communityTaskRegistration.updateMany({
    where: { taskId, status: TaskStatus.SUBMITTED },
    data:  { status: TaskStatus.UNDER_VERIFICATION }
  })
}