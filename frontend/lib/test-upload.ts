import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File) {
	// 1. Define a unique path (e.g., folder/filename)
	const fileExt = file.name.split('.').pop();
	const fileName = `${Math.random()}.${fileExt}`;
	const filePath = `user-uploads/${fileName}`;

	// 2. Upload the file to the 'images' bucket
	const { data, error } = await supabase.storage
		.from('post-images')
		.upload(filePath, file);

	if (error) {
		console.error('Upload failed:', error.message);
		return;
	}

	// 3. Get the Public URL to display it
	const {
		data: { publicUrl },
	} = supabase.storage.from('post-images').getPublicUrl(filePath);

	return publicUrl;
}
