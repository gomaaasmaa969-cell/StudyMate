const STUDY_DATA = {
    // 1. أولى بكالوريا (مرحلة تمهيدية موحدة)
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

    // 2. تانية بكالوريا (4 مسارات + مادة تخصصية)
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
                id: "med",
                name: "مسار طب وعلوم الحياة",
                color: "#10B981",
                icon: "🧬",
                specializations: [
                    { id: "phys", name: "الفيزياء", icon: "⚡" },
                    { id: "math", name: "الرياضيات", icon: "📐" }
                ]
            },
            {
                id: "eng",
                name: "مسار هندسة وعلوم حاسب",
                color: "#1D63DC",
                icon: "💻",
                specializations: [
                    { id: "chem", name: "الكيمياء", icon: "🧪" },
                    { id: "ai", name: "البرمجة والذكاء الاصطناعي", icon: "🤖" }
                ]
            },
            {
                id: "biz",
                name: "مسار ريادة الأعمال",
                color: "#F59E0B",
                icon: "📊",
                specializations: [
                    { id: "acc", name: "المحاسبة", icon: "💰" },
                    { id: "mgmt", name: "إدارة الأعمال", icon: "💼" }
                ]
            },
            {
                id: "arts",
                name: "مسار الآداب والفنون",
                color: "#8B5CF6",
                icon: "🎨",
                specializations: [
                    { id: "psych", name: "علم النفس", icon: "🧠" },
                    { id: "lang2", name: "اللغة الأجنبية الثانية", icon: "🗣️" }
                ]
            }
        ]
    },

    // 3. تالتة ثانوي (الثانوية العامة المصرية - 3 شعب)
    sec3: {
        title: "تالتة ثانوي (ثانوية عامة)",
        needsTrack: true,
        trackLabel: "اختر شعبتك الدراسية",
        tracks: [
            {
                id: "sci_bio",
                name: "علمي علوم",
                color: "#10B981",
                icon: "🩺",
                subjects: [
