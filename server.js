const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initial Default State
const defaultState = {
  currentRole: 'guest',
  memberProfile: null,
  checkins: [],
  todayCheckedIn: false,
  todayCheckinData: null,
  careNotes: [],
  followups: [],
  partnerMembers: [],
  testimonials: [],
  messages: [],
  auditLogs: []
};

// Helper: Read & Write Data Store
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Data read error:', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Data write error:', e);
  }
}

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  writeData(defaultState);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // 1. GET /api/state - Full State
  if (req.method === 'GET' && pathname === '/api/state') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  // 2. POST /api/checkin - Submit Daily Checkin
  if (req.method === 'POST' && pathname === '/api/checkin') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const data = readData();
        
        data.todayCheckedIn = true;
        data.todayCheckinData = payload;

        // Add to historical checkins
        data.checkins.push({
          id: `chk-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          condition: payload.condition,
          sleep: payload.sleep,
          mind: payload.mind,
          discomfort: payload.discomfort,
          memo: payload.memo,
          partnerChecked: false
        });

        // Update partner queue member
        const mem = data.partnerMembers.find(m => m.id === 'mem-1');
        if (mem) {
          mem.todayStatus = '작성완료';
          mem.condition = payload.condition;
          mem.sleep = payload.sleep;
          mem.discomfort = payload.discomfort;
          mem.lastMemo = payload.memo || '상태 체크 완료';
          mem.priority = (payload.discomfort >= 6 || payload.condition <= 2) ? 'urgent' : 'normal';
        }

        // Add Audit Log
        data.auditLogs.unshift({
          timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          actor: `${data.memberProfile.name} (회원)`,
          role: 'Member',
          target: '본인 기록',
          action: '데일리 상태 체크 등록 (MB-04)',
          ip: req.socket.remoteAddress || '127.0.0.1',
          reason: '자가 건강 상태 전송'
        });

        writeData(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: '체크인이 서버에 영구 저장되었습니다.', data }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // 3. POST /api/messages - Send Message
  if (req.method === 'POST' && pathname === '/api/messages') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const data = readData();
        
        data.messages.push({
          sender: payload.sender || 'member',
          text: payload.text,
          time: payload.time || '방금 전'
        });

        writeData(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, messages: data.messages }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // 4. POST /api/carenote - Submit Care Note
  if (req.method === 'POST' && pathname === '/api/carenote') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const data = readData();
        
        data.careNotes.unshift({
          id: `note-${Date.now()}`,
          memberId: payload.memberId,
          memberName: payload.memberName,
          sessionTitle: payload.sessionTitle,
          date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          content: payload.content,
          nextFocus: payload.nextFocus,
          partnerName: payload.partnerName || '김서연 파트너'
        });

        // Add Audit Log
        data.auditLogs.unshift({
          timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          actor: '김서연 (CP-001)',
          role: 'Care Partner',
          target: `${payload.memberName} (${payload.memberId})`,
          action: '세션 케어 노트 작성 (CP-03)',
          ip: req.socket.remoteAddress || '127.0.0.1',
          reason: '세션 관찰 기록 등록'
        });

        writeData(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: '케어 노트가 서버에 저장되었습니다.', data }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // 5. POST /api/reset - Reset to default
  if (req.method === 'POST' && pathname === '/api/reset') {
    writeData(defaultState);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: defaultState }));
    return;
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err2, indexContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[RESONANCE CARE] Fullstack REST API Server running on port ${PORT}`);
});
