import type { Metadata } from 'next';

interface LayoutProps {
	params: Promise<{ id: string }>;
	children: React.ReactNode;
}

async function getPost(id: string) {
	try {
		const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
		const res = await fetch(`${base}/post/${id}`, { next: { revalidate: 60 } });
		if (!res.ok) return null;
		const json = await res.json();
		return json?.data;
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: LayoutProps): Promise<Metadata> {
	const { id } = await params;
	const post = await getPost(id);
	if (!post) {
		return { title: 'Post Not Found | TimeFirst' };
	}
	const description =
		post.description?.length > 160
			? `${post.description.slice(0, 160)}...`
			: post.description;
	return {
		title: `${post.title} | TimeFirst Blog`,
		description: description || `Blog post: ${post.title}`,
		openGraph: {
			title: post.title,
			description: description || post.title,
			...(post.imageUrl && { images: [post.imageUrl] }),
		},
	};
}

export default function PostLayout({ children }: LayoutProps) {
	return <>{children}</>;
}
