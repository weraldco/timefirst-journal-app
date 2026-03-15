import {
	journalSchema,
	loginSchema,
	postSchema,
} from '../schemas';

describe('loginSchema', () => {
	it('accepts valid email and password', () => {
		const result = loginSchema.safeParse({
			email: 'test@example.com',
			password: 'password123',
		});
		expect(result.success).toBe(true);
	});

	it('rejects invalid email', () => {
		const result = loginSchema.safeParse({
			email: 'invalid',
			password: 'password123',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid email address');
		}
	});

	it('rejects password too short', () => {
		const result = loginSchema.safeParse({
			email: 'test@example.com',
			password: '12345',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Password must be at least 6 characters'
			);
		}
	});
});

describe('journalSchema', () => {
	it('accepts valid journal data', () => {
		const result = journalSchema.safeParse({
			title: 'My Journal',
			content: 'Journal content',
			mood: 'happy',
			tags: ['tag1'],
		});
		expect(result.success).toBe(true);
	});

	it('rejects missing title', () => {
		const result = journalSchema.safeParse({
			title: '',
			content: 'Content',
			mood: 'happy',
			tags: [],
		});
		expect(result.success).toBe(false);
	});

	it('rejects missing content', () => {
		const result = journalSchema.safeParse({
			title: 'Title',
			content: '',
			mood: 'happy',
			tags: [],
		});
		expect(result.success).toBe(false);
	});

	it('rejects invalid mood', () => {
		const result = journalSchema.safeParse({
			title: 'Title',
			content: 'Content',
			mood: 'invalid_mood',
			tags: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid mood');
		}
	});
});

describe('postSchema', () => {
	it('accepts valid post data', () => {
		const result = postSchema.safeParse({
			title: 'My Post',
			description: 'Post description',
			imageUrl: null,
			tags: ['react'],
			type: 'project',
			date: '2024-01-01',
		});
		expect(result.success).toBe(true);
	});

	it('rejects missing title', () => {
		const result = postSchema.safeParse({
			title: '',
			description: 'Desc',
			tags: [],
			type: 'project',
			date: '2024-01-01',
		});
		expect(result.success).toBe(false);
	});

	it('rejects missing description', () => {
		const result = postSchema.safeParse({
			title: 'Title',
			description: '',
			tags: [],
			type: 'project',
			date: '2024-01-01',
		});
		expect(result.success).toBe(false);
	});

	it('rejects invalid type', () => {
		const result = postSchema.safeParse({
			title: 'Title',
			description: 'Desc',
			tags: [],
			type: 'invalid_type',
			date: '2024-01-01',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid post type');
		}
	});
});
