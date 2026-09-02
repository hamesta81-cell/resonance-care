// Vercel Serverless Function for Central Cloud Storage
// In-Memory Global State + Global Sync across all clients

let globalServerState = {
  users: {},
  communityPosts: [
    {
      id: 'post_1',
      author: '김복선 치유사',
      isOfficial: true,
      category: 'notice',
      content: '🍂 [공식 웰니스 공지] 9월 환절기, 따뜻한 온수 섭취와 저녁 4-7-8 이완 호흡으로 자율신경 균형을 지켜보세요.',
      time: '오늘 09:00',
      likes: 12,
      isLiked: false
    },
    {
      id: 'post_2',
      author: '이서준 님 (VIP)',
      isOfficial: false,
      category: 'group',
      content: '4주 수면개선 소그룹 3일차입니다! 김복선 치유사님이 추천해주신 당귀 침출차 마시고 잤더니 뒤척임 없이 7시간 푹 잤네요.',
      time: '오늘 08:20',
      likes: 8,
      isLiked: false
    },
    {
      id: 'post_3',
      author: '박지현 님 (VIP)',
      isOfficial: false,
      category: 'review',
      content: '가을 케어박스 오늘 도착했습니다! 유기농 침출차 향이 너무 은은하고 릴랙스 밤 바르니 목 뻐근함이 한결 덜합니다.',
      time: '어제 19:40',
      likes: 15,
      isLiked: false
    }
  ]
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const userId = req.query.userId;
    if (userId && globalServerState.users[userId]) {
      return res.status(200).json({
        success: true,
        user: globalServerState.users[userId],
        communityPosts: globalServerState.communityPosts
      });
    }
    return res.status(200).json({
      success: true,
      allUsers: Object.keys(globalServerState.users).map(k => globalServerState.users[k].user),
      communityPosts: globalServerState.communityPosts
    });
  }

  if (req.method === 'POST') {
    try {
      const { user, userData, newPost } = req.body || {};

      if (user && user.id) {
        globalServerState.users[user.id] = {
          user,
          userData: userData || {},
          lastSyncAt: new Date().toISOString()
        };
      }

      if (newPost) {
        globalServerState.communityPosts.unshift(newPost);
      }

      return res.status(200).json({
        success: true,
        message: 'Synced to central cloud server successfully',
        serverTime: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
