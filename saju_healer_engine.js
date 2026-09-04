/**
 * RESONANCE CARE V2 - HEALER DIAGNOSTIC & SAJU MEDICAL ENGINE
 * 리조넌스 리뉴얼 프로젝트 '치유사 4-Grid 진단 솔루션' & '바디 센세이션 맵' 엔진
 */

window.HEALER_DIAGNOSTIC_ENGINE = {
  // 오행 마스터 데이터
  elements: {
    wood: { name: '목(木)', organ: '간·담', emotion: '분노/스트레스', body: '눈, 목·어깨, 관절, 신경선', color: '#10B981', hrv: '생리적 한숨 (Physiological Sigh)' },
    fire: { name: '화(火)', organ: '심장·소장', emotion: '조급/열정', body: '가슴, 혀, 혈관, 얼굴 상열', color: '#EF4444', hrv: '5.5초 공명 호흡 (HRV Coherence)' },
    earth: { name: '토(土)', organ: '비장·위장', emotion: '생각/근심', body: '복부, 췌장, 살, 소화기', color: '#F59E0B', hrv: 'NSDR 10분 비수면 깊은 휴식' },
    metal: { name: '금(金)', organ: '폐·대장', emotion: '슬픔/수렴', body: '호흡기, 등/척추, 피부, 뼈', color: '#94A3B8', hrv: '흉곽 확장 딥 바디스캔' },
    water: { name: '수(水)', organ: '신장·방광', emotion: '두려움/냉증', body: '허리, 하체 냉감, 골수, 수액', color: '#38BDF8', hrv: '40℃ 하체 족욕 (Core Cooling) & 432Hz' }
  },

  // 바디 영역 정의
  bodyRegions: [
    { id: 'head', name: '머리 / 두경부', element: 'wood', defaultSensation: '열감 / 무거움' },
    { id: 'neck_shoulder', name: '목 · 승모근 · 어깨', element: 'wood', defaultSensation: '만성 뻐근함 / 결림' },
    { id: 'chest', name: '가슴 · 심폐', element: 'fire', defaultSensation: '가슴 답답함 / 두근거림' },
    { id: 'abdomen', name: '복부 · 위장', element: 'earth', defaultSensation: '더부룩함 / 냉감' },
    { id: 'waist_back', name: '등 · 허리', element: 'metal', defaultSensation: '뻐근함 / 굳음' },
    { id: 'lower_limbs', name: '하체 · 발목 · 발바닥', element: 'water', defaultSensation: '하체 부종 / 수족 냉증' }
  ],

  // 사주 오행 계산 (생년월일 기반 간단 추정 알고리즘)
  calculateSajuFiveElements: function(birthYear, birthMonth, birthDay) {
    const y = parseInt(birthYear) || 1985;
    const m = parseInt(birthMonth) || 5;
    const d = parseInt(birthDay) || 15;

    // 만세력 간지 순환에 따른 가중치 추정
    const woodScore = 20 + ((y * 3 + m * 7 + d) % 25);
    const fireScore = 15 + ((y * 5 + m * 3 + d * 2) % 25);
    const earthScore = 20 + ((y * 2 + m * 5 + d * 3) % 20);
    const metalScore = 15 + ((y * 7 + m * 2 + d * 5) % 25);
    const waterScore = 15 + ((y * 4 + m * 6 + d * 7) % 25);

    const total = woodScore + fireScore + earthScore + metalScore + waterScore;

    return {
      wood: Math.round((woodScore / total) * 100),
      fire: Math.round((fireScore / total) * 100),
      earth: Math.round((earthScore / total) * 100),
      metal: Math.round((metalScore / total) * 100),
      water: Math.round((waterScore / total) * 100)
    };
  },

  // 힐러 4-Grid 진단서 생성
  generate4GridDiagnosis: function(clientData) {
    const { name, birthYear, birthMonth, birthDay, selectedRegions, sensationType, severity } = clientData;
    const saju = this.calculateSajuFiveElements(birthYear, birthMonth, birthDay);

    // 최고/최저 오행 판별
    let dominantElement = 'wood';
    let maxVal = -1;
    let weakElement = 'water';
    let minVal = 999;

    for (const [k, v] of Object.entries(saju)) {
      if (v > maxVal) { maxVal = v; dominantElement = k; }
      if (v < minVal) { minVal = v; weakElement = k; }
    }

    const domInfo = this.elements[dominantElement];
    const weakInfo = this.elements[weakElement];

    // 1. Fact (객관적 사실)
    const gridFact = `
고객 성명: ${name || '회원'} 님
생년월일: ${birthYear || 1985}년 ${birthMonth || 5}월 ${birthDay || 15}일
사주 오행 리듬: 목(${saju.wood}%) · 화(${saju.fire}%) · 토(${saju.earth}%) · 금(${saju.metal}%) · 수(${saju.water}%)
우세 기운: ${domInfo.name} (${maxVal}% - ${domInfo.organ} 영역 활성)
보완 기운: ${weakInfo.name} (${minVal}% - ${weakInfo.organ} 영역 에너지 자양 필요)
    `.trim();

    // 2. Client Report (고객 바디 센세이션 보고)
    const regionsText = selectedRegions && selectedRegions.length > 0 
      ? selectedRegions.map(r => this.bodyRegions.find(b => b.id === r)?.name || r).join(', ')
      : '목 · 어깨, 복부 위장';
    
    const gridClientReport = `
주요 체감 불편 영역: [${regionsText}]
선택된 감각 상태: "${sensationType || '만성 뻐근함 및 냉감'}"
주관적 불편 강도: ${severity || 7} / 10 (VAS 척도)
호소 요약: 신체 중심부 순환 정체로 인한 오후 피로감 및 수면 전 신체 긴장감 호소
    `.trim();

    // 3. Healer Impression (김복선 치유사 직관 리딩 인상)
    const gridHealerImpression = `
[김복선 치유사 직관 에너지 리딩]
${domInfo.name} 기운의 급격한 상승으로 인해 ${weakInfo.name} 기운(신체 중심 하부)으로 온기가 순조롭게 내려가지 못하는 '상열하한(上熱下寒)' 양상이 감지됩니다.
생체 시계와 자율신경이 교감신경 우위 상태에 머물러 있어 승모근과 흉곽이 굳어있으며, 이는 5.5초 공명 호흡과 따뜻한 복부 접지를 통해 즉각적인 이완 반응을 끌어낼 수 있습니다.
    `.trim();

    // 4. Verification & 7-Day Routine (확인 과제 및 7일 리셋 루틴)
    const gridVerification = `
[7-Day Resonance Recovery Routine]
· 1~2일차: 아침 기상 직후 10분 자연광 체온 리셋 + ${domInfo.hrv} 실천
· 3~4일차: 저녁 20:00 따뜻한 당귀·황기 온기차 음용 + 복부 온열 팩 15분
· 5~7일차: 취침 전 40℃ 하체 족욕(용천혈 자극) + 432Hz 딥슬립 사운드 테라피
[치유사 약속]: 주 2회 데일리 체크인 모니터링 및 1:1 안부 피드백 배정
    `.trim();

    return {
      saju,
      dominantElement: domInfo,
      weakElement: weakInfo,
      gridFact,
      gridClientReport,
      gridHealerImpression,
      gridVerification
    };
  }
};
