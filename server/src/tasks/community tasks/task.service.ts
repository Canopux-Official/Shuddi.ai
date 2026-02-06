import { prisma } from "../../lib/prisma"
import { TaskStatus, TaskCompletionStatus } from "@prisma/client"





// Get Task by ID.

export interface GetTaskParams {
  communityTaskId: string
}

export const taskById = async ({ communityTaskId }: GetTaskParams) => {

  const communityTask = await prisma.communityTask.findUnique({
    where:   { id: communityTaskId },
    include: { task: true, registrations: true }
  })
  if (!communityTask) throw new Error("Community task not found")

  return {
    communityTaskId: communityTask.id,
    taskId:          communityTask.task.id,
    title:           communityTask.task.title,
    description:     communityTask.task.description,
    baseScore:       communityTask.task.baseScore,
    startAt:         communityTask.task.startAt?.toISOString(),
    endAt:           communityTask.task.endAt?.toISOString(),
    isActive:        communityTask.task.isActive,
    maxParticipants: communityTask.maxParticipants,
    registeredCount: communityTask.registrations.length
  }
}





// All Available Tasks.

export const availableTasks = async () => {

  const now = new Date()

  const tasks = await prisma.communityTask.findMany({
    where:   { task: { isActive: true, startAt: { lte: now }, endAt: { gte: now } }},
    include: { task: true },
    orderBy: { task: { startAt: "asc" } }
  })

  return {
    items: tasks.map(ct => ({
      communityTaskId: ct.id,
      taskId:          ct.task.id,
      title:           ct.task.title,
      description:     ct.task.description,
      startAt:         ct.task.startAt?.toISOString(),
      endAt:           ct.task.endAt?.toISOString(),
      maxParticipants: ct.maxParticipants
    }))
  }
}





// Register User for Task.

export interface RegisterTaskParams {
  taskId: string
  userId: string
}

// Update this function after ngo is added to the schema.
export const registerTask = async ({ taskId, userId }: RegisterTaskParams) => {

  return prisma.$transaction(async (tx) => {

    const now = new Date()

    // Fetch community task + parent task.
    const communityTask = await tx.communityTask.findUnique({
      where:   { id: taskId },
      include: { task: true }
    })

    if (!communityTask) throw new Error("Task not found")
    if (!communityTask.task.isActive) throw new Error("Task is not active")

    if (communityTask.task.startAt && now < communityTask.task.startAt)
      throw new Error("Task has not started yet")

    if (communityTask.task.endAt && now > communityTask.task.endAt)
      throw new Error("Task has expired")

    // Prevent duplicate registration.
    const existingRegistration = await tx.communityTaskRegistration.findUnique({
      where: { taskId_userId: { taskId, userId } }
    })
    if (existingRegistration) throw new Error("Already registered")

    // Participation count check.
    if (communityTask.maxParticipants !== null) {
      const registrationsCount = await tx.communityTaskRegistration.count({
        where: { taskId }
      })
      if (registrationsCount >= communityTask.maxParticipants) throw new Error("Task registration is full")
    }

    // Create Registration
    await tx.communityTaskRegistration.create({
      data: {
        taskId: taskId,
        userId: userId,
        status: TaskStatus.REGISTERED
      }
    })

    // Create TaskScore.
    const taskScore = await tx.taskScore.create({
      data: {
        userId:           userId,
        taskId:           communityTask.taskId,
        baseScore:        communityTask.task.baseScore,
        status:           TaskCompletionStatus.STARTED,
        performanceScore: 0
      }
    })

    return {
      taskScoreId: taskScore.id,
      status:      taskScore.status
    }
  })
}





// Get User’s Tasks.

export interface UserTasksParams {
  userId: string
}

export const userTasks = async ({ userId }: UserTasksParams) => {

  const taskScores = await prisma.taskScore.findMany({
    where:   { userId },
    include: { task: { include: { communityTask: true }}},
    orderBy: { createdAt: "desc" }
  })

  return taskScores.map(ts => ({
    taskId:           ts.task.id,
    communityTaskId:  ts.task.communityTask?.id,
    title:            ts.task.title,
    status:           ts.status,
    baseScore:        ts.baseScore,
    performanceScore: ts.performanceScore
  }))
}






//  ------------------------- Modifications to be done. (NGO - Related Functions)


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