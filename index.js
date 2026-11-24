var STUDY_DATA = {
    bac1: {
        title: "أولى بكالوريا مصرية",
        needsTrack: false,
        subjects: [
            { id: "ar", name: "اللغة العربية", icon: "📖" },
            { id: "en", name: "اللغة الأجنبية الأولى", icon: "🌍" },
            { id: "hist", name: "التاريخ المصري", icon: "🏛️" },
            { id: "math", name: "الرياضيات", icon: "📐" },
            { id: "sci", name: "العلوم المتكاملة", icon: "🔬" },
            { id: "phil", name: "الفلسفة والمنطق", icon: "🧠" }
        ]
    },
    bac2: {
        title: "تانية بكالوريا مصرية",
        needsTrack: true,
        trackLabel: "اختر مسارك الدراسي في البكالوريا",
        commonSubjects: [
            { id: "ar", name: "اللغة العربية", icon: "📖" },
            { id: "en", name: "اللغة الأجنبية الأولى", icon: "🌍" },
            { id: "hist", name: "التاريخ", icon: "🏛️" }
        ],
        tracks: [
            {
                id: "med", name: "مسار طب وعلوم الحياة", color: "#10B981", icon: "🧬",
                specializations: [
                    { id: "phys", name: "الفيزياء", icon: "⚡" },
                    { id: "math", name: "الرياضيات", icon: "📐" }
                ]
            },
            {
                id: "eng", name: "مسار هندسة وعلوم حاسب", color: "#1D63DC", icon: "💻",
                specializations: [
                    { id: "chem", name: "الكيمياء", icon: "🧪" },
                    { id: "ai", name: "البرمجة والذكاء الاصطناعي", icon: "🤖" }
                ]
            },
            {
                id: "biz", name: "مسار ريادة الأعمال", color: "#F59E0B", icon: "📊",
                specializations: [
                    { id: "acc", name: "المحاسبة", icon: "💰" },
                    { id: "mgmt", name: "إدارة الأعمال", icon: "💼" }
                ]
            },
            {
                id: "arts", name: "مسار الآداب والفنون", color: "#8B5CF6", icon: "🎨",
                specializations: [
                    { id: "psych", name: "علم النفس", icon: "🧠" },
                    { id: "lang2", name: "اللغة الأجنبية الثانية", icon: "🗣️" }
                ]
            }
        ]
    },
    sec3: {
        title: "تالتة ثانوي (ثانوية عامة)",
        needsTrack: true,
        trackLabel: "اختر شعبتك الدراسية",
        tracks: [
            {
                id: "sci_bio", name: "علمي علوم", color: "#10B981", icon: "🩺",
                subjects: [
                    { id: "ar", name: "اللغة العربية", icon: "📖" },
                    { id: "en", name: "اللغة الأجنبية الأولى", icon: "🌍" },
                    { id: "phys", name: "الفيزياء", icon: "⚡" },
                    { id: "chem", name: "الكيمياء", icon: "🧪" },
                    { id: "bio", name: "الأحياء", icon: "🧬" }
                ]
            },
            {
                id: "sci_math", name: "علمي رياضة", color: "#1D63DC", icon: "📐",
                subjects: [
                    { id: "ar", name: "اللغة العربية", icon: "📖" },
                    { id: "en", name: "اللغة الأجنبية الأولى", icon: "🌍" },
                    { id: "phys", name: "الفيزياء", icon: "⚡" },
                    { id: "chem", name: "الكيمياء", icon: "🧪" },
                    { id: "math", name: "الرياضيات", icon: "📏" }
                ]
            },
            {
                id: "literary", name: "الشعبة الأدبية", color: "#8B5CF6", icon: "📚",
                subjects: [
                    { id: "ar", name: "اللغة العربية", icon: "📖" },
                    { id: "en", name: "اللغة الأجنبية الأولى", icon: "🌍" },
                    { id: "hist", name: "التاريخ", icon: "🏛️" },
                    { id: "geo", name: "الجغرافيا", icon: "🗺️" },
                    { id: "stat", name: "الإحصاء", icon: "📈" }
                ]
            }
        ]
    }
};

var userSelection = { gradeKey: null, trackId: null, specializationId: null };
var activeSubjectId = null;
var timerSeconds = 25 * 60;
var timerInterval = null;

