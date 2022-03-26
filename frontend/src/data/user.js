export function getUserDetails(userId) {
  const mockUser = {
    id: userId,
    name: "Vitalik Buterin",
    dp: "https://i.pravatar.cc/128",
    posts: 1258,
    followers: 4032943,
    following: 1250,
  };

  return mockUser;
}

export function getCurrentUser() {
  return { id: "doggoman", name: "dog" };
}
