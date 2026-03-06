'use client'; // Required if using Next.js App Router
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/test-upload';
import Image from 'next/image';
import { useState } from 'react';

const Page = () => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const { data } = supabase.storage
		.from('post-images')
		.getPublicUrl('user-uploads/0.9467643872620758.jpeg');
	// 1. Capture the file when the input changes
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	// 2. Upload the captured file when the button is clicked
	const handleUpload = async () => {
		if (!file) return alert('Please select a file first!');

		setUploading(true);
		try {
			const url = await uploadImage(file);
			alert(`Upload successful! URL: ${url}`);
		} catch (error) {
			alert('Upload failed');
		} finally {
			setUploading(false);
		}
	};
	console.log(data.publicUrl);
	return (
		<div className="p-4 flex flex-col gap-4">
			<input
				type="file"
				id="imageInput"
				accept="image/*"
				onChange={handleFileChange}
			/>

			<button
				type="button"
				onClick={handleUpload}
				disabled={!file || uploading}
				className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-400"
			>
				{uploading ? 'Uploading...' : 'Upload to Supabase'}
			</button>

			<Image src={data.publicUrl} alt="Image" width={300} height={300} />
		</div>
	);
};

export default Page;
