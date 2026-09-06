/**
 * RESONANCE CARE V2 - CLINICAL HEALER & SAJU-MEDICAL DIAGNOSTIC ENGINE (v2026.09)
 * 한의학(동의보감·12경락)과 현대의학(자율신경·혈류역학·근막경선) 융합
 * 기혈 막힘(氣血鬱滯) 진단 및 초래 가능 질환 예측 솔루션
 */

window.HEALER_DIAGNOSTIC_ENGINE = {
  // 1. 오행 마스터 메디컬 데이터셋
  elements: {
    wood: { 
      name: '목(木)', 
      organ: '간(肝)·담(膽)', 
      modernMedical: '자율신경계, 간 해독 대사, 말초 신경선, 근막 긴장도',
      emotion: '분노, 긴장, 억압된 스트레스 (간기울결)', 
      color: '#10B981', 
      acupoint: '태충(LR3), 풍지(GB20)',
      tea: '유기농 작약감초차 + 결명자차',
      hrv: '생리적 한숨 호흡 (Physiological Sigh - 2회 들숨 후 긴 날숨)'
    },
    fire: { 
      name: '화(火)', 
      organ: '심장(心)·소장(小腸)', 
      modernMedical: '심혈관계, 관상동맥 순환, 혈압 조절, 뇌파 동기화',
      emotion: '조급함, 가슴 두근거림, 불안, 심화상염(心火上炎)', 
      color: '#EF4444', 
      acupoint: '내관(PC6), 전중(CV17), 신문(HT7)',
      tea: '산조인차 + 연자육 대추차',
      hrv: '5.5초 HRV 공명 호흡 (분당 5.5회 심박변이도 최적화)'
    },
    earth: { 
      name: '토(土)', 
      organ: '비장(脾)·위장(胃)', 
      modernMedical: '소화기계, 장-뇌 축(Gut-Brain Axis), 림프 면역, 영양 흡수',
      emotion: '과도한 생각, 근심, 식적(食積), 담적병(痰積病)', 
      color: '#F59E0B', 
      acupoint: '족삼리(ST36), 중완(CV12), 공손(SP4)',
      tea: '햇황기차 + 볶은 율무차 + 생강차',
      hrv: 'NSDR 10분 비수면 깊은 휴식 (소화기 미주신경 자극)'
    },
    metal: { 
      name: '금(金)', 
      organ: '폐(肺)·대장(大腸)', 
      modernMedical: '호흡기계, 폐포 산소포화도, 척추기립근, 피부 점막 장벽',
      emotion: '수렴, 슬픔, 기운 저하, 흉곽 수축', 
      color: '#94A3B8', 
      acupoint: '합곡(LI4), 태연(LU9), 폐수(BL13)',
      tea: '맥문동 오미자차 + 도라지차',
      hrv: '흉곽 3D 확장 딥 바디스캔 호흡'
    },
    water: { 
      name: '수(水)', 
      organ: '신장(腎)·방광(膀胱)', 
      modernMedical: '비뇨생식기계, 부신 피질 호르몬(코르티솔), 체액 전해질, 골밀도',
      emotion: '만성 피로, 두려움, 에너지 고갈, 신양허 냉증', 
      color: '#38BDF8', 
      acupoint: '용천(KI1), 태계(KI3), 명문(GV4)',
      tea: '유기농 복분자 산수유차 + 숙지황 구기자차',
      hrv: '40℃ 하체 족욕 코어 쿨링 & 432Hz 딥슬립 사운드'
    }
  },

  // 2. 부위별 기혈 막힘(氣血鬱滯) 및 초래 질환 전문 DB
  bodyPathologyDatabase: {
    head: {
      name: '머리 / 두경부',
      element: 'wood',
      meridians: '족소양담경, 수태양소장경, 독맥',
      stagnationMechanism: '상초(上焦) 기혈 순환 장애 및 뇌혈관 수축, 경동맥 림프 정체, 화기(火氣) 상승',
      immediateSymptoms: [
        '오후 편두통 및 뇌가 꽉 조이는 듯한 긴장성 두통',
        '안구 건조 및 눈 뒤쪽이 빠질 듯한 통증, 충혈',
        '머리가 멍하고 기억력이 감퇴하는 브레인 포그(Brain Fog)',
        '야간 상열감으로 인한 잦은 각성과 불면증'
      ],
      potentialDiseases: [
        '일과성 뇌허혈 발작(TIA) 및 뇌혈관 질환(중풍 전조 증상)',
        '만성 경추성 두통 및 후두신경통',
        '자율신경실조증 및 신경성 수면장애',
        '안압 상승 및 만성 녹내장/망막 피로 위험'
      ],
      cureStrategy: '풍지혈(GB20) 지압 및 상초 화기 냉각, 아침 10분 자연광 햇빛 리셋'
    },
    neck_shoulder: {
      name: '목 · 승모근 · 어깨',
      element: 'wood',
      meridians: '수양명대장경, 수소양삼초경, 족태양방광경',
      stagnationMechanism: '경항부(목) 근막 유착, 흉쇄유돌근 긴장, 추골동맥 압박으로 인한 혈류 저하',
      immediateSymptoms: [
        '승모근이 돌처럼 굳고 누르면 극심한 통증(트리거 포인트)',
        '고개를 좌우로 돌릴 때 뚝뚝 소리가 나고 가동 범위 제한',
        '어깨 결림이 팔이나 손가락 끝 저림으로 방사되는 느낌',
        '만성적인 후두부 뻐근함과 만성 피로감'
      ],
      potentialDiseases: [
        '경추간판 탈출증 (목디스크) 및 척추 신경 압박증',
        '오십견 (유착성 관절낭염) 및 회전근개 손상',
        '흉곽출구증후군 (상지 신경 및 쇄골하 혈관 압박)',
        '근막통증증후군(MPS)의 만성화 및 체형 비대칭'
      ],
      cureStrategy: '견정혈(GB21) 및 후계혈(SI3) 지압, 생리적 한숨 호흡으로 승모근 긴장 해소'
    },
    chest: {
      name: '가슴 · 심폐',
      element: 'fire',
      meridians: '수궐음심포경, 임맥(단중), 수소음심경',
      stagnationMechanism: '심포경락 울결 및 흉강 내압 증가, 미주신경 억압, 심박변이도(HRV) 불균형',
      immediateSymptoms: [
        '가슴 중앙(단중혈)을 누르면 칼로 찌르듯 아픔 (홧병 지표)',
        '이유 없이 가슴이 답답하여 무의식적으로 깊은 한숨을 쉼',
        '수면 전 가슴이 쿵쾅거리고 불안하며 숨이 얕게 쉬어짐',
        '목구멍에 무언가 걸려있는 듯 뱉어지지 않는 느낌 (매핵기)'
      ],
      potentialDiseases: [
        '협심증 및 관상동맥 허혈성 심혈관 질환',
        '부정맥(심방세동, 조기수축) 및 공황장애',
        '신경성 역류성 식도염 및 비심장성 흉통',
        '자율신경계 불균형으로 인한 만성 불안증'
      ],
      cureStrategy: '내관혈(PC6) 및 전중혈(CV17) 5초 지압, 5.5초 HRV 공명 호흡'
    },
    abdomen: {
      name: '복부 · 위장',
      element: 'earth',
      meridians: '족양명위경, 족태음비경, 임맥(중완)',
      stagnationMechanism: '중초(中焦) 기혈 순환 정체, 복부 대동맥 순환 부전, 미소화 찌꺼기 담적(痰積) 형성',
      immediateSymptoms: [
        '식후 명치가 꽉 막힌 듯 답답하고 극심한 식곤증 유발',
        '배를 만져보면 배꼽 주위가 돌처럼 딱딱하고 차가움',
        '잦은 헛구역질, 신트림, 팽만감 및 가스 차오름',
        '대변이 묽거나 변비가 반복되는 배변 불규칙'
      ],
      potentialDiseases: [
        '만성 위축성 위염 및 장상피화생 (위암 위험 인자)',
        '담적성 소화불량 증후군 및 위하수증',
        '과민성대장증후군(IBS) 및 장누수증후군 (면역 저하)',
        '인슐린 저항성 증가 및 복부비만·대사증후군, 당뇨병'
      ],
      cureStrategy: '중완혈(CV12) 및 족삼리(ST36) 온열 지압, 따뜻한 볶은 율무생강차 복용'
    },
    waist_back: {
      name: '등 · 허리',
      element: 'metal',
      meridians: '족태양방광경 배부유혈, 독맥(명문)',
      stagnationMechanism: '척추 기립근의 만성 허혈(ischemia), 골반 변위, 척추 신경근의 혈액 순환 결손',
      immediateSymptoms: [
        '아침에 일어날 때 허리가 굳어 바로 펴지 못하고 통증 발생',
        '오래 앉아 있으면 엉치와 골반 부위가 묵직하고 뻐근함',
        '등 날개뼈 안쪽(고황혈)이 결리고 쑤셔서 잠을 설침',
        '날씨가 흐리거나 피로하면 허리 아래가 시리고 힘이 빠짐'
      ],
      potentialDiseases: [
        '요추 추간판 탈출증 (허리디스크) 및 척추관 협착증',
        '좌골신경통 및 이상근증후군으로 인한 보행 장애',
        '만성 척추 관절염 및 천장관절염',
        '신장 부신 피로(Adrenal Fatigue)로 인한 활력 고갈'
      ],
      cureStrategy: '신수혈(BL23) 및 명문혈(GV4) 온열 찜질, 척추 캣카우 신전 스트레칭'
    },
    lower_limbs: {
      name: '하체 · 발목 · 발바닥',
      element: 'water',
      meridians: '족소음신경(용천), 족태음비경(삼음교), 족궐음간경',
      stagnationMechanism: '하초(下焦) 정맥 판막 둔화, 말초 림프 모세관 울혈, 신수(腎水) 고갈로 인한 온기 결손',
      immediateSymptoms: [
        '오후가 되면 다리와 발목이 퉁퉁 붓고 신발이 꽉 낌',
        '밤에 자다가 종아리에 쥐(근육 경련)가 자주 발생하여 깸',
        '손발이 얼음장처럼 차고 발바닥이 저리거나 화끈거림',
        '계단을 오르내릴 때 무릎 안쪽이 시큰거리고 무거움'
      ],
      potentialDiseases: [
        '하지정맥류 (정맥혈 역류 및 혈관 확장 질환)',
        '심부정맥 혈전증 (DVT - 혈전이 폐나 뇌로 이동할 위험)',
        '만성 족저근막염 및 아킬레스건염',
        '신부전증 전조 부종 및 림프부종'
      ],
      cureStrategy: '용천혈(KI1) 및 삼음교(SP6) 강한 지압, 40℃ 온수 족욕 15분'
    }
  },

  // 3. 사주 오행 리듬 계산 알고리즘
  calculateSajuFiveElements: function(birthYear, birthMonth, birthDay) {
    const y = parseInt(birthYear) || 1985;
    const m = parseInt(birthMonth) || 5;
    const d = parseInt(birthDay) || 15;

    const woodScore = 18 + ((y * 3 + m * 7 + d) % 24);
    const fireScore = 14 + ((y * 5 + m * 3 + d * 2) % 26);
    const earthScore = 18 + ((y * 2 + m * 5 + d * 3) % 22);
    const metalScore = 16 + ((y * 7 + m * 2 + d * 5) % 24);
    const waterScore = 14 + ((y * 4 + m * 6 + d * 7) % 26);

    const total = woodScore + fireScore + earthScore + metalScore + waterScore;

    return {
      wood: Math.round((woodScore / total) * 100),
      fire: Math.round((fireScore / total) * 100),
      earth: Math.round((earthScore / total) * 100),
      metal: Math.round((metalScore / total) * 100),
      water: Math.round((waterScore / total) * 100)
    };
  },

  // 4. 기혈 막힘 위험 지수(Stagnation Risk Score) 계산
  calculateStagnationScore: function(selectedRegions, severity) {
    const regionCount = selectedRegions && selectedRegions.length ? selectedRegions.length : 1;
    const sev = parseInt(severity) || 7;
    // 부위수 가중치 (각 10점) + 강도 가중치 (0~50점) + 기본 20점
    const score = Math.min(100, Math.round(20 + (regionCount * 8) + (sev * 4.5)));
    
    let levelText = '경증 기체 (기혈 일시 정체)';
    let levelColor = '#34D399';
    let levelDesc = '피로와 스트레스로 인해 경락 기운이 일시적으로 뭉친 단계입니다. 3일 이내 자가 지압으로 회복 가능합니다.';

    if (score >= 75) {
      levelText = '고위험 기혈 폐색 (어혈·담적 응결 단계)';
      levelColor = '#EF4444';
      levelDesc = '기혈이 심각하게 막혀 조직 내 어혈(죽은 피)과 담적(노폐물)이 깊게 자리잡은 상태입니다. 만성 질환으로의 전이를 막기 위해 즉각적인 조치가 시급합니다.';
    } else if (score >= 50) {
      levelText = '중등도 기혈 정체 (장부 순환 장애 경보)';
      levelColor = '#F59E0B';
      levelDesc = '기혈의 흐름이 반 이상 정체되어 특정 장부(위장, 심장, 간)의 기능 저하와 지속적인 통증이 유발되는 단계입니다.';
    }

    return { score, levelText, levelColor, levelDesc };
  },

  // 5. 종합 4-Grid 진단 솔루션 생성기
  generate4GridDiagnosis: function(clientData) {
    const { name, birthYear, birthMonth, birthDay, selectedRegions, sensationType, severity } = clientData;
    const saju = this.calculateSajuFiveElements(birthYear, birthMonth, birthDay);
    const risk = this.calculateStagnationScore(selectedRegions, severity);

    // 최고/최저 오행
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

    // 선택된 부위들의 한의학-의학 병리 데이터 취합
    const activeRegions = (selectedRegions && selectedRegions.length > 0)
      ? selectedRegions
      : ['neck_shoulder', 'abdomen'];

    const regionPathologies = activeRegions.map(rId => this.bodyPathologyDatabase[rId] || this.bodyPathologyDatabase.neck_shoulder);

    // 모든 증상 및 질환 통합
    const allSymptoms = [];
    const allDiseases = [];
    regionPathologies.forEach(p => {
      p.immediateSymptoms.forEach(s => allSymptoms.push(`· [${p.name}] ${s}`));
      p.potentialDiseases.forEach(d => allDiseases.push(`· [${p.name}] ⚠️ ${d}`));
    });

    // 1. Fact (객관적 사실)
    const gridFact = `
[고객 기본 식별 프로필]
· 성명: ${name || '김회원'} 님
· 생년월일: ${birthYear || 1985}년 ${birthMonth || 5}월 ${birthDay || 15}일
· 사주 오행 리듬: 목(${saju.wood}%) · 화(${saju.fire}%) · 토(${saju.earth}%) · 금(${saju.metal}%) · 수(${saju.water}%)
· 타고난 우세 오행: ${domInfo.name} (${maxVal}% - ${domInfo.organ} 영역 활성)
· 선천적 취약 오행: ${weakInfo.name} (${minVal}% - ${weakInfo.organ} 에너지 자양 시급)
· 현대의학적 취약 지표: ${weakInfo.modernMedical}
    `.trim();

    // 2. Client Report & 기혈 막힘 질병 예측
    const gridClientReport = `
[기혈 막힘(氣血鬱滯) 진단 지표]
· 기혈 정체 위험 지수: ${risk.score}점 / 100점 (${risk.levelText})
· 고객 선택 체감 상태: "${sensationType || '만성 뻐근함 및 결림'}" (VAS 통증 강도: ${severity}/10)
· 막힘 집중 부위: ${regionPathologies.map(p => p.name).join(', ')}

[현재 나타나는 직접적 자각 증상]
${allSymptoms.slice(0, 4).join('\n')}

[🚨 방치 시 초래될 수 있는 중대 질환 및 합병증 경고]
${allDiseases.slice(0, 4).join('\n')}
* 의학 경고: ${risk.levelDesc}
    `.trim();

    // 3. Healer Impression (김복선 치유사 직관 에너지 & 의학 융합 리딩)
    const gridHealerImpression = `
[김복선 치유사 직관 심층 리딩 노트]
회원님의 기운을 관조해보면, ${domInfo.name} 기운의 상열(上熱)과 ${weakInfo.name} 기운의 하랭(下冷)이 결합된 전형적인 '수승화강(水昇火降) 붕괴' 상태입니다.
특히 [${regionPathologies.map(p => p.name).join('와 ')}] 부위의 경락이 심각하게 굳어 있어, 산소와 온기를 전달하는 미세 모세혈관 순환이 40% 이상 저하되어 있습니다.
이로 인해 뇌와 심장에 만성 긴장(교감신경 우위)이 걸려 있으며, 이는 단순 피로가 아니라 방치할 경우 고혈압·목디스크·담적병 등 만성 기질성 질환으로 번질 가능성이 매우 높습니다.
    `.trim();

    // 4. 7-Day Resonance Recovery Routine (치유사 솔루션)
    const gridVerification = `
[김복선 치유사의 7-Day 기혈 소통 & 질병 예방 처방전]
1. [응급 기혈 뚫기 지압 루틴]:
   ${regionPathologies.map(p => `· ${p.name}: ${p.cureStrategy}`).join('\n   ')}
2. [맞춤 보양 한방차 블렌딩]:
   · ${domInfo.tea} (오전 기운 상승) + ${weakInfo.tea} (오후 하체 보양)
3. [신경과학 자율신경 리셋]:
   · ${domInfo.hrv} (기상 직후 10분)
   · 스탠포드 의대 NSDR 10분 비수면 깊은 휴식 (점심 식후)
   · 40℃ 하체 족욕 & 432Hz 주파수 딥슬립 테라피 (취침 전)
[치유사 전담 모니터링]: 7일간 데일리 체크인을 통해 기혈 막힘 개선도를 정밀 추적합니다.
    `.trim();

    return {
      saju,
      risk,
      dominantElement: domInfo,
      weakElement: weakInfo,
      regionPathologies,
      allSymptoms,
      allDiseases,
      gridFact,
      gridClientReport,
      gridHealerImpression,
      gridVerification
    };
  }
};
