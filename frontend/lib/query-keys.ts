export const queryKeys = {
	auth: ['authUser'],
	journals: ['journals'],
	myPosts: ['my-posts'],
	posts: ['posts'],
	dailyQuote: ['daily-quote'],
	moodData: ['mood-data'],
	postDetail: (id: string) => ['post', id] as const,
} as const;
