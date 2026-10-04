/* Culinary House — UI translations (RU / UZ). */
(function () {
  "use strict";

  var ru = {
    meta: {
      index: "Culinary House — школа кулинарии и кондитерского искусства в Ташкенте",
      courses: "Курсы — Culinary House",
      teachers: "Преподаватели — Culinary House",
      gallery: "Галерея — Culinary House",
      schedule: "Расписание — Culinary House",
      pricing: "Цены — Culinary House",
      contacts: "Контакты и запись — Culinary House",
      description: "Culinary House — современная школа кулинарии и кондитерского искусства в Ташкенте. Профессиональные курсы, мастер-классы, небольшие группы."
    },
    logoSub: "Школа кулинарии",
    nav: { home: "Главная", courses: "Курсы", teachers: "Преподаватели", gallery: "Галерея", schedule: "Расписание", pricing: "Цены", contacts: "Контакты" },
    ui: {
      book: "Записаться",
      more: "Подробнее",
      menu: "Меню",
      theme: "Сменить тему",
      language: "Язык",
      close: "Закрыть",
      prev: "Назад",
      next: "Вперёд",
      toTop: "Наверх",
      loading: "Загрузка…",
      from: "от",
      currency: "сум",
      price: "Стоимость",
      lesson: ["занятие", "занятия", "занятий"],
      week: ["неделя", "недели", "недель"],
      month: ["месяц", "месяца", "месяцев"],
      seat: ["место", "места", "мест"],
      year: ["год", "года", "лет"],
      monthShortUnit: "мес."
    },
    hero: {
      eyebrow: "Школа кулинарии в Ташкенте",
      title: ["Учись.", "Создавай.", "Вдохновляй."],
      sub: "Culinary House — современная школа кулинарии и кондитерского искусства. Профессиональные курсы и практические мастер-классы на настоящей ресторанной кухне.",
      ctaCourses: "Выбрать курс",
      ctaSchedule: "Посмотреть расписание",
      meta: [["12+", "программ обучения"], ["6–10", "человек в группе"], ["90%", "времени — практика"]],
      scroll: "Листайте"
    },
    about: {
      eyebrow: "О школе",
      title: "Кухня, где рождается <em>мастерство</em>",
      lead: "Мы создали пространство, где каждый — от новичка до практикующего повара — может научиться готовить на профессиональном уровне. Никаких долгих лекций: вы учитесь руками, на своём рабочем месте, под присмотром шефа.",
      features: [
        ["Практическое обучение", "90% времени вы готовите сами, а не смотрите со стороны."],
        ["Профессиональные преподаватели", "Шефы и кондитеры с опытом работы в ресторанах Европы и Азии."],
        ["Современная кухня", "Профессиональное оборудование: конвекционные печи, индукция, планетарные миксеры."],
        ["Небольшие группы", "До 10 человек — шеф успевает уделить внимание каждому."],
        ["Реальные практические занятия", "Готовим полноценные блюда, которые вы потом повторите дома или на работе."]
      ],
      badgeNum: "2018",
      badgeText: "год основания",
      stats: ["курсов", "преподавателей", "учеников", "рейтинг"]
    },
    parallax: {
      p1: {
        eyebrow: "Ваш путь",
        quote: "От первого блюда до <em>профессионального уровня</em>",
        text: "Начните с основ и дойдите до работы в профессии — шаг за шагом, с наставником рядом.",
        btn: "Выбрать программу"
      },
      p2: {
        eyebrow: "Философия",
        quote: "Каждое блюдо — это <em>история</em>, которую вы рассказываете",
        text: "Мы учим не только технике, но и вкусу, подаче и умению вкладывать в еду характер."
      },
      p3: {
        eyebrow: "Атмосфера",
        quote: "Готовить вместе — <em>вкуснее</em>",
        text: "Тёплая компания единомышленников, ароматы свежей выпечки и шеф, который всегда подскажет."
      }
    },
    courses: {
      eyebrow: "Курсы",
      title: "Программы для любого <em>уровня</em>",
      sub: "От базовых навыков до профессионального кондитерского мастерства. Выберите направление и начните уже в этом месяце.",
      filters: { all: "Все", cooking: "Кулинария", pastry: "Кондитерское дело", special: "Специальные курсы" },
      cats: { cooking: "Кулинария", pastry: "Кондитерское дело", special: "Специальный курс" },
      popular: "Хит",
      installment: "Рассрочка 0%",
      allCourses: "Все курсы"
    },
    modal: {
      teacher: "Преподаватель",
      duration: "Длительность",
      start: "Ближайший старт",
      group: "Группа",
      groupValue: "до 10 человек",
      noStart: "Уточняйте у менеджера",
      includesTitle: "Что входит в стоимость",
      includes: ["Все продукты и профессиональный инвентарь", "Фартук и колпак Culinary House", "Электронные рецепты всех блюд", "Сертификат по окончании курса"],
      installment: "Рассрочка 0% на {n} мес. — по {sum} в месяц"
    },
    featured: {
      eyebrow: "Курс сезона",
      tag: "Самый популярный курс",
      desc: "Трёхмесячная профессиональная программа для тех, кто хочет зарабатывать на любимом деле. Вы освоите все базовые и сложные техники французской кондитерской школы и соберёте портфолио.",
      list: ["Песочное, заварное, слоёное тесто", "Кремы, муссы и глазури", "Муссовые и бисквитные торты", "Французские пирожные и тарты", "Темперирование шоколада", "Себестоимость и работа на заказ"],
      metaDuration: "Длительность",
      metaStart: "Старт",
      metaGroup: "Группа",
      groupValue: "до 8 человек",
      floatNum: "92%",
      floatText: "выпускников работают в профессии",
      btnBook: "Записаться на курс",
      btnMore: "О программе"
    },
    teachers: {
      eyebrow: "Преподаватели",
      title: "Наставники с <em>ресторанным</em> опытом",
      sub: "Наши шефы ежедневно работают с продуктом и знают, как передать мастерство так, чтобы оно осталось с вами надолго.",
      exp: "опыта",
      all: "Все преподаватели"
    },
    gallery: {
      eyebrow: "Галерея",
      title: "Жизнь <em>нашей кухни</em>",
      sub: "Блюда учеников, процесс приготовления, наша кухня и тёплые моменты занятий.",
      cats: { all: "Все", dishes: "Блюда", process: "Процесс", kitchen: "Кухня", baking: "Выпечка", students: "Ученики" },
      more: "Смотреть всю галерею",
      open: "Открыть фото"
    },
    calendar: {
      eyebrow: "Расписание",
      title: "Ближайшие <em>запуски</em> курсов",
      sub: "Выберите отмеченную дату в календаре, чтобы увидеть, какие курсы стартуют в этот день.",
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthsGen: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthsShort: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      weekdaysFull: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
      upcoming: "Ближайшие старты",
      onDay: "Старты: {date}",
      showAll: "Показать все",
      seatsLeft: "Свободно",
      of: "из",
      empty: "В этот день стартов нет. Выберите отмеченную дату.",
      legendEvent: "Старт курса",
      legendToday: "Сегодня",
      prevMonth: "Предыдущий месяц",
      nextMonth: "Следующий месяц"
    },
    pricing: {
      eyebrow: "Цены",
      title: "Прозрачные <em>цены</em> без скрытых платежей",
      sub: "В стоимость уже включены продукты, инвентарь и сертификат. Для дорогих программ доступна рассрочка без переплат.",
      popular: "Популярный выбор",
      perLesson: "за занятие",
      fullCourse: "за весь курс",
      installmentShort: "Рассрочка 0% · {n} мес. по {sum}",
      choose: "Выбрать",
      instTitle: "Рассрочка 0% на 3–6 месяцев",
      instText: "Для программ «Кондитерское дело», «Cake Design», «Итальянская кухня» и «Паназиатская кухня» — без банков, процентов и переплат. Первый платёж при записи, остальные — равными частями.",
      instBtn: "Узнать подробнее",
      tableTitle: "Все курсы и цены",
      tableCourse: "Курс",
      tableDuration: "Длительность",
      tableTeacher: "Преподаватель",
      tablePrice: "Стоимость",
      tableInst: "Рассрочка",
      no: "Оплата частями"
    },
    honor: {
      eyebrow: "Доска почёта",
      title: "Наши <em>лучшие</em> выпускники",
      sub: "Мы гордимся каждым учеником. Эти ребята превратили курсы в профессию, победы на конкурсах и собственное дело.",
      places: { gold: "Золото", silver: "Серебро", bronze: "Бронза" },
      graduate: "Выпуск"
    },
    reviews: {
      eyebrow: "Отзывы",
      title: "Что говорят <em>ученики</em>",
      sub: "Средняя оценка наших курсов — 4.9 из 5 по отзывам более 500 выпускников."
    },
    faq: {
      eyebrow: "FAQ",
      title: "Частые <em>вопросы</em>",
      sub: "Собрали ответы на то, о чём нас спрашивают чаще всего перед записью.",
      asideTitle: "Не нашли ответ?",
      asideText: "Напишите нам — ответим в течение 15 минут в рабочее время.",
      asideBtn: "Написать в Telegram"
    },
    booking: {
      eyebrow: "Запись",
      title: "Начните свой <em>кулинарный путь</em>",
      sub: "Оставьте заявку — менеджер перезвонит, ответит на вопросы и забронирует место в группе.",
      formTitle: "Заявка на курс",
      formText: "Заполнение займёт меньше минуты.",
      name: "Имя",
      namePh: "Как к вам обращаться",
      phone: "Телефон",
      phonePh: "+998 90 123 45 67",
      course: "Курс",
      coursePh: "Выберите курс",
      date: "Желаемая дата",
      comment: "Комментарий",
      commentPh: "Опыт, удобное время, вопросы…",
      submit: "Отправить заявку",
      privacy: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
      errors: {
        name: "Введите имя — минимум 2 символа",
        phone: "Введите номер в формате +998 XX XXX XX XX",
        course: "Выберите курс",
        date: "Выберите дату не раньше сегодняшней"
      },
      successTitle: "Заявка отправлена!",
      successText: "Спасибо, {name}! Мы свяжемся с вами в течение 30 минут, чтобы подтвердить запись на курс «{course}».",
      errorTitle: "Проверьте форму",
      errorText: "Пожалуйста, заполните обязательные поля.",
      courseSelectedTitle: "Курс выбран",
      courseSelectedText: "«{course}» — осталось заполнить контакты.",
      contactTitle: "Контакты",
      contactText: "Приходите в гости — покажем кухню и поможем выбрать курс.",
      address: "Адрес",
      addressValue: "г. Ташкент, ул. Шота Руставели, 45",
      phoneLabel: "Телефон",
      hours: "<b>Пн–Сб:</b> 9:00–22:00 · <b>Вс:</b> 10:00–19:00"
    },
    map: { title: "Как нас найти", sub: "Мы находимся в центре Ташкента, рядом с метро «Ойбек». Есть парковка для гостей." },
    cta: {
      title: "Готовы надеть фартук?",
      text: "Запишитесь на курс или пробный мастер-класс — первое занятие подарит заряд вдохновения.",
      btn: "Записаться"
    },
    pages: {
      home: "Главная",
      courses: { title: "Курсы", sub: "12 программ по кулинарии, кондитерскому делу и специальным направлениям." },
      teachers: { title: "Преподаватели", sub: "Познакомьтесь с командой шефов и кондитеров Culinary House." },
      gallery: { title: "Галерея", sub: "Блюда, процесс, кухня и наши ученики — в фотографиях." },
      schedule: { title: "Расписание", sub: "Календарь ближайших запусков курсов и свободные места." },
      pricing: { title: "Цены", sub: "Стоимость обучения, популярные программы и рассрочка 0%." },
      contacts: { title: "Контакты", sub: "Запишитесь на курс или приходите познакомиться с нашей кухней." }
    },
    footer: {
      about: "Современная школа кулинарии и кондитерского искусства в Ташкенте. Профессиональные курсы и мастер-классы для любого уровня.",
      nav: "Навигация",
      contacts: "Контакты",
      follow: "Мы в соцсетях",
      settings: "Язык и тема",
      rights: "© {year} Culinary House. Все права защищены.",
      made: "Сделано с любовью к еде в Ташкенте"
    }
  };

  var uz = {
    meta: {
      index: "Culinary House — Toshkentdagi pazandachilik va qandolatchilik maktabi",
      courses: "Kurslar — Culinary House",
      teachers: "Oʻqituvchilar — Culinary House",
      gallery: "Galereya — Culinary House",
      schedule: "Jadval — Culinary House",
      pricing: "Narxlar — Culinary House",
      contacts: "Kontaktlar va yozilish — Culinary House",
      description: "Culinary House — Toshkentdagi zamonaviy pazandachilik va qandolatchilik maktabi. Professional kurslar, master-klasslar, kichik guruhlar."
    },
    logoSub: "Pazandachilik maktabi",
    nav: { home: "Bosh sahifa", courses: "Kurslar", teachers: "Oʻqituvchilar", gallery: "Galereya", schedule: "Jadval", pricing: "Narxlar", contacts: "Kontaktlar" },
    ui: {
      book: "Yozilish",
      more: "Batafsil",
      menu: "Menyu",
      theme: "Mavzuni almashtirish",
      language: "Til",
      close: "Yopish",
      prev: "Orqaga",
      next: "Oldinga",
      toTop: "Yuqoriga",
      loading: "Yuklanmoqda…",
      from: "",
      currency: "soʻm",
      price: "Narxi",
      lesson: ["ta dars", "ta dars", "ta dars"],
      week: ["hafta", "hafta", "hafta"],
      month: ["oy", "oy", "oy"],
      seat: ["ta oʻrin", "ta oʻrin", "ta oʻrin"],
      year: ["yil", "yil", "yil"],
      monthShortUnit: "oy"
    },
    hero: {
      eyebrow: "Toshkentdagi pazandachilik maktabi",
      title: ["Oʻrgan.", "Yarat.", "Ilhomlantir."],
      sub: "Culinary House — zamonaviy pazandachilik va qandolatchilik maktabi. Haqiqiy restoran oshxonasida professional kurslar va amaliy master-klasslar.",
      ctaCourses: "Kursni tanlash",
      ctaSchedule: "Jadvalni koʻrish",
      meta: [["12+", "oʻquv dasturi"], ["6–10", "kishilik guruhlar"], ["90%", "vaqt — amaliyot"]],
      scroll: "Pastga"
    },
    about: {
      eyebrow: "Maktab haqida",
      title: "<em>Mahorat</em> tugʻiladigan oshxona",
      lead: "Biz yangi boshlovchidan tortib amaliyotchi oshpazgacha har kim professional darajada taom tayyorlashni oʻrganishi mumkin boʻlgan makon yaratdik. Uzoq ma’ruzalar yoʻq: siz oʻz ish joyingizda, shef nazorati ostida qoʻlingiz bilan oʻrganasiz.",
      features: [
        ["Amaliy ta’lim", "Vaqtning 90% ini chetdan kuzatib emas, oʻzingiz pishirib oʻtkazasiz."],
        ["Professional oʻqituvchilar", "Yevropa va Osiyo restoranlarida ishlagan oshpaz va qandolatchilar."],
        ["Zamonaviy oshxona", "Professional jihozlar: konveksion pechlar, induksiya, planetar mikserlar."],
        ["Kichik guruhlar", "10 kishigacha — shef har biriga e’tibor qaratishga ulguradi."],
        ["Haqiqiy amaliy mashgʻulotlar", "Keyin uyda yoki ishda takrorlaydigan toʻlaqonli taomlar tayyorlaymiz."]
      ],
      badgeNum: "2018",
      badgeText: "tashkil topgan yil",
      stats: ["kurs", "oʻqituvchi", "oʻquvchi", "reyting"]
    },
    parallax: {
      p1: {
        eyebrow: "Sizning yoʻlingiz",
        quote: "Birinchi taomdan <em>professional darajagacha</em>",
        text: "Asoslardan boshlang va kasbda ishlashgacha yetib boring — qadamma-qadam, yoningizda ustoz bilan.",
        btn: "Dasturni tanlash"
      },
      p2: {
        eyebrow: "Falsafa",
        quote: "Har bir taom — siz aytib beradigan <em>hikoya</em>",
        text: "Biz nafaqat texnikani, balki ta’m, taqdimot va taomga xarakter baxsh etishni ham oʻrgatamiz."
      },
      p3: {
        eyebrow: "Muhit",
        quote: "Birgalikda pishirish — <em>mazaliroq</em>",
        text: "Hamfikrlarning iliq davrasi, yangi pishiriqlar hidi va doim yoʻl-yoʻriq koʻrsatadigan shef."
      }
    },
    courses: {
      eyebrow: "Kurslar",
      title: "Har qanday <em>daraja</em> uchun dasturlar",
      sub: "Asosiy koʻnikmalardan professional qandolatchilik mahoratigacha. Yoʻnalishni tanlang va shu oyning oʻzida boshlang.",
      filters: { all: "Hammasi", cooking: "Pazandachilik", pastry: "Qandolatchilik", special: "Maxsus kurslar" },
      cats: { cooking: "Pazandachilik", pastry: "Qandolatchilik", special: "Maxsus kurs" },
      popular: "Xit",
      installment: "0% muddatli toʻlov",
      allCourses: "Barcha kurslar"
    },
    modal: {
      teacher: "Oʻqituvchi",
      duration: "Davomiyligi",
      start: "Eng yaqin start",
      group: "Guruh",
      groupValue: "10 kishigacha",
      noStart: "Menejerdan aniqlang",
      includesTitle: "Narxga nimalar kiradi",
      includes: ["Barcha mahsulotlar va professional jihozlar", "Culinary House fartugi va qalpogʻi", "Barcha taomlarning elektron retseptlari", "Kurs yakunida sertifikat"],
      installment: "{n} oyga 0% muddatli toʻlov — oyiga {sum}"
    },
    featured: {
      eyebrow: "Mavsum kursi",
      tag: "Eng mashhur kurs",
      desc: "Sevimli ishidan daromad olishni istaganlar uchun uch oylik professional dastur. Fransuz qandolatchilik maktabining barcha asosiy va murakkab texnikalarini oʻzlashtirasiz hamda portfolio yigʻasiz.",
      list: ["Qumli, qaynatma va qatlamli xamir", "Kremlar, musslar va glazurlar", "Mussli va biskvitli tortlar", "Fransuz pirojnoe va tartlari", "Shokoladni temperlash", "Tannarx va buyurtma asosida ishlash"],
      metaDuration: "Davomiyligi",
      metaStart: "Start",
      metaGroup: "Guruh",
      groupValue: "8 kishigacha",
      floatNum: "92%",
      floatText: "bitiruvchilar kasbda ishlaydi",
      btnBook: "Kursga yozilish",
      btnMore: "Dastur haqida"
    },
    teachers: {
      eyebrow: "Oʻqituvchilar",
      title: "<em>Restoran</em> tajribasiga ega ustozlar",
      sub: "Shef-oshpazlarimiz har kuni mahsulot bilan ishlaydi va mahoratni siz bilan uzoq qoladigan tarzda yetkazishni biladi.",
      exp: "tajriba",
      all: "Barcha oʻqituvchilar"
    },
    gallery: {
      eyebrow: "Galereya",
      title: "<em>Oshxonamiz</em> hayoti",
      sub: "Oʻquvchilar taomlari, tayyorlash jarayoni, oshxonamiz va darslardagi iliq lahzalar.",
      cats: { all: "Hammasi", dishes: "Taomlar", process: "Jarayon", kitchen: "Oshxona", baking: "Pishiriqlar", students: "Oʻquvchilar" },
      more: "Butun galereyani koʻrish",
      open: "Suratni ochish"
    },
    calendar: {
      eyebrow: "Jadval",
      title: "Kurslarning eng yaqin <em>startlari</em>",
      sub: "Shu kuni qaysi kurslar boshlanishini koʻrish uchun kalendarda belgilangan sanani tanlang.",
      months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
      monthsGen: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
      monthsShort: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"],
      weekdays: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
      weekdaysFull: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
      upcoming: "Eng yaqin startlar",
      onDay: "Startlar: {date}",
      showAll: "Hammasini koʻrsatish",
      seatsLeft: "Boʻsh",
      of: "/",
      empty: "Bu kuni startlar yoʻq. Belgilangan sanani tanlang.",
      legendEvent: "Kurs starti",
      legendToday: "Bugun",
      prevMonth: "Oldingi oy",
      nextMonth: "Keyingi oy"
    },
    pricing: {
      eyebrow: "Narxlar",
      title: "Yashirin toʻlovlarsiz <em>shaffof</em> narxlar",
      sub: "Narxga mahsulotlar, jihozlar va sertifikat allaqachon kiritilgan. Qimmat dasturlar uchun ortiqcha toʻlovsiz muddatli toʻlov mavjud.",
      popular: "Ommabop tanlov",
      perLesson: "bir dars uchun",
      fullCourse: "butun kurs uchun",
      installmentShort: "0% muddatli toʻlov · {n} oy, oyiga {sum}",
      choose: "Tanlash",
      instTitle: "3–6 oyga 0% muddatli toʻlov",
      instText: "«Qandolatchilik», «Cake Design», «Italyan oshxonasi» va «Panosiyo oshxonasi» dasturlari uchun — banklarsiz, foizlarsiz va ortiqcha toʻlovlarsiz. Birinchi toʻlov yozilishda, qolganlari teng qismlarda.",
      instBtn: "Batafsil bilish",
      tableTitle: "Barcha kurslar va narxlar",
      tableCourse: "Kurs",
      tableDuration: "Davomiyligi",
      tableTeacher: "Oʻqituvchi",
      tablePrice: "Narxi",
      tableInst: "Muddatli toʻlov",
      no: "Ikki qismda toʻlov"
    },
    honor: {
      eyebrow: "Faxriylar taxtasi",
      title: "Eng <em>yaxshi</em> bitiruvchilarimiz",
      sub: "Biz har bir oʻquvchimiz bilan faxrlanamiz. Ular kurslarni kasbga, tanlovlardagi gʻalabalarga va oʻz biznesiga aylantirdi.",
      places: { gold: "Oltin", silver: "Kumush", bronze: "Bronza" },
      graduate: "Bitiruv"
    },
    reviews: {
      eyebrow: "Fikrlar",
      title: "<em>Oʻquvchilar</em> nima deydi",
      sub: "500 dan ortiq bitiruvchining fikrlariga koʻra kurslarimizning oʻrtacha bahosi — 5 dan 4.9."
    },
    faq: {
      eyebrow: "FAQ",
      title: "Koʻp beriladigan <em>savollar</em>",
      sub: "Yozilishdan oldin bizdan eng koʻp soʻraladigan savollarga javoblarni toʻpladik.",
      asideTitle: "Javob topmadingizmi?",
      asideText: "Bizga yozing — ish vaqtida 15 daqiqa ichida javob beramiz.",
      asideBtn: "Telegramda yozish"
    },
    booking: {
      eyebrow: "Yozilish",
      title: "<em>Pazandachilik yoʻlingizni</em> boshlang",
      sub: "Ariza qoldiring — menejer qoʻngʻiroq qilib, savollarga javob beradi va guruhdan joy band qiladi.",
      formTitle: "Kursga ariza",
      formText: "Toʻldirish bir daqiqadan kam vaqt oladi.",
      name: "Ism",
      namePh: "Sizga qanday murojaat qilaylik",
      phone: "Telefon",
      phonePh: "+998 90 123 45 67",
      course: "Kurs",
      coursePh: "Kursni tanlang",
      date: "Istalgan sana",
      comment: "Izoh",
      commentPh: "Tajriba, qulay vaqt, savollar…",
      submit: "Arizani yuborish",
      privacy: "Tugmani bosish orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirasiz.",
      errors: {
        name: "Ismni kiriting — kamida 2 ta belgi",
        phone: "Raqamni +998 XX XXX XX XX formatida kiriting",
        course: "Kursni tanlang",
        date: "Bugundan oldin boʻlmagan sanani tanlang"
      },
      successTitle: "Ariza yuborildi!",
      successText: "Rahmat, {name}! «{course}» kursiga yozilishni tasdiqlash uchun 30 daqiqa ichida siz bilan bogʻlanamiz.",
      errorTitle: "Shaklni tekshiring",
      errorText: "Iltimos, majburiy maydonlarni toʻldiring.",
      courseSelectedTitle: "Kurs tanlandi",
      courseSelectedText: "«{course}» — kontaktlarni toʻldirish qoldi.",
      contactTitle: "Kontaktlar",
      contactText: "Mehmonga keling — oshxonani koʻrsatamiz va kurs tanlashda yordam beramiz.",
      address: "Manzil",
      addressValue: "Toshkent sh., Shota Rustaveli koʻchasi, 45",
      phoneLabel: "Telefon",
      hours: "<b>Du–Sh:</b> 9:00–22:00 · <b>Ya:</b> 10:00–19:00"
    },
    map: { title: "Bizni qanday topish mumkin", sub: "Biz Toshkent markazida, «Oybek» metrosi yaqinida joylashganmiz. Mehmonlar uchun avtoturargoh bor." },
    cta: {
      title: "Fartuk kiyishga tayyormisiz?",
      text: "Kursga yoki sinov master-klassiga yoziling — birinchi dars ilhom bagʻishlaydi.",
      btn: "Yozilish"
    },
    pages: {
      home: "Bosh sahifa",
      courses: { title: "Kurslar", sub: "Pazandachilik, qandolatchilik va maxsus yoʻnalishlar boʻyicha 12 ta dastur." },
      teachers: { title: "Oʻqituvchilar", sub: "Culinary House shef-oshpaz va qandolatchilar jamoasi bilan tanishing." },
      gallery: { title: "Galereya", sub: "Taomlar, jarayon, oshxona va oʻquvchilarimiz — suratlarda." },
      schedule: { title: "Jadval", sub: "Kurslarning eng yaqin startlari va boʻsh oʻrinlar kalendari." },
      pricing: { title: "Narxlar", sub: "Oʻqish narxi, ommabop dasturlar va 0% muddatli toʻlov." },
      contacts: { title: "Kontaktlar", sub: "Kursga yoziling yoki oshxonamiz bilan tanishgani keling." }
    },
    footer: {
      about: "Toshkentdagi zamonaviy pazandachilik va qandolatchilik maktabi. Har qanday daraja uchun professional kurslar va master-klasslar.",
      nav: "Navigatsiya",
      contacts: "Kontaktlar",
      follow: "Ijtimoiy tarmoqlarda",
      settings: "Til va mavzu",
      rights: "© {year} Culinary House. Barcha huquqlar himoyalangan.",
      made: "Toshkentda taomga muhabbat bilan yaratilgan"
    }
  };

  window.CH_I18N = { ru: ru, uz: uz };
})();
