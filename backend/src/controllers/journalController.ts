import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler';
import { journalService } from '../services/journalService';

export const journalController = {
  // GET - Get all examples
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journalPosts = await journalService.getAll();
      res.status(200).json({
        success: true,
        data: journalPosts,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET - Get single example by id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({status:false,message:"missing ID parameter"})
     }
      const journalPosts = await journalService.getById(id);
      res.status(200).json({
        success: true,
        data: journalPosts,
      });
    } catch (error) {
      const apiError = error as Error;
      if (apiError.message === 'Jounal not found') {
        const notFoundError: ApiError = new Error('Journal not found');
        notFoundError.statusCode = 404;
        return next(notFoundError);
      }
      next(error);
    }
  },

  // POST - Create new example
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, mood, tags, userId } = req.body;

      const journalPost = await journalService.create({ title, content, mood, tags, userId });
      res.status(201).json({
        success: true,
        data: journalPost,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT - Update example
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({status:false,message:"missing ID parameter"})
     }
     const { title, content, mood, tags, userId } = req.body;
    
      const journalPost = await journalService.update(id, { title, content, mood, tags, userId });
      res.status(200).json({
        success: true,
        data: journalPost,
      });
    } catch (error) {
      const apiError = error as Error;
      if (apiError.message === 'Journal not found') {
        const notFoundError: ApiError = new Error('Journal not found');
        notFoundError.statusCode = 404;
        return next(notFoundError);
      }
      next(error);
    }
  },

  // DELETE - Delete example
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({status:false, message:"missing ID parameter"})
     }
      await journalService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Journal deleted successfully',
      });
    } catch (error) {
      const apiError = error as Error;
      if (apiError.message === 'Journal not found') {
        const notFoundError: ApiError = new Error('Journal not found');
        notFoundError.statusCode = 404;
        return next(notFoundError);
      }
      next(error);
    }
  },
};

