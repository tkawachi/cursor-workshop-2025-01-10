import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await prisma.todo.delete({
        where: {
          id: String(id),
        },
      })
      return res.status(200).json({ message: 'Todo deleted successfully' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete todo' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 