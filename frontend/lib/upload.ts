import { supabase } from './supabase';

const BUCKET = 'post-images';
const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadPostImage(
	file: File,
	userId: string
): Promise<string> {
	if (file.size > MAX_SIZE_MB * 1024 * 1024) {
		throw new Error(`Image must be less than ${MAX_SIZE_MB}MB`);
	}
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error('Invalid image type. Use JPEG, PNG, WebP, or GIF.');
	}

	const ext = file.name.split('.').pop() || 'jpg';
	const path = `${userId}/${Date.now()}.${ext}`;

	const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
		cacheControl: '3600',
		upsert: false,
	});

	if (error) {
		throw new Error(error.message || 'Upload failed');
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET).getPublicUrl(path);
	return publicUrl;
}
