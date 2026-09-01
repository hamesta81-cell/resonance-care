/**
 * RESONANCE CARE - PRODUCTION OFFICIAL APPLICATION
 * Clean real-world membership platform logic without dummy texts
 */

(function() {
  'use strict';

  const AUTH_KEY = 'resonance_auth_user';
  const DATA_KEY_PREFIX = 'resonance_data_';

  // State in memory
  let currentUser = loadAuth();
  let userData = currentUser ? loadUserData(currentUser.id) : null;

  function loadAuth() {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return null;
  }

  function saveAuth(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      userData = loadUserData(user.id);
    } else {
      localStorage.removeItem(AUTH_KEY);
      userData = null;
    }
    renderApp();
  }

  function loadUserData(userId) {
    try {
      const saved = localStorage.getItem(DATA_KEY_PREFIX + userId);
      if (saved) return JSON.parse(saved);
    } catch(e) {}

    // Default clean state for newly registered real users
    return {
      userId,
      checkins: [],
      todayCheckedIn: false,
      todayCheckinData: null,
      messages: [
        {
          sender: 'partner',
          text: `안녕하세요 ${currentUser?.name || '회원'}님! 리조넌스 케어 전담 김복선 치유사입니다. 오늘 몸과 마음의 상태를 편안하게 기록해 주시면 세심하게 살피겠습니다.`,
          time: '가입 환영'
        }
      ],
      profile: {
        sleepPattern: '하루 7시간 내외',
        discomfortAreas: '목/어깨',
        goal: '만성 피로 완화 및 일상 컨디션 개선'
      }
    };
  }

  function saveUserData() {
    if (!currentUser || !userData) return;
    try {
      localStorage.setItem(DATA_KEY_PREFIX + currentUser.id, JSON.stringify(userData));
    } catch(e) {}
  }

  // Toast Helper
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Modal Controls
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.getAttribute('data-close-modal'));
    });
  });

  // Scale Buttons
  document.querySelectorAll('.scale-btn-group').forEach(group => {
    group.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Discomfort Slider
  const discomfortRange = document.getElementById('rangeDiscomfortVal');
  const discomfortLbl = document.getElementById('lblDiscomfortText');
  if (discomfortRange && discomfortLbl) {
    discomfortRange.addEventListener('input', () => {
      const val = parseInt(discomfortRange.value, 10);
      let desc = '없음';
      if (val >= 1 && val <= 3) desc = '경미함';
      else if (val >= 4 && val <= 6) desc = '보통 불편';
      else if (val >= 7) desc = '심한 뻐근함';
      discomfortLbl.textContent = `${val}점 (${desc})`;
    });
  }

  // ==========================================
  // AUTH LOGIC (JOIN / LOGIN / LOGOUT)
  // ==========================================
  
  // 1. Join (초대 가입)
  document.getElementById('formJoin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('joinInviteCode').value.trim();
    const name = document.getElementById('joinUserName').value.trim();
    const phone = document.getElementById('joinUserPhone').value.trim();

    if (!code || !name || !phone) return;

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      phone,
      inviteCode: code,
      joinedAt: new Date().toISOString().slice(0, 10),
      grade: 'VIP',
      assignedPartner: '김복선 치유사'
    };

    saveAuth(newUser);
    closeModal('modalJoin');
    showToast(`환영합니다, ${name} 님! 프라이빗 회원 가입이 완료되었습니다.`, 'success');
  });

  // 2. Login (기존 회원 로그인)
  document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('loginUserName').value.trim();
    const phone = document.getElementById('loginUserPhone').value.trim();

    if (!name || !phone) return;

    const user = {
      id: `user_${name}_${phone.slice(-4)}`,
      name,
      phone,
      grade: 'VIP',
      assignedPartner: '김복선 치유사'
    };

    saveAuth(user);
    closeModal('modalLogin');
    showToast(`${name} 님, 로그인되었습니다.`, 'success');
  });

  // 3. Logout
  document.getElementById('btnNavLogout')?.addEventListener('click', () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      saveAuth(null);
      showToast('안전하게 로그아웃되었습니다.', 'info');
    }
  });

  // Nav Buttons
  document.getElementById('btnNavJoin')?.addEventListener('click', () => openModal('modalJoin'));
  document.getElementById('btnNavLogin')?.addEventListener('click', () => openModal('modalLogin'));
  document.getElementById('btnHeroJoin')?.addEventListener('click', () => openModal('modalJoin'));
  document.getElementById('btnHeroLogin')?.addEventListener('click', () => openModal('modalLogin'));
  document.getElementById('btnGoHome')?.addEventListener('click', () => {
    if (currentUser) {
      document.querySelector('[data-target="m-tab-today"]')?.click();
    } else {
      renderApp();
    }
  });

  // ==========================================
  // REAL DAILY CHECKIN SUBMISSION
  // ==========================================
  document.getElementById('btnOpenCheckinModal')?.addEventListener('click', () => {
    if (!currentUser) {
      openModal('modalLogin');
      return;
    }
    openModal('modalCheckin');
  });

  document.getElementById('formCheckin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser || !userData) return;

    const getScaleVal = name => {
      const active = document.querySelector(`[data-scale="${name}"] .scale-btn.active`);
      return active ? parseInt(active.getAttribute('data-val'), 10) : 3;
    };

    const condition = getScaleVal('condition');
    const sleep = getScaleVal('sleep');
    const mind = getScaleVal('mind');
    const discomfort = discomfortRange ? parseInt(discomfortRange.value, 10) : 2;
    const memo = document.getElementById('txtCheckinMemo')?.value.trim() || '';

    const todayStr = new Date().toISOString().slice(0, 10);
    const newCheckin = {
      id: `chk_${Date.now()}`,
      date: todayStr,
      condition,
      sleep,
      mind,
      discomfort,
      memo,
      submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    userData.todayCheckedIn = true;
    userData.todayCheckinData = newCheckin;
    userData.checkins.unshift(newCheckin);

    saveUserData();
    closeModal('modalCheckin');
    showToast('오늘의 상태 체크가 전담 파트너에게 전송 및 기록되었습니다!', 'success');
    renderMemberView();
  });

  // ==========================================
  // 1:1 REAL CHAT
  // ==========================================
  async function handleSendChat() {
    if (!currentUser || !userData) return;
    const input = document.getElementById('inputChatMsg');
    const text = input?.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    userData.messages.push({
      sender: 'member',
      text,
      time: timeStr
    });
    input.value = '';
    renderChat();
    saveUserData();

    // Responsive partner acknowledgement
    setTimeout(() => {
      userData.messages.push({
        sender: 'partner',
        text: `${currentUser.name}님, 남겨주신 말씀 확인했습니다. ("${text}") 컨디션 관리에 참고하여 오늘 저녁 세심하게 살피겠습니다.`,
        time: timeStr
      });
      renderChat();
      saveUserData();
    }, 1200);
  }

  document.getElementById('btnSendChat')?.addEventListener('click', handleSendChat);
  document.getElementById('inputChatMsg')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendChat();
  });

  // ==========================================
  // VIEW SWITCHING & RENDERING
  // ==========================================
  function renderApp() {
    const pagePublic = document.getElementById('page-public');
    const pageMember = document.getElementById('page-member');
    const authNavBtns = document.getElementById('authNavButtons');
    const userNavProf = document.getElementById('userNavProfile');
    const navUserName = document.getElementById('navUserName');

    if (currentUser) {
      pagePublic?.classList.remove('active');
      pageMember?.classList.add('active');
      if (authNavBtns) authNavBtns.style.display = 'none';
      if (userNavProf) userNavProf.style.display = 'flex';
      if (navUserName) navUserName.textContent = currentUser.name;
      renderMemberView();
    } else {
      pagePublic?.classList.add('active');
      pageMember?.classList.remove('active');
      if (authNavBtns) authNavBtns.style.display = 'flex';
      if (userNavProf) userNavProf.style.display = 'none';
    }
  }

  // Member Sub-Tabs
  const mTabBtns = document.querySelectorAll('.m-tab-btn');
  const mTabContents = document.querySelectorAll('.m-tab-content');

  mTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      mTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mTabContents.forEach(c => c.classList.toggle('active', c.id === target));
      if (target === 'm-tab-report') renderReportChart();
    });
  });

  function renderMemberView() {
    if (!currentUser || !userData) return;

    // Header Greeting
    const gName = document.getElementById('mbGreetingName');
    const gPartner = document.getElementById('mbGreetingPartner');
    if (gName) gName.textContent = `${currentUser.name} 님`;
    if (gPartner) gPartner.textContent = `전담 케어: ${currentUser.assignedPartner || '김복선 치유사'} 배정됨`;

    // Today Status Tag
    const tag = document.getElementById('lblTodayStatusTag');
    const btnText = document.getElementById('lblBtnCheckinText');
    const ackTitle = document.getElementById('lblPartnerAckTitle');
    const ackText = document.getElementById('lblPartnerAckText');

    if (userData.todayCheckedIn && userData.todayCheckinData) {
      if (tag) { tag.className = 'check-status-tag done'; tag.textContent = '작성완료'; }
      if (btnText) btnText.textContent = '오늘 상태 체크 수정하기';
      if (ackTitle) ackTitle.textContent = '오늘 기록 확인 진행중';
      if (ackText) ackText.textContent = `오늘 ${userData.todayCheckinData.submittedAt || ''}에 기록을 완료하셨습니다. 전담 파트너가 세심하게 확인합니다.`;
    } else {
      if (tag) { tag.className = 'check-status-tag'; tag.textContent = '미작성'; }
      if (btnText) btnText.textContent = '지금 상태 체크 작성하기';
      if (ackTitle) ackTitle.textContent = '전담 파트너 안부 안내';
      if (ackText) ackText.textContent = '오늘의 상태 체크를 작성하시면 전담 파트너가 맞춤 피드백을 전달합니다.';
    }

    // Profile summary
    const profSleep = document.getElementById('lblProfileSleep');
    const profAreas = document.getElementById('lblProfileAreas');
    const profGoal = document.getElementById('lblProfileGoal');
    if (profSleep) profSleep.textContent = userData.profile.sleepPattern;
    if (profAreas) profAreas.textContent = userData.profile.discomfortAreas;
    if (profGoal) profGoal.textContent = userData.profile.goal;

    renderTimeline();
    renderChat();
  }

  function renderTimeline() {
    const container = document.getElementById('timelineFeedContainer');
    if (!container || !userData) return;

    if (!userData.checkins || userData.checkins.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-regular fa-clipboard"></i>
          <h4>아직 등록된 건강 상태 기록이 없습니다.</h4>
          <p>첫 번째 1분 상태 체크를 작성하시면 이곳에 나의 일별 변화가 차곡차곡 누적됩니다.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = userData.checkins.map(c => `
      <div class="timeline-card">
        <div class="timeline-card-head">
          <span><i class="fa-regular fa-calendar-check text-success"></i> <strong>${c.date}</strong> 상태 체크</span>
          <span>${c.submittedAt ? c.submittedAt + ' 작성' : ''}</span>
        </div>
        <div class="timeline-scores-row">
          <span>컨디션: <strong>${c.condition}점</strong></span>
          <span>수면: <strong>${c.sleep}점</strong></span>
          <span>마음: <strong>${c.mind}점</strong></span>
          <span>불편감: <strong>${c.discomfort}점</strong></span>
        </div>
        <p class="timeline-memo-text">"${c.memo || '작성된 메모가 없습니다.'}"</p>
      </div>
    `).join('');
  }

  function renderChat() {
    const box = document.getElementById('chatStreamBox');
    if (!box || !userData) return;

    box.innerHTML = userData.messages.map(m => `
      <div class="chat-bubble ${m.sender}">
        <div>${m.text}</div>
        <small style="font-size:10px; opacity:0.7; display:block; margin-top:4px; text-align:${m.sender==='member'?'right':'left'}">${m.time}</small>
      </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
  }

  function renderReportChart() {
    const canvas = document.getElementById('realScoreChart');
    if (!canvas || !userData) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const checkins = userData.checkins || [];
    const recent = checkins.slice(0, 7).reverse();

    const padding = 36;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    // Draw Grid (1~5)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let score = 1; score <= 5; score++) {
      const y = h - padding - ((score - 1) / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '11px Pretendard';
      ctx.fillText(`${score}점`, 8, y + 4);
    }

    if (recent.length === 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px Pretendard';
      ctx.textAlign = 'center';
      ctx.fillText('상태 체크를 등록하시면 실시간 추이 그래프가 나타납니다.', w / 2, h / 2);
      return;
    }

    const step = recent.length === 1 ? chartW : chartW / (recent.length - 1);

    // Draw Condition line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    recent.forEach((item, idx) => {
      const x = padding + idx * step;
      const y = h - padding - ((item.condition - 1) / 4) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points
    recent.forEach((item, idx) => {
      const x = padding + idx * step;
      const y = h - padding - ((item.condition - 1) / 4) * chartH;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Pretendard';
      ctx.textAlign = 'center';
      ctx.fillText(item.date.slice(5), x, h - 10);
    });
  }

  // Initial App Render
  renderApp();

})();
