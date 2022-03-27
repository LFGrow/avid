export function getUserDetails(userId) {
	const mockUser = {
		id: userId,
		name: "",
		dp: "https://ipfs.infura.io/ipfs/QmQT8FrcCGLecUouhxXJKUVLyNQh8qHpvBjKKDbc2UhEMw",
		posts: 0,
		followers: 0,
		following: 0,
	};

	return mockUser;
}

export function getCurrentUser() {
	return { id: "doggoman", name: "dog" };
}
