/**
 * RESONANCE CARE V2 - TRADITIONAL KOREAN MEDICINE (TCM) DATABASE
 * 한의학 전문 진단, 변증(辨證), 사상체질(四象體質), 고전 방제(方劑), 12경락 경혈 DB
 */

window.TCM_DATABASE = {
  // 1. 사상체질(四象體質) 진단 & 치료 섭생 DB
  constitutions: [
    {
      id: 'sasang_taeeum',
      name: '태음인 (太陰人)',
      organTrait: '간대폐소 (肝大肺小) - 간의 기능은 왕성하나 폐와 호흡기·피부 발산 기능이 약함',
      characteristics: '체격이 건실하고 골격이 크며, 인내심과 침착함이 뛰어남. 땀을 잘 흘려야 건강한 체질.',
      vulnerabilities: '비만, 고혈압, 기관지 질환, 혈액 순환 정체, 변비',
      healingHerbs: '율무(의이인), 맥문동, 오미자, 도라지(길경), 갈근(칡)',
      classicRx: '청폐사간탕, 갈근해기탕, 열다한소탕, 마황정천탕',
      recommendedDiet: '소고기, 율무, 무, 도라지, 콩, 배, 밤, 은행',
      avoidDiet: '자극적인 닭고기, 삼계탕, 인삼, 꿀, 지나친 카페인',
      lifestyleTip: '유산소 운동이나 온욕을 통해 땀을 충분히 배출하여 신진대사를 순환시키는 것이 최고의 보약입니다.'
    },
    {
      id: 'sasang_soin',
      name: '소음인 (少陰人)',
      organTrait: '신대비소 (腎大脾小) - 신장 기능은 실하나 비위(소화기계)가 차갑고 약함',
      characteristics: '체형이 아담하고 단정하며, 꼼꼼하고 사려 깊음. 소화가 잘 되고 따뜻한 음식이 맞음.',
      vulnerabilities: '만성 소화불량, 수족냉증, 저혈압, 위하수, 만성 피로, 우울감',
      healingHerbs: '당귀, 인삼, 황기, 백출, 생강, 계피, 진피(귤껍질)',
      classicRx: '보중익기탕, 십전대보탕, 향사육군자탕, 곽향정기산',
      recommendedDiet: '닭고기, 찹쌀, 생강, 대추, 부추, 사과, 꿀, 따뜻한 숭늉',
      avoidDiet: '찬 메밀, 돼지고기, 빙과류, 차가운 맥주, 날음식',
      lifestyleTip: '배와 손발을 항상 따뜻하게 유지하고, 소화에 무리가 없는 소식(小食)과 따뜻한 음용을 실천하세요.'
    },
    {
      id: 'sasang_soyang',
      name: '소양인 (少陽人)',
      organTrait: '비대신소 (脾大腎小) - 비위의 소화열은 강하나 신장·방광 기능과 하체 기운이 약함',
      characteristics: '상체가 발달하고 걸음걸이가 빠르며, 열정적이고 결단력이 빠름. 몸에 열이 많은 편.',
      vulnerabilities: '신장 질환, 요통, 상열감(안면홍조), 불면증, 조급증, 변비',
      healingHerbs: '구기자, 산수유, 숙지황, 복분자, 치자, 지모, 황련',
      classicRx: '육미지황탕, 양격산화탕, 형방지황탕, 독활지황탕',
      recommendedDiet: '돼지고기, 오리고기, 보리, 녹두, 오이, 수박, 참외, 결명자차',
      avoidDiet: '뜨거운 인삼, 꿀, 고추, 마늘, 닭고기, 양고기',
      lifestyleTip: '마음을 차분히 가라앉히는 단전호흡과 하체 근력 운동, 시원한 성질의 수분 섭취를 추천합니다.'
    },
    {
      id: 'sasang_taeyang',
      name: '태양인 (太陽人)',
      organTrait: '폐대간소 (肺大肝小) - 폐 기능은 발산력이 강하나 간의 저장과 해독 기능이 약함',
      characteristics: '목덜미와 상체가 발달하고 눈빛이 강하며, 진취적이고 영웅적 기질. 매우 희귀한 체질.',
      vulnerabilities: '하지 무력증, 구토증(열격증), 간 기능 저하, 분노 조절 취약',
      healingHerbs: '모과, 오가피, 다래(미후도), 솔잎, 메밀',
      classicRx: '미후등식장탕, 오가피장척탕',
      recommendedDiet: '메밀, 쌀, 붕어, 조개류, 포도, 감, 솔잎차, 모과차',
      avoidDiet: '맵고 기름진 육류, 뜨거운 조미료, 지나친 음주',
      lifestyleTip: '담백한 식단을 유지하고 조급한 마음을 다스리며 하체 이완 요법을 병행하세요.'
    }
  ],

  // 2. 한의학 8대 변증(辨證) 질환 및 치법(治法) DB
  syndromes: [
    {
      code: 'SYN_QI_DEFICIENCY',
      name: '기허증 (氣虛證)',
      mainSymptoms: '만성 무기력, 말하기 귀찮음(소기), 식후 식곤증, 조금만 움직여도 식은땀, 잦은 감기',
      pulseTongue: '설태가 희고 엷으며 혀 가장자리에 이빨 자국(치흔)이 있음, 맥이 연약함(맥허무력)',
      treatmentPrinciple: '보기익기(補氣益氣) - 기운을 북돋우고 비위의 원기를 보강',
      herbs: ['황기', '인삼', '백출', '감초'],
      rx: '보중익기탕(補中益氣湯), 사군자탕(四君子湯)',
      acupoints: ['족삼리(ST36)', '기해(CV6)', '백회(GV20)']
    },
    {
      code: 'SYN_BLOOD_DEFICIENCY',
      name: '혈허증 (血虛證)',
      mainSymptoms: '안색이 창백하거나 누럼, 어지럼증, 눈 침침함, 손발 저림 및 수족냉증, 건망, 불면',
      pulseTongue: '혀의 색이 엷고 핏기가 없음(설담백), 맥이 가늘고 힘이 없음(맥세약)',
      treatmentPrinciple: '보혈양혈(補血養血) - 피를 맑게 생성하고 혈맥을 자양',
      herbs: ['당귀', '숙지황', '백작약', '천궁'],
      rx: '사물탕(四物湯), 당귀보혈탕(當歸補血湯)',
      acupoints: ['삼음교(SP6)', '혈해(SP10)', '간수(BL18)']
    },
    {
      code: 'SYN_QI_STAGNATION',
      name: '기체증 / 간기울결 (氣滯證)',
      mainSymptoms: '가슴과 옆구리가 뻐근하고 답답함, 잦은 한숨, 목에 이물감(매핵기), 감정 기복, 홧병',
      pulseTongue: '설태는 엷고 혀 색이 붉어질 수 있음, 맥이 활시위처럼 팽팽함(맥현)',
      treatmentPrinciple: '이기소간(理氣疏肝) - 뭉친 기를 소통시키고 울화를 해소',
      herbs: ['시호', '향부자', '진피', '박하'],
      rx: '소요산(逍遙散), 반하후박탕(半夏厚朴湯), 시호소간산',
      acupoints: ['태충(LR3)', '내관(PC6)', '전중(CV17)']
    },
    {
      code: 'SYN_PHLEGM_DAMPNESS',
      name: '담음증 / 습담 (痰飮證)',
      mainSymptoms: '몸과 머리가 천근만근 무거움, 메스꺼움, 가래, 어지럼증, 식후 속 더부룩함, 부종',
      pulseTongue: '설태가 하얗고 두껍게 끼며 미끈거림(설태백니), 맥이 미끄러짐(맥활)',
      treatmentPrinciple: '조습화담(燥濕化痰) - 몸 안의 불필요한 수분 노폐물을 말리고 배출',
      herbs: ['반하', '진피', '복령', '생강'],
      rx: '이진탕(二陳湯), 평위산(平胃散), 반하백출천마탕',
      acupoints: ['풍륭(ST40)', '중완(CV12)', '음릉천(SP9)']
    },
    {
      code: 'SYN_YIN_DEFICIENCY',
      name: '음허화왕 (陰虛火旺)',
      mainSymptoms: '오후나 야간에 손발바닥이 화끈거림(오심번열), 밤에 식은땀(도한), 입과 목이 바짝 마름, 불면',
      pulseTongue: '혀가 붉고 설태가 거의 없거나 균열이 있음(설홍소태), 맥이 가늘고 빠름(맥세삭)',
      treatmentPrinciple: '자음강화(滋陰降火) - 진액과 음혈을 채우고 허열을 내림',
      herbs: ['숙지황', '산수유', '구기자', '맥문동', '지모'],
      rx: '육미지황환(六味地黃丸), 자음강화탕, 천왕보심단',
      acupoints: ['태계(KI3)', '용천(KI1)', '신수(BL23)']
    },
    {
      code: 'SYN_YANG_DEFICIENCY',
      name: '신양허증 / 한증 (腎陽虛證)',
      mainSymptoms: '추위를 심하게 탐, 허리와 무릎이 시리고 쑤심, 새벽 설사(오경설), 소변이 맑고 잦음, 성기능 저하',
      pulseTongue: '혀가 붓고 핏기가 없으며 이빨 자국이 남음, 맥이 깊고 가라앉음(맥침약)',
      treatmentPrinciple: '온보신양(溫補腎陽) - 신장의 근본 양기를 따뜻하게 보양',
      herbs: ['육계(계피)', '부자', '음양곽', '두충', '복분자'],
      rx: '팔미지황환(八味地黃丸), 우귀음(右歸飲), 신기환',
      acupoints: ['명문(GV4)', '관원(CV4)', '신수(BL23)']
    }
  ],

  // 3. 한의학 고전 대표 명방(方劑) 20종 DB
  prescriptions: [
    {
      name: '십전대보탕 (十全大補湯)',
      origin: '태평혜민화제국방',
      effects: '기혈쌍보(氣血雙補) - 기운과 혈액을 동시에 완벽하게 보양하여 큰 병 후 회복 및 만성 쇠약 개선',
      composition: '인삼, 백출, 복령, 감초(사군자탕) + 당귀, 천궁, 백작약, 숙지황(사물탕) + 황기, 육계',
      indication: '큰 수술 후 기력 저하, 만성 빈혈, 극심한 피로, 추위를 타며 식은땀이 나는 상태'
    },
    {
      name: '보중익기탕 (補中益氣湯)',
      origin: '동원 비위론',
      effects: '보중익기·승양거함(升陽擧陷) - 소화기 비위의 중심 기운을 올리고 처진 기운을 끌어올림',
      composition: '황기, 인삼, 백출, 감초, 당귀, 진피, 승마, 시호',
      indication: '여름철 식욕 부진, 조금만 말해도 지침, 위하수, 만성 식곤증, 기운 없음'
    },
    {
      name: '귀비탕 (歸脾湯)',
      origin: '제생방',
      effects: '익기보혈·건비양심(健脾養心) - 생각과 스트레스가 많아 심장과 비장이 상했을 때 마음을 안정시키고 혈을 보함',
      composition: '당귀, 용안육, 산조인, 원지, 인삼, 황기, 백출, 복신, 목향, 감초',
      indication: '수험생·직장인 만성 신경성 불면증, 건망증, 가슴 두근거림, 불안초조, 식욕감퇴'
    },
    {
      name: '평위산 (平胃散)',
      origin: '태평혜민화제국방',
      effects: '조습건비·행기화위(行氣化胃) - 위장의 습기를 말리고 체기를 풀어 소화 기능을 정상화',
      composition: '창출, 후박, 진피, 감초, 생강, 대추',
      indication: '급만성 소화불량, 식후 명치 더부룩함, 헛구역질, 신트림, 묽은 변'
    },
    {
      name: '쌍화탕 (雙和湯)',
      origin: '태평혜민화제국방',
      effects: '음양쌍화(陰陽雙和) - 기와 혈, 음과 양을 조화롭게 하여 피로를 풀고 근육통을 완화',
      composition: '백작약, 숙지황, 황기, 당귀, 천궁, 육계, 감초, 생강, 대추',
      indication: '과로 후 몸살 기운, 근육통, 성생활 후 피로, 잦은 감기 몸살'
    },
    {
      name: '육미지황환 (六味地黃丸)',
      origin: '소아약증직결',
      effects: '삼보삼사(三補三瀉) - 신장의 음액을 채우고 허열을 배출하여 노화 억제 및 활력 유지',
      composition: '숙지황, 산약, 산수유(3보) + 택사, 목단피, 복령(3사)',
      indication: '중장년층 허리·무릎 쇠약, 구강 건조, 야간 빈뇨, 이명, 눈 침침함'
    },
    {
      name: '천왕보심단 (天王補心丹)',
      origin: '체인망',
      effects: '자음양혈·보심안신(補心安神) - 심장의 진액을 채워 열을 끄고 뇌신경을 깊이 안정시킴',
      composition: '생지황, 인삼, 현삼, 단삼, 복령, 원지, 길경, 당귀, 천문동, 맥문동, 백자인, 산조인, 오미자',
      indication: '심한 불면증, 꿈이 많아 자주 깸, 가슴이 답답하고 두근거림, 구내염'
    },
    {
      name: '갈근탕 (葛根湯)',
      origin: '상한론',
      effects: '해표발한·서근활락(舒筋活絡) - 땀을 내어 한기를 몰아내고 목과 등의 뭉친 근육을 이완',
      composition: '갈근, 마황, 계지, 작약, 감초, 생강, 대추',
      indication: '초기 감기 오한, 땀이 안 나면서 목덜미와 등이 뻣뻣하게 굳는 증상'
    }
  ],

  // 4. 한의학 14대 경락(Meridian) 체계 DB
  meridians: [
    { code: 'LU', name: '수태음폐경 (手太陰肺經)', organ: '폐 (호흡기/피부)', acupointCount: 11, keyAcupoint: '태연(LU9), 소상(LU11)' },
    { code: 'LI', name: '수양명대장경 (手陽明大腸經)', organ: '대장 (배설/면역)', acupointCount: 20, keyAcupoint: '합곡(LI4), 곡지(LI11)' },
    { code: 'ST', name: '족양명위경 (足陽明胃經)', organ: '위장 (소화/흡수)', acupointCount: 45, keyAcupoint: '족삼리(ST36), 풍륭(ST40)' },
    { code: 'SP', name: '족태음비경 (足太陰脾經)', organ: '비장 (기혈생성/수액대사)', acupointCount: 21, keyAcupoint: '삼음교(SP6), 음릉천(SP9)' },
    { code: 'HT', name: '수소음심경 (手少陰心經)', organ: '심장 (혈맥/정신)', acupointCount: 9, keyAcupoint: '신문(HT7), 소해(HT3)' },
    { code: 'SI', name: '수태양소장경 (手太陽小腸經)', organ: '소장 (영양흡수/분별)', acupointCount: 19, keyAcupoint: '후계(SI3), 견정(SI9)' },
    { code: 'BL', name: '족태양방광경 (足太陽膀胱經)', organ: '방광 (수분배출/배부유혈)', acupointCount: 67, keyAcupoint: '신수(BL23), 위중(BL40)' },
    { code: 'KI', name: '족소음신경 (足少陰腎經)', organ: '신장 (선천지원기/골격)', acupointCount: 27, keyAcupoint: '용천(KI1), 태계(KI3)' },
    { code: 'PC', name: '수궐음심포경 (手厥陰心包經)', organ: '심포 (심장보호/자율신경)', acupointCount: 9, keyAcupoint: '내관(PC6), 노궁(PC8)' },
    { code: 'TE', name: '수소양삼초경 (手少陽三焦經)', organ: '삼초 (체온조절/기화작용)', acupointCount: 23, keyAcupoint: '외관(TE5), 예풍(TE17)' },
    { code: 'GB', name: '족소양담경 (足少陽膽經)', organ: '쓸개 (결단/측두근육)', acupointCount: 44, keyAcupoint: '풍지(GB20), 양릉천(GB34)' },
    { code: 'LR', name: '족궐음간경 (足厥陰肝經)', organ: '간 (소설작용/근육/혈액저장)', acupointCount: 14, keyAcupoint: '태충(LR3), 행간(LR2)' },
    { code: 'GV', name: '독맥 (督脈)', organ: '양경의 총통 (척추/뇌신경)', acupointCount: 28, keyAcupoint: '백회(GV20), 명문(GV4), 대추(GV14)' },
    { code: 'CV', name: '임맥 (任脈)', organ: '음경의 총통 (복부/생식기)', acupointCount: 24, keyAcupoint: '단중/전중(CV17), 중완(CV12), 관원(CV4)' }
  ]
};
