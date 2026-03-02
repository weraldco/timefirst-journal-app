'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PostFormData, postSchema } from '@/lib/schemas';
import { uploadPostImage } from '@/lib/upload';
import type { Post } from '@/types';
import { useAuth } from '@/context/auth-context';

interface PostFormModalProps {
	post?: Post | null;
	onSave: (data: PostFormData & { imageUrl?: string | null }) => void;
	onClose: () => void;
}

const availableTags = [
	'react',
	'nextjs',
	'typescript',
	'node',
	'project',
	'kata',
	'achievement',
	'learning',
	'coding',
];

export default function PostFormModal({
	post,
	onSave,
	onClose,
}: PostFormModalProps) {
	const { user } = useAuth();
	const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags || []);
	const [customTag, setCustomTag] = useState('');
	const [imagePreview, setImagePreview] = useState<string | null>(
		post?.imageUrl || null
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<PostFormData>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: '',
			description: '',
			imageUrl: null,
			tags: [],
			type: 'project',
			date: new Date().toISOString().split('T')[0],
		},
	});

	useEffect(() => {
		if (post) {
			reset({
				title: post.title,
				description: post.description,
				imageUrl: post.imageUrl,
				tags: post.tags ?? [],
				type: post.type,
				date: post.date.split('T')[0],
			});
			setSelectedTags(post.tags ?? []);
			setImagePreview(post.imageUrl);
		} else {
			reset({
				title: '',
				description: '',
				imageUrl: null,
				tags: [],
				type: 'project',
				date: new Date().toISOString().split('T')[0],
			});
			setSelectedTags([]);
			setImagePreview(null);
			setImageFile(null);
		}
	}, [post, reset]);

	const toggleTag = (tag: string) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
		setSelectedTags(newTags);
		setValue('tags', newTags);
	};

	const addCustomTag = () => {
		if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
			const newTags = [...selectedTags, customTag.trim()];
			setSelectedTags(newTags);
			setValue('tags', newTags);
			setCustomTag('');
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setImageFile(null);
			setImagePreview(post?.imageUrl || null);
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		setValue('imageUrl', null);
	};

	const onSubmit = async (data: PostFormData) => {
		try {
			let imageUrl: string | null = post?.imageUrl || null;

			if (imageFile && user?.id) {
				setIsUploading(true);
				try {
					imageUrl = await uploadPostImage(imageFile, user.id);
				} catch (err) {
					toast.error(
						err instanceof Error ? err.message : 'Image upload failed'
					);
					setIsUploading(false);
					return;
				}
				setIsUploading(false);
			} else if (!imageFile && !post?.imageUrl) {
				imageUrl = null;
			}

			onSave({
				...data,
				tags: selectedTags,
				imageUrl,
			});
			onClose();
		} catch (err) {
			toast.error('Error saving post');
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="border-b border-gray-200 p-6 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							{post ? 'Edit Post' : 'New Post'}
						</h2>
						<button
							onClick={onClose}
							className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							aria-label="Close modal"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 p-6"
				>
					<div>
						<label
							htmlFor="title"
							className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Title *
						</label>
						<input
							{...register('title')}
							type="text"
							id="title"
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Enter post title"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-600">
								{errors.title.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="description"
							className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Description *
						</label>
						<textarea
							{...register('description')}
							id="description"
							rows={6}
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Write your post content..."
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600">
								{errors.description.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Image
						</label>
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							onChange={handleImageChange}
							className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
						{imagePreview && (
							<div className="relative mt-2 inline-block">
								<img
									src={imagePreview}
									alt="Preview"
									className="h-32 rounded-lg object-cover"
								/>
								<button
									type="button"
									onClick={removeImage}
									className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
								>
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						)}
						{isUploading && (
							<p className="mt-1 text-sm text-gray-500">
								Uploading image...
							</p>
						)}
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Type *
						</label>
						<select
							{...register('type')}
							id="type"
							aria-label="Type"
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="project">Project</option>
							<option value="code_kata">Code Kata</option>
							<option value="achievement">Achievement</option>
						</select>
						{errors.type && (
							<p className="mt-1 text-sm text-red-600">
								{errors.type.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="date"
							className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Date
						</label>
						<input
							{...register('date')}
							type="date"
							id="date"
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
						{errors.date && (
							<p className="mt-1 text-sm text-red-600">
								{errors.date.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Tags
						</label>
						<div className="mb-3 flex flex-wrap gap-2">
							{availableTags.map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => toggleTag(tag)}
									className={`rounded-full px-3 py-1 text-sm transition-colors ${
										selectedTags.includes(tag)
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
									}`}
								>
									#{tag}
								</button>
							))}
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={customTag}
								onChange={(e) => setCustomTag(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addCustomTag();
									}
								}}
								className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								placeholder="Add custom tag"
							/>
							<button
								type="button"
								onClick={addCustomTag}
								className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							>
								Add
							</button>
						</div>
						{selectedTags.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{selectedTags.map((tag, index) => (
									<span
										key={`${tag}-${index}`}
										className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
									>
										#{tag}
										<button
											type="button"
											onClick={() => {
												const newTags =
													selectedTags.filter(
														(_, i) => i !== index
													);
												setSelectedTags(newTags);
												setValue('tags', newTags);
											}}
											className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					<div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isUploading}
							className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
						>
							{post ? 'Update' : 'Create'} Post
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
