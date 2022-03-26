export function getFeed() {
  const mockData = [
    {
      user: {
        id: "doggoman",
        dp: "https://i.pravatar.cc/48",
      },
      post: {
        id: "post1",
        type: "video",
        uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumb: "images/BigBuckBunny.jpg",
        title: "Big Buck Bunny",
      },
      likes: 222,
      topComment: {
        userid: "cattoman",
        comment: "ooohhlala",
      },
    },
    {
      user: {
        id: "doggoman",
        dp: "https://i.pravatar.cc/48",
      },
      post: {
        id: "post1",
        type: "video",
        uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumb: "images/BigBuckBunny.jpg",
        title: "Big Buck Bunny",
      },
      likes: 222,
      topComment: {
        userid: "cattoman",
        comment: "ooohhlala",
      },
    },
  ];
  return mockData;
}
