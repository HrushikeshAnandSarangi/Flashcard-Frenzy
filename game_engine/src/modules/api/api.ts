import { Router, Request, Response } from 'express';
import { getGameResults, getGameResultByRoomId } from '../../config/database';

export const apiRouter = Router();

apiRouter.get('/results', async (req: Request, res: Response) => {
  try {
    const results = await getGameResults();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game results' });
  }
});

apiRouter.get('/results/:roomId', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const result = await getGameResultByRoomId(roomId);
    if (!result) {
      return res.status(404).json({ message: 'Game result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game result' });
  }
});