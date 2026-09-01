const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initial Default State
const defaultState = {
  currentRole: 'member',
  memberProfile: {
    id: 'mem-1',
    name: '김회원',
    age: 38,
    grade: 'VIP',
    assignedPartner: '김서연 파트너',
    membershipValidUntil: '2026.11.01',
    consent: {
      terms: true,
      sensitiveHealth: true,
      publicTestimonial: true
    },
    baselineInterview: {
      sleepPattern: '하루 6시간 내외 / 취침 자정 전후',
      discomfortAreas: ['목/어깨', '허리/골반'],
      goal: '아침 기상 시 피로감 완화 및 만성 어깨 결림 개선'
    }
  },
  checkins: [
    {
      id: 'chk-1',
      date: '2026-08-30',
      condition: 4,
      sleep: 4,
      mind: 4,
      discomfort: 2,
      memo: '가벼운 조깅 후 취침하여 아침에 개운했습니다.',
      partnerChecked: true,
      checkedAt: '2026.08.30 11:20',
      partnerComment: '규칙적인 가벼운 유산소가 수면에 큰 도움이 되고 있네요.'
    },
    {
      id: 'chk-2',
      date: '2026-08-31',
      condition: 3,
      sleep: 2,
      mind: 3,
      discomfort: 5,
      memo: '야근으로 늦게 자고 목 뒤와 승모근이 많이 뭉쳤습니다.',
      partnerChecked: true,
      checkedAt: '2026.08.31 10:15',
      partnerComment: '오늘 저녁 세션에서 목과 상체 이완 호흡을 집중 진행하겠습니다.'
    }
  ],
  todayCheckedIn: false,
  todayCheckinData: null,
  careNotes: [
    {
      id: 'note-1',
      memberId: 'mem-1',
      memberName: '김회원',
      sessionTitle: '2026.08.31 저녁 상체 이완 세션',
      date: '2026.08.31 20:50',
      content: '세션 초반 승모근 긴장이 높았으나 호흡 3세트 후 어깨 가동범위 회복됨. 세션 만족도 높음.',
      nextFocus: '취침 전 5분 이완 루틴 유지',
      partnerName: '김서연 파트너'
    }
  ],
  followups: [
    {
      id: 'fl-1',
      memberId: 'mem-1',
      memberName: '김회원',
      reason: '야근 후 승모근 통증 호소에 따른 세션 후 안부 확인',
      dueDate: '2026.09.02',
      status: 'pending',
      partnerName: '김서연 파트너'
    }
  ],
  partnerMembers: [
    { id: 'mem-1', name: '김회원', grade: 'VIP', todayStatus: '미작성', condition: 3, sleep: 2, discomfort: 5, priority: 'uncheck', lastMemo: '야근으로 목 뒤 뭉침' },
    { id: 'mem-2', name: '이영희', grade: 'Standard', todayStatus: '작성완료', condition: 2, sleep: 1, discomfort: 7, priority: 'urgent', lastMemo: '3일째 불면 지속, 두통' },
    { id: 'mem-3', name: '박철수', grade: 'VIP', todayStatus: '작성완료', condition: 5, sleep: 5, discomfort: 1, priority: 'normal', lastMemo: '아침 컨디션 매우 상쾌함' }
  ],
  testimonials: [
    {
      id: 't-1',
      authorName: '김*원 님',
      area: '수면의 질 & 피로감 개선',
      body: '전담 파트너가 내 컨디션을 매일 기억하고 맞춰주니 3개월 만에 아침 피로가 확연히 줄었습니다.',
      date: '2026.08.20',
      approved: true,
      publicAgreed: true
    }
  ],
  messages: [
    { sender: 'partner', text: '김회원님, 어제 수면 점수가 조금 낮으셨네요. 오늘 저녁 세션에서는 목과 어깨 긴장 완화에 집중해볼게요!', time: '오전 10:15' }
  ],
  auditLogs: [
    { timestamp: '2026.09.01 14:20:11', actor: '김서연 (CP-001)', role: 'Care Partner', target: '김회원 (mem-1)', action: '건강 타임라인 및 상태 체크 열람', ip: '192.168.1.45', reason: '일일 라운딩 업무' }
  ]
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
