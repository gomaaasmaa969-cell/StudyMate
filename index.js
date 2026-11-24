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
    var done = lessons.filter(function(l) { return l.status === 'done'; }).length;
    var pct = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;

    var listHtml = lessons.length === 0 ? '<p style="text-align:center;">لا توجد دروس بعد</p>' : lessons.map(function(l, i) {
        return '<div style="background:#fff; padding:12px; border-radius:15px; border:2px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
            '<strong>' + l.name + '</strong><div>' +
            '<select onchange="setLessonStatus(' + i + ', this.value)" style="padding:6px; border-radius:10px;">' +
            '<option value="not_started" ' + (l.status === 'not_started' ? 'selected' : '') + '>⚪ لم أبدأ</option>' +
            '<option value="in_progress" ' + (l.status === 'in_progress' ? 'selected' : '') + '>🔵 قيد الدراسة</option>' +
            '<option value="done" ' + (l.status === 'done' ? 'selected' : '') + '>🟢 اكتمل</option>' +
            '<option value="review" ' + (l.status === 'review' ? 'selected' : '') + '>🟡 مراجعة</option></select> ' +
            '<button type="button" onclick="delLesson(' + i + ')" style="background:#FEE2E2; color:#DC2626; border:none; padding:6px 10px; border-radius:10px;">حذف</button></div></div>';
    }).join('');

    document.getElementById('step-subject-detail').innerHTML = '<div class="wizard-container">' +
        '<button type="button" class="btn-back" onclick="openSubjectsPage()">→ رجوع لموادي</button>' +
        '<div class="wizard-header"><h2>' + sub.icon + ' ' + sub.name + '</h2><p>الإنجاز: ' + pct + '% (' + done + '/' + lessons.length + ')</p></div>' +
        '<div style="display:flex; gap:10px; margin-bottom:20px;">' +
        '<input id="inp-lesson" placeholder="اكتبي اسم الدرس..." style="flex:1; padding:12px; border-radius:14px; border:2px solid #CBD5E1;">' +
        '<button type="button" class="btn-primary" style="padding:12px 20px;" onclick="addLesson()">+ إضافة</button></div>' +
        listHtml + '</div>';

    showStep('step-subject-detail');
}

function addLesson() {
    var name = document.getElementById('inp-lesson').value.trim();
    if (!name) return;
    var all = JSON.parse(localStorage.getItem('studymate_lessons') || '{}');
    if (!all[activeSubjectId]) all[activeSubjectId] = [];
    all[activeSubjectId].push({ name: name, status: 'not_started' });
    localStorage.setItem('studymate_lessons', JSON.stringify(all));
    openSubjectDetail(activeSubjectId);
}

function setLessonStatus(idx, st) {
    var all = JSON.parse(localStorage.getItem('studymate_lessons') || '{}');
    all[activeSubjectId][idx].status = st;
    localStorage.setItem('studymate_lessons', JSON.stringify(all));
    openSubjectDetail(activeSubjectId);
}

function delLesson(idx) {
    var all = JSON.parse(localStorage.getItem('studymate_lessons') || '{}');
    all[activeSubjectId].splice(idx, 1);
    localStorage.setItem('studymate_lessons', JSON.stringify(all));
    openSubjectDetail(activeSubjectId);
}

function openTasksPage() {
    var tasks = JSON.parse(localStorage.getItem('studymate_tasks') || '[]');
    var listHtml = tasks.length === 0 ? '<p style="text-align:center;">لا توجد مهام بعد</p>' : tasks.map(function(t, i) {
        return '<div style="background:#fff; padding:12px; border-radius:15px; border:2px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
            '<label><input type="checkbox" ' + (t.done ? 'checked' : '') + ' onchange="toggleTask(' + i + ')"> ' +
            '<strong style="' + (t.done ? 'text-decoration:line-through;opacity:0.6' : '') + '">' + t.title + '</strong></label>' +
