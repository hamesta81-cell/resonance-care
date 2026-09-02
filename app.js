/**
 * RESONANCE CARE V2 - MASTERPIECE LUXURY LOGIC
 * Includes Interactive Stardust Particle Engine, Central Server Sync,
 * Supabase Cloud PostgreSQL, Google Stitch Ultra-Luxury Integration.
 */

(function() {
  'use strict';

  // ==========================================
  // INTERACTIVE AMBIENT LUXURY CANVAS ENGINE
  // ==========================================
  function initAmbientLuxuryCanvas() {
    const canvas = document.getElementById('ambientLuxuryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;
    const colors = ['rgba(245, 158, 11, ', 'rgba(16, 185, 129, ', 'rgba(139, 92, 246, '];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Deep space radial mesh
      const bgGrad1 = ctx.createRadialGradient(width * 0.2, height * 0.15, 50, width * 0.2, height * 0.15, 600);
      bgGrad1.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      bgGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad1;
      ctx.fillRect(0, 0, width, height);

      const bgGrad2 = ctx.createRadialGradient(width * 0.8, height * 0.3, 50, width * 0.8, height * 0.3, 550);
      bgGrad2.addColorStop(0, 'rgba(16, 185, 129, 0.09)');
      bgGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad2;
      ctx.fillRect(0, 0, width, height);

      // Render stardust
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseAngle += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion / attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.8;
          p.y -= (dy / dist) * 0.8;
        }

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulseAngle) * 0.25);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + currentAlpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.colorBase + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  const AUTH_KEY = 'resonance_auth_user_v2';
  const DATA_KEY_PREFIX = 'resonance_v2_data_';
  const SUPABASE_CONFIG_KEY = 'resonance_supabase_config';

  // Default Auto-Connected Supabase Project
  const DEFAULT_SUPABASE_CONFIG = {
    url: 'https://tdetsnkdclgaktsoiujq.supabase.co',
    key: 'sb_publishable_jvZZbSYP7NPomropNjHiug_cJMTcUw2'
  };

  // Supabase Client Helper
  function getSupabaseClient() {
    try {
      let config = DEFAULT_SUPABASE_CONFIG;
      const configStr = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (configStr) {
        const custom = JSON.parse(configStr);
        if (custom.url && custom.key) config = custom;
      }
      if (config.url && config.key && window.supabase) {
        return window.supabase.createClient(config.url, config.key);
      }
    } catch(e) {}
    return null;
  }

  async function syncToSupabase(user, data) {
    const client = getSupabaseClient();
    if (!client || !user || !data) return;

    try {
      // 1. Sync User
      await client.from('users').upsert({
        id: user.id,
        name: user.name,
        phone: user.phone || '',
        invite_code: user.inviteCode || '',
        grade: user.grade || 'VIP',
        assigned_partner: user.assignedPartner || '김복선 치유사'
      });

      // 2. Sync Checkins
      if (data.checkins && data.checkins.length > 0) {
        const checkinRows = data.checkins.map(c => ({
          id: c.id,
          user_id: user.id,
          date: c.date,
          condition: c.condition,
          sleep: c.sleep,
          mind: c.mind,
          discomfort: c.discomfort,
          memo: c.memo || '',
          submitted_at: c.submittedAt || ''
        }));
        await client.from('checkins').upsert(checkinRows);
      }

      // 3. Sync Care Plan Tasks
      if (data.carePlanTasks && data.carePlanTasks.length > 0) {
        const taskRows = data.carePlanTasks.map(t => ({
          id: `${user.id}_${t.id}`,
          user_id: user.id,
          task_id: t.id,
          title: t.title,
          completed: !!t.completed,
          updated_at: new Date().toISOString()
        }));
        await client.from('care_plan_tasks').upsert(taskRows);
      }

      // 4. Sync Messages
      if (data.messages && data.messages.length > 0) {
        const msgRows = data.messages.map((m, idx) => ({
          id: `${user.id}_msg_${idx}`,
          user_id: user.id,
          sender: m.sender,
          text: m.text,
          time: m.time || ''
        }));
        await client.from('messages').upsert(msgRows);
      }

      // 5. Sync Community Posts (커뮤니티 안부 글 영구 보존)
      if (data.communityPosts && data.communityPosts.length > 0) {
        const postRows = data.communityPosts.map(p => ({
          id: p.id,
          user_id: user.id,
          author: p.author,
          category: p.category,
          content: p.content,
          likes: p.likes || 0
        }));
        await client.from('community_posts').upsert(postRows);
      }

      // 6. Central Serverless Cloud API Sync (서버 실시간 영구 저장 & 멀티 디바이스 공유)
      await syncToCentralServer(user, data);

      updateCloudBadge(true);
    } catch(err) {
      console.warn('Sync warning:', err);
    }
  }

  // Central Serverless API Handlers
  async function syncToCentralServer(user, data, newPost = null) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, userData: data, newPost })
      });
    } catch(e) {
      console.warn('Central server sync note:', e);
    }
  }

  async function loadCentralServerData() {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const result = await res.json();
        if (result.communityPosts && userData) {
          // Merge server community posts with local
          const localPostIds = new Set(userData.communityPosts.map(p => p.id));
          result.communityPosts.forEach(sp => {
            if (!localPostIds.has(sp.id)) {
              userData.communityPosts.unshift(sp);
            }
          });
          renderCommunityFeed();
        }
      }
    } catch(e) {}
  }

  function updateCloudBadge(isSynced = false) {
    const icon = document.getElementById('iconCloudSync');
    const lbl = document.getElementById('lblCloudSyncStatus');
    const client = getSupabaseClient();

    if (!lbl || !icon) return;

    if (client) {
      icon.className = 'fa-solid fa-cloud-check text-success';
      lbl.textContent = isSynced ? '클라우드 동기화됨' : 'Supabase 연결됨';
    } else {
      icon.className = 'fa-solid fa-cloud';
      lbl.textContent = '로컬 보관중';
    }
  }

  // 1. Traditional Herbs Dictionary Data (KN-02)
  const HERBS_DATABASE = [
    {
      id: 'herb_dangui',
      name: '당귀 (當歸)',
      category: '보혈 & 순환 원료',
      temperament: '따뜻함(溫)',
      desc: "'마땅히 제자리로 돌아온다'는 유래를 가진 전통 원료로, 혈액 순환을 돕고 손발을 따뜻하게 북돋우는 데 도움을 줍니다.",
      tags: ['성미: 따뜻함', '혈액 순환', '여성 웰니스'],
      caution: '몸에 열이 많거나 급성 소화불량이 있을 때는 전문가 상담 후 음용하세요.'
    },
    {
      id: 'herb_hwanggi',
      name: '황기 (黃芪)',
      category: '기력 & 활력 원료',
      temperament: '약간 따뜻함(微溫)',
      desc: "피로가 누적되었을 때 땀을 조절하고 몸의 기초 활력을 돋워주는 대표적인 기력 보강 원료입니다.",
      tags: ['성미: 미온', '피로 회복', '기초 활력'],
      caution: '감기로 인한 고열이 지속될 때는 섭취를 일시 중단하세요.'
    },
    {
      id: 'herb_bokbunja',
      name: '복분자 (覆盆子)',
      category: '항산화 & 신장 웰니스',
      temperament: '평이함(平)',
      desc: "풍부한 안토시아닌과 폴리페놀을 함유하여 활성산소를 억제하고 기운을 북돋워 줍니다.",
      tags: ['성미: 평이', '항산화', '활력 충전'],
      caution: '과다 섭취 시 속쓰림이 발생할 수 있으니 적정량을 지켜주세요.'
    },
    {
      id: 'herb_jagyak',
      name: '작약 (芍藥)',
      category: '근육 이완 & 진정',
      temperament: '약간 서늘함(微寒)',
      desc: "긴장된 근육의 뻐근함을 풀어주고 마음을 차분하게 가라앉히는 데 탁월한 전통 초본입니다.",
      tags: ['성미: 미한', '근육 이완', '스트레스 완화'],
      caution: '평소 속이 차고 설사가 잦은 분은 따뜻한 차와 함께 드세요.'
    },
    {
      id: 'herb_sansuyu',
      name: '산수유 (山茱萸)',
      category: '수렴 & 체력 유지',
      temperament: '약간 따뜻함(微溫)',
      desc: "봄을 알리는 붉은 열매로, 지친 몸의 기운이 흩어지지 않도록 단단히 모아주는 역할을 합니다.",
      tags: ['성미: 미온', '체력 증진', '자양 웰니스'],
      caution: '위산 분비가 많은 경우 식후에 음용하는 것을 권장합니다.'
    },
    {
      id: 'herb_gugija',
      name: '구기자 (枸杞子)',
      category: '눈 건강 & 자양강장',
      temperament: '평이함(平)',
      desc: "베타인과 비타민이 풍부하여 컴퓨터 업무가 많은 현대인의 눈 피로와 간 건강을 돕습니다.",
      tags: ['성미: 평이', '눈 피로 완화', '수면 안정'],
      caution: '특별한 부작용 없이 남녀노소 편안하게 즐길 수 있는 원료입니다.'
    }
  ];

  // 2. Default Initial Community Posts (CM-01)
  const INITIAL_COMMUNITY_POSTS = [
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
  ];

  // State Management
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

    // Clean initial state for V2 user
    return {
      userId,
      checkins: [],
      todayCheckedIn: false,
      todayCheckinData: null,
      carePlanTasks: [
        { id: 'task_1', title: '아침 공복 미온수 300ml 섭취', desc: '밤새 끈적해진 혈액 순환 및 장 활성화', completed: true },
        { id: 'task_2', title: '오후 3시 목/어깨 이완 호흡 5분', desc: '긴장된 상체 근육 스트레칭 및 심호흡', completed: true },
        { id: 'task_3', title: '취침 1시간 전 스마트폰 끄기', desc: '멜라토닌 분비 촉진 및 깊은 수면 유도', completed: false }
      ],
      wallet: {
        credit: 50000,
        careboxClaimed: false,
        careboxAddress: '',
        invitePassCount: 2
      },
      communityPosts: [...INITIAL_COMMUNITY_POSTS],
      messages: [
        {
          sender: 'partner',
          text: `안녕하세요 ${currentUser?.name || '회원'}님! 리조넌스 케어 전담 김복선 치유사입니다. 오늘 몸과 마음의 상태를 편안하게 기록해 주시면 맞춤 케어 플랜을 함께 안내해 드리겠습니다.`,
          time: '가입 환영'
        }
      ],
      profile: {
        sleepPattern: '하루 7시간 내외',
        discomfortAreas: '목/어깨',
        goal: '만성 피로 완화 및 숙면'
      }
    };
  }

  function saveUserData() {
    if (!currentUser || !userData) return;
    try {
      localStorage.setItem(DATA_KEY_PREFIX + currentUser.id, JSON.stringify(userData));
      // Background Sync to Supabase
      syncToSupabase(currentUser, userData);
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
    showToast(`환영합니다, ${name} 님! V2 프라이빗 회원 가입이 완료되었습니다.`, 'success');
  });

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

  document.getElementById('btnNavLogout')?.addEventListener('click', () => {
    saveAuth(null);
    showToast('안전하게 로그아웃되었습니다.', 'info');
  });

  // Nav Buttons
  document.getElementById('btnNavJoin')?.addEventListener('click', () => openModal('modalJoin'));
  document.getElementById('btnNavLogin')?.addEventListener('click', () => openModal('modalLogin'));
  document.getElementById('btnHeroJoin')?.addEventListener('click', () => openModal('modalJoin'));
  document.getElementById('btnHeroLogin')?.addEventListener('click', () => openModal('modalLogin'));
  document.getElementById('btnGoHome')?.addEventListener('click', () => {
    showPage('page-public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // V2 FEATURE 1: MB-12 DAILY CHECKIN (WITH DRAFT AUTO-SAVE)
  // ==========================================
  const txtCheckinMemo = document.getElementById('txtCheckinMemo');
  txtCheckinMemo?.addEventListener('input', () => {
    localStorage.setItem('resonance_draft_memo', txtCheckinMemo.value);
  });

  document.getElementById('btnOpenCheckinModal')?.addEventListener('click', () => {
    if (!currentUser) { openModal('modalLogin'); return; }
    // Restore draft memo if exists
    const draft = localStorage.getItem('resonance_draft_memo');
    if (draft && txtCheckinMemo && !txtCheckinMemo.value) {
      txtCheckinMemo.value = draft;
    }
    openModal('modalCheckin');
  });

  document.getElementById('formCheckin')?.addEventListener('submit', (e) => {
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
    const memo = txtCheckinMemo?.value.trim() || '';

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

    // Clear Draft on success
    localStorage.removeItem('resonance_draft_memo');
    saveUserData();
    closeModal('modalCheckin');
    showToast('오늘의 상태 체크가 영구 저장 및 김복선 치유사에게 전송되었습니다!', 'success');
    renderMemberView();
  });

  // ==========================================
  // V2 FEATURE 2: MB-13 7-DAY CARE PLAN TASK TOGGLE
  // ==========================================
  function renderCarePlanTasks() {
    const container = document.getElementById('planTaskListContainer');
    const progressLbl = document.getElementById('lblPlanProgressText');
    if (!container || !userData) return;

    const tasks = userData.carePlanTasks || [];
    const completedCount = tasks.filter(t => t.completed).length;
    const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    if (progressLbl) {
      progressLbl.textContent = `${completedCount} / ${tasks.length} 실천 완료 (${percent}%)`;
    }

    container.innerHTML = tasks.map(task => `
      <div class="plan-task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-info">
          <span class="task-title">${task.title}</span>
          <span class="task-desc">${task.desc}</span>
        </div>
        <button type="button" class="task-toggle-btn" title="실천 완료 토글">
          <i class="fa-solid ${task.completed ? 'fa-check' : 'fa-circle'}"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.plan-task-item').forEach(el => {
      el.addEventListener('click', () => {
        const taskId = el.getAttribute('data-task-id');
        const target = userData.carePlanTasks.find(t => t.id === taskId);
        if (target) {
          target.completed = !target.completed;
          saveUserData();
          renderCarePlanTasks();
          showToast(target.completed ? `"${target.title}" 실천 완료!` : `실천 상태 취소됨`, 'success');
        }
      });
    });
  }

  // ==========================================
  // V2 FEATURE 3: MB-15 VIP BENEFIT WALLET & CAREBOX
  // ==========================================
  document.getElementById('btnClaimCarebox')?.addEventListener('click', () => {
    if (!currentUser || !userData) return;
    if (userData.wallet.careboxClaimed) {
      showToast('이미 이번 시즌 케어박스 신청이 완료되었습니다.', 'info');
      return;
    }
    const nameInput = document.getElementById('careboxRecipientName');
    const phoneInput = document.getElementById('careboxRecipientPhone');
    if (nameInput) nameInput.value = currentUser.name;
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    openModal('modalCarebox');
  });

  document.getElementById('formCarebox')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser || !userData) return;

    const address = document.getElementById('careboxRecipientAddress')?.value.trim();
    if (!address) return;

    userData.wallet.careboxClaimed = true;
    userData.wallet.careboxAddress = address;
    saveUserData();
    closeModal('modalCarebox');
    showToast('2026 가을 웰니스 케어박스 무료 신청이 완료되었습니다! (배송 준비중)', 'success');
    renderMemberView();
  });

  document.getElementById('btnGenerateInvitePass')?.addEventListener('click', () => {
    const code = `RC-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
    navigator.clipboard?.writeText(code);
    alert(`[지인 초대권 발급]\n초대 코드: ${code}\n\n초대 코드가 클립보드에 복사되었습니다! 지인에게 공유하여 프라이빗 회원 가입을 선물하세요.`);
    showToast('지인 초대 코드가 클립보드에 복사되었습니다.', 'success');
  });

  document.getElementById('btnDownloadMyData')?.addEventListener('click', () => {
    if (!userData) return;
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resonance_care_mydata_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast('내 건강 기록 데이터가 안전하게 다운로드되었습니다.', 'success');
  });

  // ==========================================
  // V2 FEATURE 4: CM-01 COMMUNITY FEED & POSTING
  // ==========================================
  let currentCommFilter = 'all';

  document.querySelectorAll('.comm-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.comm-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCommFilter = btn.getAttribute('data-filter');
      renderCommunityFeed();
    });
  });

  const txtPostContent = document.getElementById('txtPostContent');
  txtPostContent?.addEventListener('input', () => {
    localStorage.setItem('resonance_draft_post', txtPostContent.value);
  });

  document.getElementById('btnOpenNewPostModal')?.addEventListener('click', () => {
    if (!currentUser) { openModal('modalLogin'); return; }
    const draft = localStorage.getItem('resonance_draft_post');
    if (draft && txtPostContent && !txtPostContent.value) {
      txtPostContent.value = draft;
    }
    openModal('modalNewPost');
  });

  document.getElementById('formNewPost')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser || !userData) return;

    const category = document.getElementById('postCategorySelect')?.value || 'lounge';
    const content = txtPostContent?.value.trim();
    if (!content) return;

    const newPost = {
      id: `post_${Date.now()}`,
      author: `${currentUser.name} (VIP)`,
      isOfficial: false,
      category,
      content,
      time: '방금 전',
      likes: 0,
      isLiked: false
    };

    userData.communityPosts.unshift(newPost);
    localStorage.removeItem('resonance_draft_post');
    saveUserData();
    // Central Server Sync
    syncToCentralServer(currentUser, userData, newPost);
    if (txtPostContent) txtPostContent.value = '';
    closeModal('modalNewPost');
    showToast('커뮤니티에 안부 글이 서버 및 로컬에 영구 저장되었습니다!', 'success');
    renderCommunityFeed();
  });

  function renderCommunityFeed() {
    const list = document.getElementById('communityFeedList');
    if (!list || !userData) return;

    const posts = userData.communityPosts || [];
    const filtered = currentCommFilter === 'all' 
      ? posts 
      : posts.filter(p => p.category === currentCommFilter);

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state-box"><h4>등록된 글이 없습니다.</h4><p>첫 번째 안부 글을 작성해 보세요!</p></div>`;
      return;
    }

    list.innerHTML = filtered.map(post => `
      <div class="comm-post-card">
        <div class="post-head">
          <span class="post-author">${post.author} ${post.isOfficial ? '<span class="tag-badge">공식</span>' : ''}</span>
          <span class="post-category-tag">${post.category === 'notice' ? '공지' : post.category === 'group' ? '수면개선 소그룹' : '체험후기'} · ${post.time}</span>
        </div>
        <p class="post-content">${post.content}</p>
        <div class="post-actions">
          <button type="button" class="post-like-btn ${post.isLiked ? 'liked' : ''}" data-post-id="${post.id}">
            <i class="fa-${post.isLiked ? 'solid' : 'regular'} fa-heart"></i> <span>공감 ${post.likes}</span>
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.post-like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-post-id');
        const post = userData.communityPosts.find(p => p.id === pId);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes += post.isLiked ? 1 : -1;
          saveUserData();
          renderCommunityFeed();
        }
      });
    });
  }

  // ==========================================
  // V2 FEATURE 5: KN-02 TRADITIONAL HERBS DICTIONARY
  // ==========================================
  function renderHerbsDictionary() {
    const container = document.getElementById('herbsGridContainer');
    if (!container) return;

    container.innerHTML = HERBS_DATABASE.map(herb => `
      <div class="herb-card" data-herb-id="${herb.id}">
        <h5>${herb.name} <small>${herb.temperament}</small></h5>
        <p>${herb.desc.slice(0, 48)}...</p>
      </div>
    `).join('');

    container.querySelectorAll('.herb-card').forEach(card => {
      card.addEventListener('click', () => {
        const herbId = card.getAttribute('data-herb-id');
        const herb = HERBS_DATABASE.find(h => h.id === herbId);
        if (herb) {
          document.getElementById('herbModalTitle').textContent = herb.name;
          document.getElementById('herbModalCategory').textContent = herb.category;
          document.getElementById('herbModalDesc').textContent = herb.desc;
          document.getElementById('herbModalCaution').textContent = herb.caution;
          const tagsEl = document.getElementById('herbModalTags');
          if (tagsEl) {
            tagsEl.innerHTML = herb.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
          }
          openModal('modalHerbDetail');
        }
      });
    });
  }

  // ==========================================
  // V2 FEATURE 6: 1:1 CHAT (김복선 치유사)
  // ==========================================
  document.getElementById('btnOpenDirectChat')?.addEventListener('click', () => {
    if (!currentUser) { openModal('modalLogin'); return; }
    openModal('modalDirectChat');
    renderChat();
  });

  // ==========================================
  // YOUTUBE LIVE STREAMING HANDLERS
  // ==========================================
  const YOUTUBE_STREAM_STORAGE_KEY = 'resonance_youtube_live_url';
  const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/@Resonance2026-e7c';
  
  document.getElementById('btnOpenYoutubeLive')?.addEventListener('click', () => {
    const savedUrl = localStorage.getItem(YOUTUBE_STREAM_STORAGE_KEY) || DEFAULT_YOUTUBE_URL;
    const input = document.getElementById('inputYoutubeStreamUrl');
    const iframe = document.getElementById('youtubeLiveFrame');
    const externalBtn = document.getElementById('btnOpenYoutubeExternal');

    if (input) input.value = savedUrl;
    if (externalBtn) externalBtn.href = savedUrl;

    if (iframe) {
      let embedUrl = 'https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_BQ5Azg';
      if (savedUrl.includes('watch?v=')) {
        const vId = savedUrl.split('watch?v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1`;
      } else if (savedUrl.includes('youtu.be/')) {
        const vId = savedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1`;
      }
      iframe.src = embedUrl;
    }
    openModal('modalYoutubeLive');
  });

  document.getElementById('btnUpdateYoutubeUrl')?.addEventListener('click', () => {
    const input = document.getElementById('inputYoutubeStreamUrl');
    const newUrl = input?.value.trim();
    if (!newUrl) return;

    localStorage.setItem(YOUTUBE_STREAM_STORAGE_KEY, newUrl);
    const iframe = document.getElementById('youtubeLiveFrame');
    const externalBtn = document.getElementById('btnOpenYoutubeExternal');

    let embedUrl = newUrl;
    if (newUrl.includes('watch?v=')) {
      const vId = newUrl.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1`;
    } else if (newUrl.includes('youtu.be/')) {
      const vId = newUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1`;
    }
    if (iframe) iframe.src = embedUrl;
    if (externalBtn) externalBtn.href = newUrl;

    showToast('유튜브 생중계 스트림 주소가 성공적으로 변경되었습니다!', 'success');
  });

  document.getElementById('btnJoinLiveSession')?.addEventListener('click', () => {
    alert('[원격 치유 세션 안내]\n오늘 20:00 저녁 웰니스 호흡 & 이완 세션 룸이 19:50에 개설됩니다. (김복선 치유사 진행)');
  });

  document.getElementById('btnOpenSessionModal')?.addEventListener('click', () => {
    alert('[세션 예약 관리]\n보유 세션 이용권: 잔여 4회\n다음 예약 가능 일정: 매주 화/목 20:00 (김복선 치유사)');
  });

  async function handleSendChat() {
    if (!currentUser || !userData) return;
    const input = document.getElementById('inputChatMsg');
    const text = input?.value.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    userData.messages.push({ sender: 'member', text, time: timeStr });
    input.value = '';
    renderChat();
    saveUserData();

    // Responsive feedback from 김복선 치유사
    setTimeout(() => {
      userData.messages.push({
        sender: 'partner',
        text: `${currentUser.name}님, 남겨주신 말씀 확인했습니다. ("${text}") 오늘 컨디션 관리 및 저녁 세션에 세심하게 참고하겠습니다.`,
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

  // 5 Main Tabs
  const mTabBtns = document.querySelectorAll('.m-tab-btn');
  const mTabContents = document.querySelectorAll('.m-tab-content');

  mTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      mTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mTabContents.forEach(c => c.classList.toggle('active', c.id === target));
      
      if (target === 'm-tab-timeline') renderReportChart();
      if (target === 'm-tab-community') renderCommunityFeed();
      if (target === 'm-tab-knowledge') {
        renderHerbsDictionary();
        renderAcupoints();
      }
    });
  });

  function renderMemberView() {
    if (!currentUser || !userData) return;

    // Greeting
    const gName = document.getElementById('mbGreetingName');
    const gPartner = document.getElementById('mbGreetingPartner');
    if (gName) gName.textContent = `${currentUser.name} 님`;
    if (gPartner) gPartner.textContent = `전담 케어: 김복선 치유사 배정됨`;

    // Today Checkin Status
    const tag = document.getElementById('lblTodayStatusTag');
    const btnText = document.getElementById('lblBtnCheckinText');
    const ackTitle = document.getElementById('lblPartnerAckTitle');
    const ackText = document.getElementById('lblPartnerAckText');

    if (userData.todayCheckedIn && userData.todayCheckinData) {
      if (tag) { tag.className = 'check-status-tag done'; tag.textContent = '작성완료'; }
      if (btnText) btnText.textContent = '오늘 상태 체크 수정하기';
      if (ackTitle) ackTitle.textContent = '오늘 기록 확인 진행중';
      if (ackText) ackText.textContent = `오늘 ${userData.todayCheckinData.submittedAt || ''}에 기록을 완료하셨습니다. 김복선 치유사가 세심하게 확인합니다.`;
    } else {
      if (tag) { tag.className = 'check-status-tag'; tag.textContent = '미작성'; }
      if (btnText) btnText.textContent = '지금 상태 체크 작성하기';
      if (ackTitle) ackTitle.textContent = '김복선 치유사 케어 브리핑';
      if (ackText) ackText.textContent = '오늘의 상태 체크를 남기시면 맞춤 일일 생활 피드백이 브리핑됩니다.';
    }

    // VIP Wallet Status
    const topCredit = document.getElementById('mbTopCreditBadge');
    const walletCredit = document.getElementById('lblWalletCreditVal');
    const walletUser = document.getElementById('lblWalletUserName');
    const careboxStatus = document.getElementById('lblCareboxStatusText');

    if (topCredit) topCredit.innerHTML = `<i class="fa-solid fa-coins"></i> ${userData.wallet.credit.toLocaleString()} P`;
    if (walletCredit) walletCredit.textContent = `${userData.wallet.credit.toLocaleString()} P`;
    if (walletUser) walletUser.textContent = `${currentUser.name} 님의 케어 지갑`;
    if (careboxStatus) {
      if (userData.wallet.careboxClaimed) {
        careboxStatus.textContent = '신청 완료 (배송 준비중)';
        careboxStatus.className = 'text-gold';
      } else {
        careboxStatus.textContent = '신청 가능 (1회)';
        careboxStatus.className = 'text-success';
      }
    }

    renderCarePlanTasks();
    renderTimeline();
    renderHerbsDictionary();
    renderAcupoints();
  }

  function renderTimeline() {
    const container = document.getElementById('timelineFeedContainer');
    if (!container || !userData) return;

    if (!userData.checkins || userData.checkins.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-regular fa-clipboard"></i>
          <h4>아직 등록된 건강 상태 기록이 없습니다.</h4>
          <p>첫 번째 1분 상태 체크를 작성하시면 일별 기록 카드가 누적됩니다.</p>
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

    const padding = 32;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    // Grid (1~5)
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
      ctx.fillText(`${score}점`, 6, y + 4);
    }

    if (recent.length === 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px Pretendard';
      ctx.textAlign = 'center';
      ctx.fillText('상태 체크를 등록하시면 실시간 추이 그래프가 나타납니다.', w / 2, h / 2);
      return;
    }

    const step = recent.length === 1 ? chartW : chartW / (recent.length - 1);

    // Line
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

    // Points
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
      ctx.fillText(item.date.slice(5), x, h - 8);
    });
  }

  // ==========================================
  // MERIDIAN & ACUPOINTS SANCTUARY LOGIC (KN-03)
  // ==========================================
  const ACUPOINTS_DATA = [
    {
      id: 'acu_1',
      name: '합곡혈',
      hanja: '合谷穴',
      meridian: '수양명대장경 (LI4)',
      location: '엄지손가락과 둘째손가락 사이의 뼈가 만나는 V자 오목한 곳',
      effects: '체기 및 소화불량 즉각 완화, 긴장성 두통, 눈 피로, 얼굴 부종 및 전신 기혈 순환 촉진',
      method: [
        '1. 반대쪽 엄지손가락으로 뼈 안쪽을 향해 45도 각도로 깊숙이 댑니다.',
        '2. 숨을 천천히 내쉬며 3~5초간 묵직한 자극이 느껴지도록 지그시 누릅니다.',
        '3. 숨을 들이마시며 2초간 힘을 빼고, 양손 각각 10회씩 반복합니다.'
      ]
    },
    {
      id: 'acu_2',
      name: '내관혈',
      hanja: '內關穴',
      meridian: '수궐음심포경 (PC6)',
      location: '손바닥 안쪽 손목 주름 정중앙에서 팔꿈치 쪽으로 손가락 2마디(약 4~5cm) 위, 두 힘줄 사이',
      effects: '가슴 답답함, 심리적 불안 및 스트레스 완화, 불면증 해소, 멀미·입덧·소화기 구토 완화',
      method: [
        '1. 엄지손가락 끝으로 두 힘줄 사이의 오목한 부위를 수직으로 누릅니다.',
        '2. 가슴의 긴장을 풀며 4초간 깊게 숨을 들이쉬고, 누른 상태로 4초간 천천히 내쉽니다.',
        '3. 잠들기 전 1분간 양쪽 손목을 번갈아 지압하면 깊은 숙면에 도움을 줍니다.'
      ]
    },
    {
      id: 'acu_3',
      name: '족삼리',
      hanja: '足三里',
      meridian: '족양명위경 (ST36)',
      location: '무릎뼈 바깥쪽 아래 오목한 곳에서 손가락 4마디(약 3치) 아래, 정강이뼈 바깥쪽 근육 부위',
      effects: '전신 원기(元氣) 회복, 소화 흡수력 강화, 면역력 증진, 만성 피로 및 하체 무거움 해소',
      method: [
        '1. 의자에 편안히 앉아 엄지손가락이나 주먹으로 묵직하게 원을 그리며 누릅니다.',
        '2. 3초간 지그시 누르고 2초 쉬며 정강이 쪽으로 찌릿한 온기가 퍼지도록 자극합니다.',
        '3. 아침 기상 후 1분간 지압하면 하루의 활력을 깨우는 최고의 보양 혈자리입니다.'
      ]
    },
    {
      id: 'acu_4',
      name: '용천혈',
      hanja: '湧泉穴',
      meridian: '족소음신경 (KI1)',
      location: '발바닥을 오므렸을 때 가장 깊게 들어가는 중앙 상단 1/3 지점 (사람 인 \'ㅅ\'자 홈)',
      effects: '신장(腎) 기운 보양, 하지 부종 및 냉증 완화, 두통·상열감 완화, 깊은 숙면 유도',
      method: [
        '1. 양손 엄지손가락을 겹쳐 발바닥의 가장 깊은 홈을 강하게 밀어 올리듯 누릅니다.',
        '2. 따뜻한 온수 족욕 후 지압하거나, 골프공을 바닥에 두고 1분간 굴려주면 더욱 효과적입니다.',
        '3. 하루의 피로가 하체로 쏠려 발이 무겁고 잠이 안 올 때 즉각적인 안정을 줍니다.'
      ]
    },
    {
      id: 'acu_5',
      name: '풍지혈',
      hanja: '風池穴',
      meridian: '족소양담경 (GB20)',
      location: '뒷머리 뼈 아래, 목 뒤 양쪽 굵은 근육의 바깥쪽 오목하게 쏙 들어간 곳',
      effects: '목·어깨 만성 결림 해소, 뇌 혈류 개선으로 머리 맑아짐, 눈의 피로 및 안압 안정, 감기 기운 완화',
      method: [
        '1. 양손으로 머리를 감싸고 엄지손가락으로 뒷목의 오목한 부위를 위쪽(이마 방향)으로 밀어 올립니다.',
        '2. 머리를 살짝 뒤로 젖히며 5초간 지그시 압박 후 천천히 힘을 뺍니다.',
        '3. 모니터나 스마트폰을 오래 본 후 10회 반복하면 즉시 시야가 맑아집니다.'
      ]
    },
    {
      id: 'acu_6',
      name: '태충혈',
      hanja: '太衝穴',
      meridian: '족궐음간경 (LR3)',
      location: '엄지발가락과 둘째발가락 사이의 뼈가 만나는 지점 바로 앞 오목한 곳',
      effects: '간(肝)의 열기 해독, 스트레스성 홧병 및 긴장 완화, 혈압 안정, 근육 경련 및 생리통 완화',
      method: [
        '1. 엄지손가락으로 발가락 사이 뼈를 따라 쓸어 올리다가 뼈에 걸려 멈추는 곳을 찾습니다.',
        '2. 숨을 내쉬며 3초간 묵직한 통증이 기분 좋게 느껴질 정도로 누릅니다.',
        '3. 합곡혈과 함께 지압하면 한의학에서 말하는 사관(四關)이 열려 전신 기혈이 막힘없이 통합니다.'
      ]
    }
  ];

  function renderAcupoints() {
    const container = document.getElementById('acupointsGridContainer');
    if (!container) return;

    container.innerHTML = ACUPOINTS_DATA.map(acu => `
      <div class="acupoint-card" onclick="window.openAcupointModal('${acu.id}')">
        <div>
          <div class="acupoint-head">
            <div class="acupoint-name">${acu.name} <span class="acupoint-hanja">(${acu.hanja})</span></div>
            <span class="acupoint-meridian-badge">${acu.meridian.split(' ')[0]}</span>
          </div>
          <p class="acupoint-location"><i class="fa-solid fa-location-dot text-gold"></i> ${acu.location}</p>
          <div class="acupoint-effect-tag"><i class="fa-solid fa-sparkles text-primary"></i> ${acu.effects.split(',')[0]}...</div>
        </div>
        <div class="acupoint-action-link">
          <span>1분 자가 지압 가이드</span> <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    `).join('');
  }

  window.openAcupointModal = function(acuId) {
    const acu = ACUPOINTS_DATA.find(a => a.id === acuId);
    if (!acu) return;

    const title = document.getElementById('acupointModalTitle');
    const meridian = document.getElementById('acupointModalMeridian');
    const loc = document.getElementById('acupointModalLocation');
    const effects = document.getElementById('acupointModalEffects');
    const method = document.getElementById('acupointModalMethod');

    if (title) title.innerHTML = `<i class="fa-solid fa-hands-holding text-gold"></i> ${acu.name} (${acu.hanja})`;
    if (meridian) meridian.textContent = `소속 경락: ${acu.meridian} · 김복선 치유사 감수`;
    if (loc) loc.textContent = acu.location;
    if (effects) effects.textContent = acu.effects;
    if (method) {
      method.innerHTML = acu.method.map(m => `<p class="text-xs text-sub mb-1 leading-relaxed">${m}</p>`).join('');
    }

    openModal('modalAcupointDetail');
  };
  document.getElementById('btnOpenSupabaseModal')?.addEventListener('click', () => {
    const configStr = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (configStr) {
      try {
        const config = JSON.parse(configStr);
        if (config.url) document.getElementById('supabaseUrlInput').value = config.url;
        if (config.key) document.getElementById('supabaseKeyInput').value = config.key;
      } catch(e) {}
    }
    openModal('modalSupabase');
  });

  document.getElementById('formSupabaseConfig')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('supabaseUrlInput')?.value.trim();
    const key = document.getElementById('supabaseKeyInput')?.value.trim();

    if (!url || !key) {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
      updateCloudBadge(false);
      closeModal('modalSupabase');
      showToast('Supabase 연동이 해제되고 로컬 보관 모드로 전환되었습니다.', 'info');
      return;
    }

    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, key }));
    updateCloudBadge(true);
    closeModal('modalSupabase');
    showToast('Supabase 클라우드 DB 연동 정보가 안전하게 저장되었습니다!', 'success');

    if (currentUser && userData) {
      showToast('클라우드 DB 동기화를 진행 중입니다...', 'info');
      await syncToSupabase(currentUser, userData);
      showToast('클라우드 DB 실시간 동기화 완료! (데이터 유실 0%)', 'success');
    }
  });

  document.getElementById('btnTestSupabaseSync')?.addEventListener('click', async () => {
    if (!currentUser || !userData) {
      showToast('먼저 로그인 후 동기화를 진행해 주세요.', 'info');
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      showToast('Supabase URL 및 Anon Key를 먼저 입력해 주세요.', 'info');
      return;
    }
    showToast('클라우드 DB 동기화 진행중...', 'info');
    await syncToSupabase(currentUser, userData);
    showToast('클라우드 동기화 성공! 모든 기기에서 즉시 확인 가능합니다.', 'success');
  });

  // ==========================================
  // ADMIN CONSOLE & HEALER QUEUE CONTROLLER (AD-01~04, CP-01~04)
  // ==========================================
  let isAdminAuthenticated = false;
  const ADMIN_PASSWORDS = ['admin1234', 'resonance2026'];
  const ADMIN_INVITES_STORAGE_KEY = 'resonance_admin_invites';

  // Sample Baseline Members for Demo & Live Management
  const DEFAULT_MANAGED_MEMBERS = [
    {
      id: 'user_김회원_5678',
      name: '김회원',
      phone: '010-1234-5678',
      inviteCode: 'RC-2026-VIP',
      partner: '김복선 치유사',
      condition: '4점 (가뿐함)',
      lastCheckin: '오늘 09:30',
      compliance: '85%',
      careboxClaimed: true,
      checkins: [
        { date: '2026-09-02', condition: 4, sleep: 4, mind: 4, discomfort: 2, memo: '아침에 미온수를 마시니 몸이 가뿐합니다.', submittedAt: '09:30' },
        { date: '2026-09-01', condition: 3, sleep: 3, mind: 3, discomfort: 4, memo: '목 어깨가 조금 뻐근했습니다.', submittedAt: '21:10' }
      ],
      messages: [
        { sender: 'member', text: '치유사님, 오늘 목 어깨 스트레칭 호흡법 따라하니 한결 시원하네요!', time: '10:15' },
        { sender: 'partner', text: '김회원님 참 잘하셨습니다! 오늘 저녁 20시 세션에서도 이완 호흡 함께하겠습니다.', time: '10:20' }
      ]
    },
    {
      id: 'user_이서준_8888',
      name: '이서준',
      phone: '010-9999-8888',
      inviteCode: 'RC-VIP-8432',
      partner: '김복선 치유사',
      condition: '5점 (매우 상쾌)',
      lastCheckin: '오늘 08:20',
      compliance: '100%',
      careboxClaimed: true,
      checkins: [
        { date: '2026-09-02', condition: 5, sleep: 5, mind: 5, discomfort: 1, memo: '당귀 침출차 마시고 7시간 숙면 취했습니다.', submittedAt: '08:20' }
      ],
      messages: [
        { sender: 'partner', text: '이서준님, 수면 개선 목표가 순조롭게 달성되고 있습니다. 훌륭합니다.', time: '08:30' }
      ]
    },
    {
      id: 'user_박지현_3333',
      name: '박지현',
      phone: '010-7777-3333',
      inviteCode: 'RC-VIP-5512',
      partner: '김복선 치유사',
      condition: '3점 (보통)',
      lastCheckin: '어제 19:40',
      compliance: '67%',
      careboxClaimed: false,
      checkins: [
        { date: '2026-09-01', condition: 3, sleep: 4, mind: 3, discomfort: 3, memo: '가을 케어박스 신청 완료했습니다.', submittedAt: '19:40' }
      ],
      messages: []
    }
  ];

  function getAdminInvites() {
    try {
      const saved = localStorage.getItem(ADMIN_INVITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
      { code: 'RC-2026-VIP', target: '공식 마스터 초대권', partner: '김복선 치유사', status: '무제한 활성' },
      { code: 'RC-VIP-8432', target: '이서준 회원 초대', partner: '김복선 치유사', status: '사용 완료' },
      { code: 'RC-VIP-5512', target: '박지현 회원 초대', partner: '김복선 치유사', status: '사용 완료' }
    ];
  }

  function saveAdminInvites(invites) {
    localStorage.setItem(ADMIN_INVITES_STORAGE_KEY, JSON.stringify(invites));
  }

  document.getElementById('btnNavAdmin')?.addEventListener('click', () => {
    if (isAdminAuthenticated) {
      showAdminConsole();
    } else {
      openModal('modalAdminAuth');
    }
  });

  document.getElementById('formAdminAuth')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('inputAdminPassword')?.value.trim();
    if (ADMIN_PASSWORDS.includes(pass)) {
      isAdminAuthenticated = true;
      closeModal('modalAdminAuth');
      document.getElementById('inputAdminPassword').value = '';
      showToast('관리자 & 치유사 콘솔에 접속하였습니다.', 'success');
      showAdminConsole();
    } else {
      alert('비밀번호가 올바르지 않습니다. (기본 비밀번호: admin1234)');
    }
  });

  document.getElementById('btnAdminExit')?.addEventListener('click', () => {
    isAdminAuthenticated = false;
    renderApp();
    showToast('관리자 콘솔을 종료하였습니다.', 'info');
  });

  function showAdminConsole() {
    document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-admin')?.classList.add('active');
    renderAdminDashboard();
  }

  // Admin Sub Tabs Navigation
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-admin-tab');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  function renderAdminDashboard() {
    // 1. KPI Stats
    const totalMembersEl = document.getElementById('kpiTotalMembers');
    if (totalMembersEl) totalMembersEl.textContent = `${DEFAULT_MANAGED_MEMBERS.length}명`;

    // 2. Members Table
    const tbody = document.getElementById('adminMembersTableBody');
    if (tbody) {
      tbody.innerHTML = DEFAULT_MANAGED_MEMBERS.map(m => `
        <tr>
          <td><strong>${m.name}</strong> <span class="v2-pill">VIP</span></td>
          <td>${m.phone}</td>
          <td><code>${m.inviteCode}</code></td>
          <td><i class="fa-solid fa-user-doctor text-primary"></i> ${m.partner}</td>
          <td><span class="badge-active">${m.condition}</span></td>
          <td><small class="text-muted">${m.lastCheckin}</small></td>
          <td>
            <button class="btn btn-outline btn-xs" onclick="window.viewAdminMember('${m.id}')">
              <i class="fa-solid fa-magnifying-glass-chart"></i> 차트 상세
            </button>
          </td>
        </tr>
      `).join('');
    }

    // 3. Rounding Queue
    const queueList = document.getElementById('adminRoundingQueueList');
    if (queueList) {
      queueList.innerHTML = DEFAULT_MANAGED_MEMBERS.map(m => {
        const latestCheck = m.checkins[0];
        if (!latestCheck) return '';
        return `
          <div class="rounding-queue-card">
            <div class="rounding-header-flex">
              <div>
                <strong>${m.name} 님</strong> · <small class="text-muted">${latestCheck.date} ${latestCheck.submittedAt}</small>
                <span class="v2-pill ml-2">컨디션 ${latestCheck.condition}점</span>
              </div>
              <span class="badge-gold"><i class="fa-solid fa-bed"></i> 수면 ${latestCheck.sleep}점 / 마음 ${latestCheck.mind}점</span>
            </div>
            <div class="rounding-memo-quote">
              <i class="fa-solid fa-quote-left mr-1"></i> "${latestCheck.memo || '특이사항 없음'}"
            </div>
            <div class="rounding-reply-box">
              <input type="text" class="form-input text-xs" id="reply_input_${m.id}" placeholder="김복선 치유사 피드백 입력 (예: 따뜻한 차 음용과 이완 호흡 권장)...">
              <button class="btn btn-primary btn-xs" onclick="window.sendHealerReply('${m.id}')">
                <i class="fa-solid fa-paper-plane"></i> 피드백 전송
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 4. Invites List
    renderAdminInvitesTable();
  }

  function renderAdminInvitesTable() {
    const tbody = document.getElementById('adminInvitesTableBody');
    if (!tbody) return;
    const invites = getAdminInvites();
    tbody.innerHTML = invites.map(inv => `
      <tr>
        <td><code>${inv.code}</code></td>
        <td>${inv.target}</td>
        <td>${inv.partner}</td>
        <td><span class="${inv.status.includes('활성') ? 'badge-active' : 'tag-badge'}">${inv.status}</span></td>
        <td>
          <button class="btn btn-outline btn-xs" onclick="navigator.clipboard.writeText('${inv.code}'); alert('${inv.code} 코드가 클립보드에 복사되었습니다.');">
            <i class="fa-solid fa-copy"></i> 복사
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Window Global Helpers for Admin
  window.viewAdminMember = function(memberId) {
    const member = DEFAULT_MANAGED_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('admModalMemberName').innerHTML = `<i class="fa-solid fa-user-check text-primary"></i> ${member.name} 님 웰니스 종합 차트`;
    document.getElementById('admModalMemberMeta').textContent = `연락처: ${member.phone} · 전담: ${member.partner} · 초대코드: ${member.inviteCode}`;
    document.getElementById('admModalMemberPlanStatus').textContent = `7일 플랜 실천율: ${member.compliance} · 최근 컨디션: ${member.condition}`;

    const checkinList = document.getElementById('admModalMemberCheckins');
    if (checkinList) {
      checkinList.innerHTML = member.checkins.map(c => `
        <div class="timeline-item">
          <div class="timeline-date">${c.date} (${c.submittedAt})</div>
          <div class="timeline-content">
            <strong>컨디션 ${c.condition}점 · 수면 ${c.sleep}점 · 마음 ${c.mind}점 · 불편감 ${c.discomfort}점</strong>
            <p class="text-xs text-muted mt-1">"${c.memo}"</p>
          </div>
        </div>
      `).join('');
    }

    const msgList = document.getElementById('admModalMemberMessages');
    if (msgList) {
      msgList.innerHTML = member.messages.map(msg => `
        <div class="chat-msg-bubble ${msg.sender === 'partner' ? 'partner' : 'member'}">
          <div class="msg-author">${msg.sender === 'partner' ? '김복선 치유사' : member.name}</div>
          <div class="msg-text">${msg.text}</div>
          <div class="msg-time">${msg.time}</div>
        </div>
      `).join('') || '<div class="text-muted text-xs text-center py-3">주고받은 대화 내역이 없습니다.</div>';
    }

    openModal('modalAdminMemberDetail');
  };

  window.sendHealerReply = function(memberId) {
    const input = document.getElementById(`reply_input_${memberId}`);
    const text = input?.value.trim();
    if (!text) return;

    const member = DEFAULT_MANAGED_MEMBERS.find(m => m.id === memberId);
    if (member) {
      member.messages.push({
        sender: 'partner',
        text: `[김복선 치유사 피드백] ${text}`,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      });
      input.value = '';
      showToast(`${member.name} 님에게 김복선 치유사 피드백이 전송되었습니다!`, 'success');
    }
  };

  document.getElementById('btnAdminCreateInviteCode')?.addEventListener('click', () => {
    const target = document.getElementById('inputAdminInviteTarget')?.value.trim() || '신규 VIP 회원';
    const partner = document.getElementById('inputAdminInvitePartner')?.value.trim() || '김복선 치유사';
    const newCode = `RC-VIP-${Math.floor(1000 + Math.random() * 9000)}`;

    const invites = getAdminInvites();
    invites.unshift({ code: newCode, target, partner, status: '발급 활성' });
    saveAdminInvites(invites);
    renderAdminInvitesTable();

    document.getElementById('inputAdminInviteTarget').value = '';
    showToast(`새 VIP 초대 코드 [${newCode}] 가 정상 발급되었습니다!`, 'success');
  });

  document.getElementById('formAdminOfficialNotice')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('inputAdminNoticeContent')?.value.trim();
    if (!content) return;

    const newNotice = {
      id: `notice_${Date.now()}`,
      author: '김복선 치유사',
      isOfficial: true,
      category: 'notice',
      content,
      time: '방금 전',
      likes: 0,
      isLiked: false
    };

    if (userData) {
      userData.communityPosts.unshift(newNotice);
      saveUserData();
    }
    syncToCentralServer(currentUser, userData, newNotice);

    document.getElementById('inputAdminNoticeContent').value = '';
    showToast('공식 웰니스 공지가 전체 회원 커뮤니티에 등록되었습니다!', 'success');
  });

  document.getElementById('btnAdminSaveYoutubeUrl')?.addEventListener('click', () => {
    const url = document.getElementById('inputAdminYoutubeUrl')?.value.trim();
    if (!url) return;
    localStorage.setItem(YOUTUBE_STREAM_STORAGE_KEY, url);
    showToast('유튜브 생중계 라이브 채널 주소가 전체 적용되었습니다.', 'success');
  });

  document.getElementById('btnRefreshAdminMembers')?.addEventListener('click', () => {
    renderAdminDashboard();
    showToast('회원 명단 및 최신 건강 상태를 갱신하였습니다.', 'info');
  });

  // Initial App Render & Cloud Badge & Central Server Sync & Luxury Canvas
  initAmbientLuxuryCanvas();
  renderApp();
  updateCloudBadge();
  loadCentralServerData();

})();
