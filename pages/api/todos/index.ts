import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const todos = await prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      return res.status(200).json(todos)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch todos' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { task } = req.body
      const todo = await prisma.todo.create({
        data: {
          task,
        },
      })
      return res.status(201).json(todo)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create todo' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 