function showStep(stepId) {
    var sections = document.querySelectorAll('.view-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.add('hidden');
    }
    var target = document.getElementById(stepId);
    if (target) target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openPage(pageId) {
    if (pageId === 'step-subjects') openSubjectsPage();
    else if (pageId === 'step-tasks') openTasksPage();
    else if (pageId === 'step-timer') openTimerPage();
    else if (pageId === 'step-progress') openProgressPage();
}

function selectGrade(gradeKey) {
    userSelection.gradeKey = gradeKey;
    userSelection.trackId = null;
    userSelection.specializationId = null;

    var gradeData = STUDY_DATA[gradeKey];
    if (!gradeData.needsTrack) {
        finishSetup();
        return;
    }

    document.getElementById('track-step-title').textContent = gradeData.trackLabel;
    document.getElementById('selected-grade-subtitle').textContent = gradeData.title;
    document.getElementById('specialization-box').classList.add('hidden');
    document.getElementById('confirm-setup-btn').classList.add('hidden');

    var container = document.getElementById('tracks-container');
    container.innerHTML = '';

    gradeData.tracks.forEach(function(track) {
        var card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = '<div class="track-emoji" style="color:' + track.color + '">' + track.icon + '</div><h4>' + track.name + '</h4>';
        card.onclick = function() { selectTrack(track, card); };
        container.appendChild(card);
    });

    showStep('step-track');
}

function selectTrack(track, cardEl) {
    userSelection.trackId = track.id;
    userSelection.specializationId = null;

    document.querySelectorAll('.track-card').forEach(function(c) { c.classList.remove('selected'); });
    cardEl.classList.add('selected');

    var specBox = document.getElementById('specialization-box');
    var btn = document.getElementById('confirm-setup-btn');

    if (track.specializations) {
        btn.classList.add('hidden');
        specBox.classList.remove('hidden');
        var specCont = document.getElementById('specializations-container');
        specCont.innerHTML = '';

        track.specializations.forEach(function(spec) {
            var sCard = document.createElement('div');
            sCard.className = 'spec-card';
            sCard.innerHTML = '<span>' + spec.icon + '</span> <span>' + spec.name + '</span>';
            sCard.onclick = function() {
                userSelection.specializationId = spec.id;
                document.querySelectorAll('.spec-card').forEach(function(x) { x.classList.remove('selected'); });
                sCard.classList.add('selected');
                btn.classList.remove('hidden');
            };
            specCont.appendChild(sCard);
        });
    } else {
        specBox.classList.add('hidden');
        btn.classList.remove('hidden');
    }
}

function finishSetup() {
    var gradeData = STUDY_DATA[userSelection.gradeKey];
    var finalSubjects = [];
    var trackName = "";

    if (!gradeData.needsTrack) {
        finalSubjects = gradeData.subjects.slice();
    } else {
        var tr = gradeData.tracks.find(function(t) { return t.id === userSelection.trackId; });
        trackName = tr.name;
        if (tr.specializations) {
            var sp = tr.specializations.find(function(s) { return s.id === userSelection.specializationId; });
            finalSubjects = gradeData.commonSubjects.concat([sp]);
        } else {
            finalSubjects = tr.subjects.slice();
        }
    }

    localStorage.setItem('studymate_profile', JSON.stringify({
        gradeTitle: gradeData.title,
        trackName: trackName,
        subjects: finalSubjects
    }));
    openSubjectsPage();
}

function openSubjectsPage() {
    var saved = localStorage.getItem('studymate_profile');
    if (!saved) {
        alert('اختاري نظامك الدراسي وسنتك أولاً!');
        showStep('step-system');
        return;
    }

    var profile = JSON.parse(saved);
    var allLessons = JSON.parse(localStorage.getItem('studymate_lessons') || '{}');
    var box = document.getElementById('step-subjects');

    var cardsHtml = profile.subjects.map(function(sub) {
        var lessons = allLessons[sub.id] || [];
        var done = lessons.filter(function(l) { return l.status === 'done'; }).length;
        var pct = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
        return '<div class="system-card" onclick="openSubjectDetail(\'' + sub.id + '\')">' +
            '<div class="system-icon" style="background:#EFF6FF;">' + sub.icon + '</div>' +
            '<h3>' + sub.name + '</h3>' +
            '<p>' + done + ' من ' + lessons.length + ' دروس (' + pct + '%)</p>' +
            '<button type="button" class="grade-btn" style="width:100%;">فتح دروس المادة ←</button></div>';
    }).join('');

    box.innerHTML = '<div class="wizard-container">' +
        '<button type="button" class="btn-back" onclick="showStep(\'step-welcome\')">→ الرئيسية</button> ' +
        '<button type="button" class="btn-back" onclick="showStep(\'step-system\')">⚙️ تغيير النظام</button>' +
        '<div class="wizard-header"><span class="step-badge">' + profile.gradeTitle + '</span>' +
        '<h2>📚 موادي الدراسية</h2><p>' + (profile.trackName || 'اضغطي على المادة لإضافة الدروس') + '</p></div>' +
        '<div class="systems-grid">' + cardsHtml + '</div></div>';

    showStep('step-subjects');
}

function openSubjectDetail(subId) {
    activeSubjectId = subId;
    var profile = JSON.parse(localStorage.getItem('studymate_profile'));
    var sub = profile.subjects.find(function(s) { return s.id === subId; });
    var allLessons = JSON.parse(localStorage.getItem('studymate_lessons') || '{}');
    var lessons = allLessons[subId] || [];

