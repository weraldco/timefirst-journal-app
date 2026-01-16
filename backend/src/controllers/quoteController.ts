import { Request, Response } from 'express';

export const quoteController = {
	getRandomQuote: async (req: Request, res: Response) => {
		try {
			const response = await fetch('https://api.quotify.top/random');

			if (!response.ok)
				return res.status(401).json({ error: 'Failed to fetch data' });

			const data = await response.json();
			return res.status(200).json(data);
		} catch (error) {
			return res.status(500).json({ error: 'Internal Error!' });
		}
	},
};
