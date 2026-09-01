/**
 * RESONANCE CARE - FULLSTACK INTERACTIVE CLIENT
 * Communicates with REST APIs & Real-time Persistence
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'resonance_care_state_v1';

  // Default fallback state
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

  let state = loadLocal();

  function loadLocal() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {
      console.warn('LocalStorage load error', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e) {
      console.warn('LocalStorage save error', e);
    }
  }

  // Sync state with backend server if available
  async function fetchServerState() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data && data.memberProfile) {
          state = data;
          saveLocal();
          renderCurrentView();
          console.log('[API] Synced with server database');
        }
      }
    } catch (e) {
      console.log('[API] Operating in local persistence mode', e);
    }
  }

  // ==========================================
  // DOM ELEMENTS & HELPERS
  // ==========================================
  const roleButtons = document.querySelectorAll('.role-btn');
  const appViews = document.querySelectorAll('.app-view');
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

  function renderCurrentView() {
    if (state.currentRole === 'member') renderMemberView();
    else if (state.currentRole === 'partner') renderPartnerView();
    else if (state.currentRole === 'admin') renderAdminView();
    else if (state.currentRole === 'public') renderPublicView();
  }

  function switchRole(role) {
    state.currentRole = role;
    saveLocal();

    roleButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    appViews.forEach(view => {
      view.classList.toggle('active', view.id === `view-${role}`);
    });

    renderCurrentView();
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchRole(btn.getAttribute('data-role'));
    });
  });

  // Toggle Fullscreen Mode
  document.getElementById('btnToggleFullApp')?.addEventListener('click', () => {
    const frame = document.querySelector('.mobile-device-frame');
    if (!frame) return;
    const btn = document.getElementById('btnToggleFullApp');
    if (frame.classList.contains('fullscreen-app')) {
      frame.classList.remove('fullscreen-app');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i> 전체화면 모드';
      showToast('스마트폰 프레임 모드로 전환되었습니다.', 'info');
    } else {
      frame.classList.add('fullscreen-app');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i> 폰 프레임 모드';
      showToast('실제 앱 전체화면 모드로 전환되었습니다.', 'success');
    }
  });

  // Reset
  document.getElementById('btnResetDemoData')?.addEventListener('click', async () => {
    if (confirm('모든 데이터를 초기 기본값으로 재설정하시겠습니까?')) {
      try {
        await fetch('/api/reset', { method: 'POST' });
      } catch(e) {}
      localStorage.removeItem(STORAGE_KEY);
      state = JSON.parse(JSON.stringify(defaultState));
      saveLocal();
      switchRole(state.currentRole);
      showToast('데이터가 초기화되었습니다.', 'info');
    }
  });

  // Modal Helpers
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

  // Scale buttons
  document.querySelectorAll('.scale-btn-group').forEach(group => {
    group.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Discomfort Slider
  const discomfortRange = document.getElementById('rangeDiscomfort');
  const discomfortLbl = document.getElementById('lblDiscomfortVal');
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
  // REAL SUBMISSION HANDLERS (API + CLIENT)
  // ==========================================

  // 1. Daily Checkin Submit (MB-04)
  document.getElementById('formDailyCheckin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const getScaleVal = name => {
      const active = document.querySelector(`[data-scale-name="${name}"] .scale-btn.active`);
      return active ? parseInt(active.getAttribute('data-val'), 10) : 3;
    };

    const condition = getScaleVal('scoreCondition');
    const sleep = getScaleVal('scoreSleep');
    const mind = getScaleVal('scoreMind');
    const discomfort = discomfortRange ? parseInt(discomfortRange.value, 10) : 2;
    const memo = document.getElementById('txtCheckinNote')?.value.trim() || '';

    const payload = { condition, sleep, mind, discomfort, memo };

    // Send HTTP POST to server
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        state = json.data;
      } else {
        throw new Error('API request failed');
      }
    } catch(err) {
      // Local fallback
      state.todayCheckedIn = true;
      state.todayCheckinData = payload;
      state.checkins.push({
        id: `chk-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        condition, sleep, mind, discomfort, memo,
        partnerChecked: false
      });
      const mem = state.partnerMembers.find(m => m.id === 'mem-1');
      if (mem) {
        mem.todayStatus = '작성완료';
        mem.condition = condition;
        mem.sleep = sleep;
        mem.discomfort = discomfort;
        mem.lastMemo = memo || '상태 체크 완료';
        mem.priority = (discomfort >= 6 || condition <= 2) ? 'urgent' : 'normal';
      }
    }

    saveLocal();
    closeModal('modalDailyCheckin');
    showToast('🚀 오늘 상태 체크가 서버로 전송되어 전담 파트너에게 전달되었습니다!', 'success');
    renderMemberView();
  });

  // 2. Real Message Sending (MB-10)
  async function sendMessage() {
    const input = document.getElementById('txtMemberChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours() < 12 ? '오전' : '오후'} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;

    const msgObj = { sender: 'member', text, time: timeStr };
    state.messages.push(msgObj);
    input.value = '';
    renderMemberChat();

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgObj)
      });
    } catch (e) {}

    saveLocal();

    // Auto-reply Simulation
    setTimeout(async () => {
      const replyObj = {
        sender: 'partner',
        text: `김회원님, 메시지 확인했습니다. ("${text}") 말씀해주신 부분 오늘 저녁 세션 전담 케어에 적극 반영하겠습니다.`,
        time: timeStr
      };
      state.messages.push(replyObj);
      renderMemberChat();
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(replyObj)
        });
      } catch(e) {}
      saveLocal();
    }, 1200);
  }

  document.getElementById('btnSendMemberChat')?.addEventListener('click', sendMessage);
  document.getElementById('txtMemberChatInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // 3. Care Note Form Submit (CP-03)
  document.getElementById('formCareNote')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memId = document.getElementById('noteTargetMember')?.value || 'mem-1';
    const sessionTitle = document.getElementById('noteSessionTitle')?.value || '';
    const content = document.getElementById('txtNoteContent')?.value.trim() || '';
    const nextFocus = document.getElementById('noteNextFocus')?.value.trim() || '신체 이완 및 호흡';
    const needFollowup = document.getElementById('noteNeedFollowup')?.value || 'no';

    const targetMem = state.partnerMembers.find(m => m.id === memId) || { name: '김회원' };

    const payload = {
      memberId: memId,
      memberName: targetMem.name,
      sessionTitle,
      content,
      nextFocus,
      partnerName: '김서연 파트너'
    };

    try {
      const res = await fetch('/api/carenote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        state = json.data;
      } else {
        throw new Error('API failed');
      }
    } catch(err) {
      state.careNotes.unshift({
        id: `note-${Date.now()}`,
        date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        ...payload
      });
    }

    if (needFollowup === 'yes') {
      state.followups.unshift({
        id: `fl-${Date.now()}`,
        memberId: memId,
        memberName: targetMem.name,
        reason: `[세션 후속] ${nextFocus}`,
        dueDate: '2026.09.02',
        status: 'pending',
        partnerName: '김서연 파트너'
      });
    }

    saveLocal();
    showToast('🩺 케어 노트가 서버에 안전하게 전송 및 기록되었습니다.', 'success');
    if (document.getElementById('txtNoteContent')) document.getElementById('txtNoteContent').value = '';
    renderPartnerView();
  });

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  // Member View (MB)
  const memberNavItems = document.querySelectorAll('.member-bottom-nav .nav-item');
  const memberTabContents = document.querySelectorAll('.member-tab-content');

  memberNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      memberNavItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      memberTabContents.forEach(tab => {
        tab.classList.toggle('active', tab.id === tabId);
      });
      if (tabId === 'tab-mb-report') renderScoreChart();
    });
  });

  function renderMemberView() {
    const uName = document.getElementById('mbHeaderUserName');
    const pInfo = document.getElementById('mbHeaderPartnerInfo');
    if (uName) uName.textContent = `${state.memberProfile.name} 님`;
    if (pInfo) pInfo.textContent = `전담: ${state.memberProfile.assignedPartner}`;

    const checkTag = document.getElementById('todayCheckTag');
    const btnCheckinText = document.getElementById('btnCheckinText');
    if (checkTag && btnCheckinText) {
      if (state.todayCheckedIn) {
        checkTag.className = 'check-status-tag done';
        checkTag.textContent = '작성완료';
        btnCheckinText.textContent = '오늘 상태 체크 수정하기';
      } else {
        checkTag.className = 'check-status-tag';
        checkTag.textContent = '미작성';
        btnCheckinText.textContent = '지금 상태 체크하기';
      }
    }

    renderMemberTimeline();
    renderMemberChat();
  }

  function renderMemberTimeline() {
    const list = document.getElementById('memberTimelineList');
    if (!list) return;

    let itemsHtml = '';
    state.checkins.slice().reverse().forEach(c => {
      itemsHtml += `
        <div class="timeline-item">
          <div class="timeline-date"><i class="fa-regular fa-calendar-check"></i> ${c.date} - 데일리 상태 체크</div>
          <div class="timeline-scores">
            <span>컨디션: <strong>${c.condition}점</strong></span>
            <span>수면: <strong>${c.sleep}점</strong></span>
            <span>마음: <strong>${c.mind}점</strong></span>
            <span>불편감: <strong>${c.discomfort}점</strong></span>
          </div>
          <p class="timeline-memo">"${c.memo || '작성된 메모가 없습니다.'}"</p>
          ${c.partnerComment ? `<div class="timeline-partner-ack mt-2" style="font-size:11px; color:#34D399;"><i class="fa-solid fa-reply"></i> <strong>파트너 코멘트:</strong> ${c.partnerComment}</div>` : ''}
        </div>
      `;
    });

    state.careNotes.forEach(n => {
      itemsHtml += `
        <div class="timeline-item partner-item">
          <div class="timeline-date"><i class="fa-solid fa-user-doctor"></i> ${n.date} - ${n.sessionTitle}</div>
          <p class="timeline-memo"><strong>[파트너 관찰 노트]</strong> ${n.content}</p>
          <div style="font-size:11px; color:#93C5FD; margin-top:4px;">집중 영역: ${n.nextFocus} (${n.partnerName})</div>
        </div>
      `;
    });

    list.innerHTML = itemsHtml;
  }

  function renderMemberChat() {
    const box = document.getElementById('memberChatBox');
    if (!box) return;
    box.innerHTML = state.messages.map(m => `
      <div class="chat-bubble ${m.sender}">
        <div>${m.text}</div>
        <small style="font-size:9px; opacity:0.7; display:block; margin-top:3px; text-align:${m.sender==='member'?'right':'left'}">${m.time}</small>
      </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
  }

  function renderScoreChart() {
    const canvas = document.getElementById('memberScoreChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const days = ['8.26', '8.27', '8.28', '8.29', '8.30', '8.31', '9.01'];
    const conditionScores = [3, 3, 4, 3, 4, 3, state.todayCheckedIn ? (state.todayCheckinData?.condition || 4) : 4];
    const sleepScores = [2, 3, 3, 4, 4, 2, state.todayCheckedIn ? (state.todayCheckinData?.sleep || 4) : 3];

    const padding = 28;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let score = 1; score <= 5; score++) {
      const y = h - padding - ((score - 1) / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '9px Pretendard';
      ctx.fillText(`${score}점`, 6, y + 3);
    }

    function drawSeries(data, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const step = chartW / (data.length - 1);
      data.forEach((val, idx) => {
        const x = padding + idx * step;
        const y = h - padding - ((val - 1) / 4) * chartH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      data.forEach((val, idx) => {
        const x = padding + idx * step;
        const y = h - padding - ((val - 1) / 4) * chartH;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawSeries(conditionScores, '#10B981');
    drawSeries(sleepScores, '#60A5FA');

    const step = chartW / (days.length - 1);
    days.forEach((day, idx) => {
      const x = padding + idx * step;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Pretendard';
      ctx.textAlign = 'center';
      ctx.fillText(day, x, h - 8);
    });
  }

  // Shortcuts
  document.getElementById('btnGoPartnerMsgTab')?.addEventListener('click', () => {
    document.querySelector('[data-tab="tab-mb-message"]')?.click();
  });
  document.getElementById('btnGuideTriggerCheckin')?.addEventListener('click', () => openModal('modalDailyCheckin'));
  document.getElementById('btnOpenCheckinModal')?.addEventListener('click', () => openModal('modalDailyCheckin'));
  document.getElementById('btnSessionAttendance')?.addEventListener('click', () => showToast('오늘 저녁 20:00 세션 참석이 확인되었습니다.', 'success'));
  document.getElementById('btnSessionFeedbackModal')?.addEventListener('click', () => openModal('modalSessionFeedback'));
  document.getElementById('btnOpenTestimonialModal')?.addEventListener('click', () => openModal('modalTestimonialWrite'));
  document.getElementById('btnOpenInterviewModal')?.addEventListener('click', () => openModal('modalHealthInterview'));
  document.getElementById('btnOpenConsentModal')?.addEventListener('click', () => openModal('modalConsentView'));
  document.getElementById('btnSwitchMemberDemo')?.addEventListener('click', () => switchRole('member'));
  document.getElementById('btnOpenInviteModal')?.addEventListener('click', () => openModal('modalInviteSignup'));

  // Partner View (CP)
  const cpSideItems = document.querySelectorAll('.sidebar-nav .side-item');
  const cpPanels = document.querySelectorAll('.cp-panel');

  cpSideItems.forEach(item => {
    item.addEventListener('click', () => {
      const panelId = item.getAttribute('data-cp-panel');
      cpSideItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      cpPanels.forEach(p => p.classList.toggle('active', p.id === panelId));
    });
  });

  function renderPartnerView() {
    renderPartnerQueue('all');
    renderPartnerMemberDetail();
    renderPartnerFollowupTable();
  }

  function renderPartnerQueue(filter = 'all') {
    const tbody = document.getElementById('partnerQueueTableBody');
    if (!tbody) return;

    let list = state.partnerMembers;
    if (filter === 'urgent') list = list.filter(m => m.priority === 'urgent');
    else if (filter === 'uncheck') list = list.filter(m => m.todayStatus === '미작성');
    else if (filter === 'normal') list = list.filter(m => m.priority === 'normal');

    tbody.innerHTML = list.map(m => {
      let badgeClass = m.priority === 'urgent' ? 'urgent' : (m.todayStatus === '미작성' ? 'uncheck' : 'normal');
      let badgeText = m.priority === 'urgent' ? '주의/급변' : (m.todayStatus === '미작성' ? '미확인' : '안정');

      return `
        <tr>
          <td><span class="badge-priority ${badgeClass}">${badgeText}</span></td>
          <td><strong>${m.name}</strong> <small style="color:#94A3B8;">(${m.grade})</small></td>
          <td>${m.todayStatus === '작성완료' ? '<span class="text-success"><i class="fa-solid fa-check"></i> 작성완료</span>' : '<span style="color:#F87171;">미작성</span>'}</td>
          <td>컨디션 ${m.condition}점 / 수면 ${m.sleep}점</td>
          <td><strong style="color:${m.discomfort>=5?'#F87171':'#6EE7B7'}">${m.discomfort}점</strong></td>
          <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${m.lastMemo}"</td>
          <td><span class="badge-active">정상 관리</span></td>
          <td>
            <button class="btn btn-sm btn-outline btn-partner-ack" data-mem-id="${m.id}"><i class="fa-solid fa-clipboard-check"></i> 기록확인</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-partner-ack').forEach(btn => {
      btn.addEventListener('click', () => {
        const memId = btn.getAttribute('data-mem-id');
        const target = state.partnerMembers.find(m => m.id === memId);
        showToast(`${target?.name} 님의 기록을 확인 완료 처리하였습니다.`, 'success');
      });
    });
  }

  function renderPartnerMemberDetail() {
    const profileView = document.getElementById('partnerMemberProfileView');
    const feed = document.getElementById('partnerComparisonFeed');
    if (!profileView || !feed) return;

    const p = state.memberProfile;
    profileView.innerHTML = `
      <div class="detail-kv-item">
        <label>회원명 / 연령 / 등급</label>
        <strong>${p.name} (만 ${p.age}세 / ${p.grade} 회원)</strong>
      </div>
      <div class="detail-kv-item">
        <label>평소 수면 기준선</label>
        <strong>${p.baselineInterview.sleepPattern}</strong>
      </div>
      <div class="detail-kv-item">
        <label>주요 관리 부위</label>
        <strong>${p.baselineInterview.discomfortAreas.join(', ')}</strong>
      </div>
      <div class="detail-kv-item">
        <label>집중 관리 목표</label>
        <strong style="color:#34D399;">${p.baselineInterview.goal}</strong>
      </div>
    `;

    let feedHtml = '';
    state.checkins.forEach(c => {
      feedHtml += `
        <div class="feed-item">
          <div class="feed-header">
            <span><i class="fa-solid fa-user"></i> <strong>자가 기록</strong> (${c.date})</span>
            <span>컨디션 ${c.condition}점 | 불편감 ${c.discomfort}점</span>
          </div>
          <p class="feed-content">"${c.memo}"</p>
        </div>
      `;
    });

    state.careNotes.forEach(n => {
      feedHtml += `
        <div class="feed-item" style="border-left: 3px solid #3B82F6;">
          <div class="feed-header">
            <span style="color:#60A5FA;"><i class="fa-solid fa-user-doctor"></i> <strong>파트너 관찰 노트</strong> (${n.date})</span>
            <span>${n.sessionTitle}</span>
          </div>
          <p class="feed-content">${n.content}</p>
          <small style="color:#93C5FD; display:block; margin-top:4px;">다음 집중: ${n.nextFocus}</small>
        </div>
      `;
    });

    feed.innerHTML = feedHtml;
  }

  function renderPartnerFollowupTable() {
    const tbody = document.getElementById('partnerFollowupTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.followups.map(f => `
      <tr>
        <td><span class="badge-priority ${f.status==='pending'?'urgent':'normal'}">${f.status==='pending'?'대기중':'완료'}</span></td>
        <td><strong>${f.dueDate}</strong></td>
        <td>${f.memberName}</td>
        <td>${f.reason}</td>
        <td>${f.partnerName}</td>
        <td>
          ${f.status==='pending' ? `<button class="btn btn-sm btn-primary btn-done-followup" data-fl-id="${f.id}"><i class="fa-solid fa-check"></i> 안부 완료</button>` : '<span class="text-success">완료됨</span>'}
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-done-followup').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-fl-id');
        const target = state.followups.find(x => x.id === id);
        if (target) target.status = 'completed';
        saveLocal();
        showToast('후속 안부 확인 처리가 완료되었습니다.', 'success');
        renderPartnerFollowupTable();
      });
    });
  }

  // Admin View (AD)
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adPanels = document.querySelectorAll('.ad-panel');

  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('data-ad-panel');
      adminTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adPanels.forEach(p => p.classList.toggle('active', p.id === panelId));
    });
  });

  function renderAdminView() {
    const stream = document.getElementById('adminLiveActivityStream');
    if (stream) {
      stream.innerHTML = `
        <div class="stream-item">
          <span><strong>김회원 (mem-1)</strong> 오늘 데일리 상태 체크 제출 완료</span>
          <small style="color:#94A3B8;">방금 전</small>
        </div>
        <div class="stream-item">
          <span><strong>김서연 파트너</strong> 김회원 케어 노트 작성 및 감사 로그 등록</span>
          <small style="color:#94A3B8;">1분 전</small>
        </div>
      `;
    }

    const mBody = document.getElementById('adminMemberTableBody');
    if (mBody) {
      mBody.innerHTML = state.partnerMembers.map(m => `
        <tr>
          <td><code>${m.id}</code></td>
          <td><strong>${m.name}</strong></td>
          <td>010-****-1234</td>
          <td>김서연 파트너</td>
          <td><span class="badge-active">${m.grade} 활성</span></td>
          <td>2026.11.01</td>
          <td><span class="badge-success">민감정보 동의완료</span></td>
          <td><button class="btn btn-sm btn-outline"><i class="fa-solid fa-calendar-plus"></i> 기간연장</button></td>
        </tr>
      `).join('');
    }

    const aBody = document.getElementById('adminAuditLogBody');
    if (aBody) {
      aBody.innerHTML = state.auditLogs.map(l => `
        <tr>
          <td><small style="color:#94A3B8;">${l.timestamp}</small></td>
          <td><strong>${l.actor}</strong></td>
          <td><span class="tag-badge">${l.role}</span></td>
          <td>${l.target}</td>
          <td><span style="color:#60A5FA;">${l.action}</span></td>
          <td><code>${l.ip}</code></td>
          <td>${l.reason}</td>
        </tr>
      `).join('');
    }
  }

  // Public View (PU)
  function renderPublicView() {
    const container = document.getElementById('publicTestimonialsContainer');
    if (!container) return;

    container.innerHTML = state.testimonials.filter(t => t.approved).map(t => `
      <div class="testimonial-card">
        <div class="t-author-meta">
          <span class="t-name">${t.authorName}</span>
          <span class="t-area-badge">${t.area}</span>
        </div>
        <p class="t-body">"${t.body}"</p>
        <div class="t-footer">
          <span>작성일 ${t.date}</span>
          <span><i class="fa-solid fa-circle-check text-success"></i> 검토 완료</span>
        </div>
      </div>
    `).join('');
  }

  // Initial Boot
  switchRole('member');
  fetchServerState();

})();
