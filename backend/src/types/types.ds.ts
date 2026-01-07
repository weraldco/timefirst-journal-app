// types.d.ts
import { User } from '@supabase/supabase-js'; // optional, for typing

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name?: string;
				[key: string]: any;
			};
		}
	}
}
