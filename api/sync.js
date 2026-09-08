// Vercel Serverless Function for Central Cloud Storage
// In-Memory Global State + Global Sync across all clients

let globalServerState = {
  users: {},
  communityPosts: []
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
