/**
 * RESONANCE CARE - INTERACTIVE PLATFORM APPLICATION LOGIC
 * Supports PU-01, AU-01, MB-01~11, CP-01~04, AD-01~03
 */

(function() {
  'use strict';

  // ==========================================
  // 1. INITIAL DATA STORE (LOCALSTORAGE SYNC)
  // ==========================================
  const STORAGE_KEY = 'resonance_care_state_v1';

  const defaultState = {
    currentRole: 'member', // 'public' | 'member' | 'partner' | 'admin'
    
    // Member Info
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

    // Daily Check-ins (MB-04 & MB-07)
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

    // Today's Checkin Status
    todayCheckedIn: false,
    todayCheckinData: null,

    // Partner Care Notes (CP-03)
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

    // Follow-up Queue (CP-04)
    followups: [
      {
        id: 'fl-1',
        memberId: 'mem-1',
        memberName: '김회원',
        reason: '야근 후 승모근 통증 호소에 따른 세션 후 안부 확인',
        dueDate: '2026.09.02',
        status: 'pending',
        partnerName: '김서연 파트너'
      },
      {
        id: 'fl-2',
        memberId: 'mem-2',
        memberName: '이영희',
        reason: '최근 3일 연속 수면 2점 이하 기록에 따른 수면 리듬 점검',
        dueDate: '2026.09.01',
        status: 'pending',
        partnerName: '김서연 파트너'
      }
    ],

    // Partner Queue Members List (CP-01)
    partnerMembers: [
      { id: 'mem-1', name: '김회원', grade: 'VIP', todayStatus: '미작성', condition: 3, sleep: 2, discomfort: 5, priority: 'uncheck', lastMemo: '야근으로 목 뒤 뭉침' },
      { id: 'mem-2', name: '이영희', grade: 'Standard', todayStatus: '작성완료', condition: 2, sleep: 1, discomfort: 7, priority: 'urgent', lastMemo: '3일째 불면 지속, 두통' },
      { id: 'mem-3', name: '박철수', grade: 'VIP', todayStatus: '작성완료', condition: 5, sleep: 5, discomfort: 1, priority: 'normal', lastMemo: '아침 컨디션 매우 상쾌함' },
      { id: 'mem-4', name: '최민지', grade: 'Standard', todayStatus: '작성완료', condition: 4, sleep: 4, discomfort: 2, priority: 'normal', lastMemo: '세션 후 숙면 유지중' }
    ],

    // Testimonials (MB-09 & AD-03 & PU-01)
    testimonials: [
      {
        id: 't-1',
        authorName: '김*원 님',
        area: '수면의 질 & 피로감 개선',
        body: '혼자 운동이나 관리를 할 때는 작심삼일이었는데, 전담 파트너가 내 컨디션을 매일 기억하고 맞춰주니 3개월 만에 아침 피로가 확연히 줄었습니다.',
        date: '2026.08.20',
        approved: true,
        publicAgreed: true
      },
      {
        id: 't-2',
        authorName: '박*수 님',
        area: '만성 어깨 뻐근함 이완',
        body: '병원 진료와는 또 다르게 일상 속에서 내 몸의 변화를 차분하게 기록하고 피드백받는 안정감이 큽니다.',
        date: '2026.08.25',
        approved: true,
        publicAgreed: true
      }
    ],

    // Chat Messages (MB-10)
    messages: [
      { sender: 'partner', text: '김회원님, 어제 수면 점수가 조금 낮으셨네요. 오늘 저녁 세션에서는 목과 어깨 긴장 완화에 집중해볼게요!', time: '오전 10:15' },
      { sender: 'member', text: '네 파트너님, 안 그래도 오늘 목이 많이 뻐근한데 저녁에 뵙겠습니다.', time: '오전 10:30' }
    ],

    // Audit Logs (AD-03)
    auditLogs: [
      { timestamp: '2026.09.01 14:20:11', actor: '김서연 (CP-001)', role: 'Care Partner', target: '김회원 (mem-1)', action: '건강 타임라인 및 상태 체크 열람', ip: '192.168.1.45', reason: '일일 라운딩 업무' },
      { timestamp: '2026.09.01 10:05:32', actor: '관리자 (AD-001)', role: 'Admin', target: '김회원 (mem-1)', action: '회원권 기간 갱신 승인', ip: '211.234.12.9', reason: '회원 연장 신청 처리' },
      { timestamp: '2026.08.31 20:55:00', actor: '김서연 (CP-001)', role: 'Care Partner', target: '김회원 (mem-1)', action: '세션 케어 노트 작성', ip: '192.168.1.45', reason: '원격 세션 후 관찰 기록' }
    ]
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {
      console.warn('LocalStorage load failed, using default state', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  function recordAuditLog(actor, role, target, action, reason) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    state.auditLogs.unshift({
      timestamp,
      actor,
      role,
      target,
      action,
      ip: '192.168.1.50',
      reason
    });
    saveState();
    renderAuditLogs();
  }

  // ==========================================
  // 2. DOM ELEMENTS & VIEW CONTROLS
  // ==========================================
  const roleButtons = document.querySelectorAll('.role-btn');
  const appViews = document.querySelectorAll('.app-view');
  const toastContainer = document.getElementById('toastContainer');

  // Role Switching
  function switchRole(role) {
    state.currentRole = role;
    saveState();

    roleButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    appViews.forEach(view => {
      view.classList.toggle('active', view.id === `view-${role}`);
    });

    if (role === 'member') {
      renderMemberView();
    } else if (role === 'partner') {
      renderPartnerView();
      recordAuditLog('김서연 (CP-001)', 'Care Partner', '전담 회원 일괄', '라운딩 대시보드 접근', '일일 라운딩 수행');
    } else if (role === 'admin') {
      renderAdminView();
      recordAuditLog('운영관리자 (AD-001)', 'Admin', '전체 회원/시스템', '운영 관리 콘솔 접근', '종합 대시보드 모니터링');
    } else if (role === 'public') {
      renderPublicView();
    }
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      switchRole(role);
    });
  });

  // Reset Demo Data
  document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
    if (confirm('모든 데이터를 초기 기획서 기본값으로 재설정하시겠습니까?')) {
      localStorage.removeItem(STORAGE_KEY);
      state = JSON.parse(JSON.stringify(defaultState));
      saveState();
      switchRole(state.currentRole);
      showToast('데이터가 초기화되었습니다.', 'info');
    }
  });

  // Full App Mode Toggle
  document.getElementById('btnToggleFullApp')?.addEventListener('click', () => {
    const frame = document.querySelector('.mobile-device-frame');
    if (!frame) return;
    if (frame.classList.contains('fullscreen-app')) {
      frame.classList.remove('fullscreen-app');
      document.getElementById('btnToggleFullApp').innerHTML = '<i class="fa-solid fa-expand"></i> 전체화면 모드';
      showToast('스마트폰 프레임 모드로 전환되었습니다.', 'info');
    } else {
      frame.classList.add('fullscreen-app');
      document.getElementById('btnToggleFullApp').innerHTML = '<i class="fa-solid fa-compress"></i> 폰 프레임 모드';
      showToast('실제 앱 전체화면 모드로 전환되었습니다.', 'success');
    }
  });

  // Toast Helper
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

  // ==========================================
  // 3. PUBLIC VIEW (PU-01)
  // ==========================================
  function renderPublicView() {
    const container = document.getElementById('publicTestimonialsContainer');
    if (!container) return;

    const approvedList = state.testimonials.filter(t => t.approved && t.publicAgreed);
    container.innerHTML = approvedList.map(t => `
      <div class="testimonial-card">
        <div class="t-author-meta">
          <span class="t-name">${t.authorName}</span>
          <span class="t-area-badge">${t.area}</span>
        </div>
        <p class="t-body">"${t.body}"</p>
        <div class="t-footer">
          <span>작성일 ${t.date}</span>
          <span><i class="fa-solid fa-circle-check text-success"></i> 본인 동의 및 검토 완료</span>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('btnSwitchMemberDemo')?.addEventListener('click', () => switchRole('member'));
  document.getElementById('btnOpenInviteModal')?.addEventListener('click', () => openModal('modalInviteSignup'));

  // ==========================================
  // 4. MEMBER VIEW (MB-01 ~ MB-11)
  // ==========================================
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
      if (tabId === 'tab-mb-report') {
        renderScoreChart();
      }
    });
  });

  function renderMemberView() {
    // Header & User Info
    const uName = document.getElementById('mbHeaderUserName');
    const pInfo = document.getElementById('mbHeaderPartnerInfo');
    if (uName) uName.textContent = `${state.memberProfile.name} 님`;
    if (pInfo) pInfo.textContent = `전담: ${state.memberProfile.assignedPartner}`;

    // Today Status Check Tag
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

  // Render Timeline (MB-07)
  function renderMemberTimeline() {
    const list = document.getElementById('memberTimelineList');
    if (!list) return;

    let itemsHtml = '';

    // If today checked in
    if (state.todayCheckedIn && state.todayCheckinData) {
      const d = state.todayCheckinData;
      itemsHtml += `
        <div class="timeline-item">
          <div class="timeline-date"><i class="fa-regular fa-calendar-check"></i> 오늘 (2026-09-01) - 데일리 상태 체크</div>
          <div class="timeline-scores">
            <span>컨디션: <strong>${d.condition}점</strong></span>
            <span>수면: <strong>${d.sleep}점</strong></span>
            <span>마음: <strong>${d.mind}점</strong></span>
            <span>불편감: <strong>${d.discomfort}점</strong></span>
          </div>
          <p class="timeline-memo">"${d.memo || '작성된 메모가 없습니다.'}"</p>
        </div>
      `;
    }

    // Historical Checkins
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
          <p class="timeline-memo">"${c.memo}"</p>
          ${c.partnerComment ? `<div class="timeline-partner-ack mt-2" style="font-size:11px; color:#34D399;"><i class="fa-solid fa-reply"></i> <strong>파트너 코멘트:</strong> ${c.partnerComment}</div>` : ''}
        </div>
      `;
    });

    // Care Notes by Partner
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

  // Render Chat (MB-10)
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

  // Send Chat
  document.getElementById('btnSendMemberChat')?.addEventListener('click', sendMemberMessage);
  document.getElementById('txtMemberChatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMemberMessage();
  });

  function sendMemberMessage() {
    const input = document.getElementById('txtMemberChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours() < 12 ? '오전' : '오후'} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;

    state.messages.push({
      sender: 'member',
      text,
      time: timeStr
    });
    input.value = '';
    saveState();
    renderMemberChat();

    // Auto-reply Simulation from Care Partner after 1.2s
    setTimeout(() => {
      state.messages.push({
        sender: 'partner',
        text: `김회원님, 남겨주신 말씀 확인했습니다. ("${text}") 세션 전 꼼꼼히 살피겠습니다.`,
        time: timeStr
      });
      saveState();
      renderMemberChat();
    }, 1200);
  }

  // Render Canvas Score Chart (MB-08)
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

    // Draw Grid Lines (1~5)
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

    // Function to draw line series
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

      // Points
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

  // Guide and Tab shortcuts
  document.getElementById('btnGoPartnerMsgTab')?.addEventListener('click', () => {
    document.querySelector('[data-tab="tab-mb-message"]')?.click();
  });
  document.getElementById('btnGuideTriggerCheckin')?.addEventListener('click', () => {
    openModal('modalDailyCheckin');
  });
  document.getElementById('btnOpenCheckinModal')?.addEventListener('click', () => {
    openModal('modalDailyCheckin');
  });
  document.getElementById('btnSessionAttendance')?.addEventListener('click', () => {
    showToast('오늘 저녁 20:00 세션 참석이 확인되었습니다. (D-Day)', 'success');
  });
  document.getElementById('btnSessionFeedbackModal')?.addEventListener('click', () => {
    openModal('modalSessionFeedback');
  });
  document.getElementById('btnOpenTestimonialModal')?.addEventListener('click', () => {
    openModal('modalTestimonialWrite');
  });
  document.getElementById('btnOpenInterviewModal')?.addEventListener('click', () => {
    openModal('modalHealthInterview');
  });
  document.getElementById('btnOpenConsentModal')?.addEventListener('click', () => {
    openModal('modalConsentView');
  });
  document.getElementById('btnDownloadData')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `resonance_care_records_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    showToast('내 건강 기록 파일이 다운로드되었습니다.', 'success');
  });
  document.getElementById('btnWithdrawMember')?.addEventListener('click', () => {
    if (confirm('회원 탈퇴 시 모든 건강 기록이 지체 없이 파기됩니다. 계속하시겠습니까?')) {
      showToast('탈퇴 및 데이터 파기 요청이 접수되었습니다. (개인정보보호법 준수)', 'info');
    }
  });

  // ==========================================
  // 5. MODAL FORM SUBMISSIONS & BINDINGS
  // ==========================================
  
  // Scale Buttons Selector in Modals
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

  // Daily Checkin Submit (MB-04)
  document.getElementById('formDailyCheckin')?.addEventListener('submit', (e) => {
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

    state.todayCheckedIn = true;
    state.todayCheckinData = { condition, sleep, mind, discomfort, memo };

    // Update partner queue status for mem-1
    const pMem = state.partnerMembers.find(m => m.id === 'mem-1');
    if (pMem) {
      pMem.todayStatus = '작성완료';
      pMem.condition = condition;
      pMem.sleep = sleep;
      pMem.discomfort = discomfort;
      pMem.lastMemo = memo || '상태 체크 완료';
      pMem.priority = (discomfort >= 6 || condition <= 2) ? 'urgent' : 'normal';
    }

    saveState();
    closeModal('modalDailyCheckin');
    showToast('오늘 상태 체크가 전담 파트너에게 전송되었습니다.', 'success');
    renderMemberView();
  });

  // Session Feedback Submit (MB-06)
  document.getElementById('formSessionFeedback')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const active = document.querySelector('[data-scale-name="scoreRelaxation"] .scale-btn.active');
    const relaxScore = active ? active.getAttribute('data-val') : '5';
    const memo = document.getElementById('txtSessionFeedbackMemo')?.value.trim() || '';

    state.checkins.unshift({
      id: `session-fb-${Date.now()}`,
      date: '2026-09-01',
      condition: parseInt(relaxScore, 10),
      sleep: 4,
      mind: 5,
      discomfort: 1,
      memo: `[세션 직후 체감] 이완감 ${relaxScore}점 - ${memo}`,
      partnerChecked: false
    });

    saveState();
    closeModal('modalSessionFeedback');
    showToast('세션 후 체감 기록이 타임라인에 등록되었습니다.', 'success');
    renderMemberView();
  });

  // Testimonial Submit (MB-09)
  document.getElementById('formWriteTestimonial')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const area = document.getElementById('txtTestimonialArea')?.value.trim() || '';
    const body = document.getElementById('txtTestimonialBody')?.value.trim() || '';
    const agree = document.getElementById('chkTestimonialAgreePublic')?.checked ?? true;

    state.testimonials.push({
      id: `t-${Date.now()}`,
      authorName: '김*원 님',
      area,
      body,
      date: '2026.09.01',
      approved: false, // requires admin approval (AD-03)
      publicAgreed: agree
    });

    saveState();
    closeModal('modalTestimonialWrite');
    showToast('체험담이 제출되었습니다. 관리자 검토 후 승인됩니다.', 'info');
  });

  // Signup with Invite Code (AU-01)
  document.getElementById('formInviteSignup')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('txtSignupName')?.value.trim() || '신규회원';
    state.memberProfile.name = name;
    saveState();
    closeModal('modalInviteSignup');
    showToast(`초대 코드가 승인되었습니다! ${name} 님 환영합니다.`, 'success');
    switchRole('member');
  });

  // Chip toggles
  document.querySelectorAll('.chip-select-group .chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  // Health Interview Submit (MB-02)
  document.getElementById('formHealthInterview')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const sleepPattern = document.getElementById('interviewSleepPattern')?.value || '';
    const goal = document.getElementById('interviewGoal')?.value || '';
    const activeChips = Array.from(document.querySelectorAll('#interviewChipGroup .chip.active')).map(c => c.textContent);

    state.memberProfile.baselineInterview = {
      sleepPattern,
      discomfortAreas: activeChips,
      goal
    };
    saveState();
    closeModal('modalHealthInterview');
    showToast('초기 건강 인터뷰 기준선이 수정 저장되었습니다.', 'success');
  });

  // Modal Open/Close Helpers
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
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // ==========================================
  // 6. CARE PARTNER CONSOLE (CP-01 ~ CP-04)
  // ==========================================
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

  // Filter Pills (CP-01)
  document.querySelectorAll('.filter-pill-group .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill-group .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderPartnerQueue(filter);
    });
  });

  function renderPartnerQueue(filter = 'all') {
    const tbody = document.getElementById('partnerQueueTableBody');
    if (!tbody) return;

    let list = state.partnerMembers;
    if (filter === 'urgent') list = list.filter(m => m.priority === 'urgent');
    else if (filter === 'uncheck') list = list.filter(m => m.todayStatus === '미작성');
    else if (filter === 'normal') list = list.filter(m => m.priority === 'normal');

    tbody.innerHTML = list.map(m => {
      let badgeClass = 'normal';
      let badgeText = '안정';
      if (m.priority === 'urgent') {
        badgeClass = 'urgent';
        badgeText = '주의/급변';
      } else if (m.todayStatus === '미작성') {
        badgeClass = 'uncheck';
        badgeText = '미확인';
      }

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
        showToast(`${target?.name} 님의 기록을 24시간 내 확인 완료 처리하였습니다.`, 'success');
        recordAuditLog('김서연 (CP-001)', 'Care Partner', `${target?.name} (${memId})`, '데일리 상태 체크 확인 및 라운딩', '정기 라운딩 업무');
      });
    });
  }

  // Member Detail Selector (CP-02)
  document.getElementById('selPartnerMemberDetail')?.addEventListener('change', () => {
    renderPartnerMemberDetail();
  });

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

  // Care Note Form Submit (CP-03)
  document.getElementById('formCareNote')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const memId = document.getElementById('noteTargetMember')?.value || 'mem-1';
    const sessionTitle = document.getElementById('noteSessionTitle')?.value || '';
    const content = document.getElementById('txtNoteContent')?.value.trim() || '';
    const nextFocus = document.getElementById('noteNextFocus')?.value.trim() || '';
    const needFollowup = document.getElementById('noteNeedFollowup')?.value || 'no';

    const targetMem = state.partnerMembers.find(m => m.id === memId) || { name: '김회원' };

    state.careNotes.unshift({
      id: `note-${Date.now()}`,
      memberId: memId,
      memberName: targetMem.name,
      sessionTitle,
      date: '2026.09.01 21:00',
      content,
      nextFocus: nextFocus || '신체 이완 및 규칙적 수면 유지',
      partnerName: '김서연 파트너'
    });

    if (needFollowup === 'yes') {
      state.followups.unshift({
        id: `fl-${Date.now()}`,
        memberId: memId,
        memberName: targetMem.name,
        reason: `[세션 후속] ${nextFocus || '안부 확인'}`,
        dueDate: '2026.09.02',
        status: 'pending',
        partnerName: '김서연 파트너'
      });
    }

    saveState();
    recordAuditLog('김서연 (CP-001)', 'Care Partner', `${targetMem.name} (${memId})`, '세션 케어 노트 작성 및 저장', '세션 후 관찰 기록');
    showToast('케어 노트가 안전하게 저장되었으며 감사 로그에 기록되었습니다.', 'success');
    if (document.getElementById('txtNoteContent')) document.getElementById('txtNoteContent').value = '';
    renderPartnerView();
  });

  // Follow-up Queue Table (CP-04)
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
        saveState();
        showToast('후속 안부 확인 처리가 완료되었습니다.', 'success');
        renderPartnerFollowupTable();
      });
    });
  }

  // ==========================================
  // 7. ADMIN OPERATIONS CONSOLE (AD-01 ~ AD-03)
  // ==========================================
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
    renderAdminLiveStream();
    renderAdminMemberTable();
    renderAdminTestimonialReview();
    renderAuditLogs();
  }

  function renderAdminLiveStream() {
    const stream = document.getElementById('adminLiveActivityStream');
    if (!stream) return;

    stream.innerHTML = `
      <div class="stream-item">
        <span><strong>김회원 (mem-1)</strong> 오늘 데일리 상태 체크 제출 완료</span>
        <small style="color:#94A3B8;">방금 전</small>
      </div>
      <div class="stream-item">
        <span><strong>이영희 (mem-2)</strong> 상태 체크 미작성 알림톡 발송 완료</span>
        <small style="color:#94A3B8;">10분 전</small>
      </div>
      <div class="stream-item">
        <span><strong>김서연 파트너</strong> 박철수 회원 케어 노트 작성 및 승인</span>
        <small style="color:#94A3B8;">35분 전</small>
      </div>
    `;
  }

  // Invite Form (AD-01)
  document.getElementById('formSendInvite')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inviteTargetName')?.value.trim() || '';
    const contact = document.getElementById('inviteTargetContact')?.value.trim() || '';
    const partner = document.getElementById('inviteAssignPartner')?.value || '김서연 파트너';

    const newCode = `RC-2026-${Math.floor(1000 + Math.random()*9000)}`;

    state.partnerMembers.push({
      id: `mem-${state.partnerMembers.length + 1}`,
      name,
      grade: 'Standard',
      todayStatus: '미작성',
      condition: 3,
      sleep: 3,
      discomfort: 0,
      priority: 'uncheck',
      lastMemo: '신규 초대 가입 대기'
    });

    saveState();
    recordAuditLog('운영관리자 (AD-001)', 'Admin', `${name} (${contact})`, `신규 회원 초대장 및 코드 발송 (${newCode})`, '신규 가입 유치');
    showToast(`초대 코드 [${newCode}]가 ${name} 님께 발송되었습니다.`, 'success');
    if (document.getElementById('inviteTargetName')) document.getElementById('inviteTargetName').value = '';
    if (document.getElementById('inviteTargetContact')) document.getElementById('inviteTargetContact').value = '';
    renderAdminView();
  });

  // Admin Member Table (AD-02)
  function renderAdminMemberTable() {
    const tbody = document.getElementById('adminMemberTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.partnerMembers.map(m => `
      <tr>
        <td><code>${m.id}</code></td>
        <td><strong>${m.name}</strong></td>
        <td>010-****-1234</td>
        <td>김서연 파트너</td>
        <td><span class="badge-active">${m.grade} 활성</span></td>
        <td>2026.11.01</td>
        <td><span class="badge-success">민감정보 동의완료</span></td>
        <td>
          <button class="btn btn-sm btn-outline btn-extend-membership" data-name="${m.name}"><i class="fa-solid fa-calendar-plus"></i> 기간연장</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-extend-membership').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        showToast(`${name} 님의 회원권 기간이 30일 연장되었습니다.`, 'success');
        recordAuditLog('운영관리자 (AD-001)', 'Admin', name, '회원권 기간 30일 수동 연장', '멤버십 갱신');
      });
    });
  }

  // Admin Testimonial Review (AD-03)
  function renderAdminTestimonialReview() {
    const tbody = document.getElementById('adminTestimonialReviewBody');
    if (!tbody) return;

    tbody.innerHTML = state.testimonials.map(t => `
      <tr>
        <td><strong>${t.authorName}</strong></td>
        <td style="max-width:280px; font-size:12px;">"${t.body}"</td>
        <td><span class="t-area-badge">${t.area}</span></td>
        <td>${t.publicAgreed ? '<span class="text-success"><i class="fa-solid fa-check"></i> 동의함</span>' : '<span class="text-danger">미동의</span>'}</td>
        <td>
          ${t.approved 
            ? '<span class="badge-success"><i class="fa-solid fa-check-double"></i> 공개 게시중</span>' 
            : `<button class="btn btn-sm btn-primary btn-approve-testi" data-t-id="${t.id}"><i class="fa-solid fa-stamp"></i> 의료법 검토 승인</button>`}
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-approve-testi').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-t-id');
        const target = state.testimonials.find(x => x.id === id);
        if (target) {
          target.approved = true;
          saveState();
          recordAuditLog('운영관리자 (AD-001)', 'Admin', `${target.authorName} 체험담`, '체험담 의료법 검토 및 공식 게시 승인', '체험담 심의 절차 준수');
          showToast('체험담이 승인되어 공개 소개 페이지에 즉시 노출됩니다.', 'success');
          renderAdminTestimonialReview();
          renderPublicView();
        }
      });
    });
  }

  // Render Audit Logs (AD-03)
  function renderAuditLogs() {
    const tbody = document.getElementById('adminAuditLogBody');
    if (!tbody) return;

    tbody.innerHTML = state.auditLogs.map(l => `
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

  // ==========================================
  // 8. APP INITIALIZATION
  // ==========================================
  switchRole('member');

})();
