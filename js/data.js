/* Culinary House — content data.
   Localized fields are { ru, uz } objects.
   To replace photos, change the URLs below (or point them to files in assets/img/). */
(function () {
  "use strict";

  var PH = {
    food: "assets/img/placeholders/food.svg",
    portrait: "assets/img/placeholders/portrait.svg",
    kitchen: "assets/img/placeholders/kitchen.svg"
  };

  function U(id, w, h) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 900) +
      (h ? "&h=" + h : "") + "&q=80";
  }

  var images = {
    hero: U("1556910103-1c02745aae4d", 2000),
    about1: U("1595257841889-eca2678454e2", 700, 930),
    about2: U("1622021142947-da7dedc7c39a", 700, 930),
    featured: U("1486427944299-d1955d23e34d", 1200, 1300),
    parallax1: U("1414235077428-338989a2e8c0", 2000),
    parallax2: U("1555939594-58d7cb561ad1", 2000),
    parallax3: U("1495521821757-a1efb6729352", 2000),
    contact: U("1556909114-f6e7ad7d3136", 1000),
    pages: {
      courses: U("1466637574441-749b8f19452f", 2000),
      teachers: U("1577219491135-ce391730fb2c", 2000),
      gallery: U("1504674900247-0877df9cc836", 2000),
      schedule: U("1556909114-f6e7ad7d3136", 2000),
      pricing: U("1551024601-bec78aea704b", 2000),
      contacts: U("1556911220-bff31c812dba", 2000)
    }
  };

  var teachers = [
    {
      id: "alina",
      name: { ru: "Алина Каримова", uz: "Alina Karimova" },
      role: { ru: "Шеф-повар, преподаватель", uz: "Oshpaz-oʻqituvchi" },
      icon: "chef",
      exp: 12,
      bio: {
        ru: "Работала су-шефом в ресторанах Стамбула и Дубая. Ведёт базовые курсы и итальянскую кухню, учит понимать продукт и технику, а не просто повторять рецепт.",
        uz: "Istanbul va Dubay restoranlarida su-shef boʻlib ishlagan. Asosiy kurslar va italyan oshxonasini olib boradi, retseptni takrorlashni emas, mahsulot va texnikani tushunishni oʻrgatadi."
      },
      tags: { ru: ["Европейская кухня", "Италия", "Техника ножа"], uz: ["Yevropa oshxonasi", "Italiya", "Pichoq texnikasi"] }
    },
    {
      id: "david",
      name: { ru: "Давид Мартиросян", uz: "David Martirosyan" },
      role: { ru: "Шеф-кондитер", uz: "Bosh qandolatchi" },
      icon: "whisk",
      exp: 15,
      bio: {
        ru: "Обучался французскому кондитерскому искусству в Париже, 15 лет в профессии. Руководитель программы «Кондитерское дело» и автор курса по шоколаду.",
        uz: "Parijda fransuz qandolatchilik san’atini oʻrgangan, kasbda 15 yil. «Qandolatchilik» dasturi rahbari va shokolad kursi muallifi."
      },
      tags: { ru: ["Французские десерты", "Шоколад", "Темперирование"], uz: ["Fransuz desertlari", "Shokolad", "Temperlash"] }
    },
    {
      id: "malika",
      name: { ru: "Малика Рахимова", uz: "Malika Rahimova" },
      role: { ru: "Шеф-повар, преподаватель", uz: "Oshpaz-oʻqituvchi" },
      icon: "plate",
      exp: 10,
      bio: {
        ru: "Знаток узбекской и паназиатской кухни. Бережно хранит семейные рецепты плова и самсы и умеет сочетать их с современной подачей.",
        uz: "Oʻzbek va panosiyo oshxonasi bilimdoni. Palov va somsaning oilaviy retseptlarini asraydi va ularni zamonaviy taqdimot bilan uygʻunlashtiradi."
      },
      tags: { ru: ["Узбекская кухня", "Азия", "Healthy"], uz: ["Oʻzbek oshxonasi", "Osiyo", "Healthy"] }
    },
    {
      id: "anna",
      name: { ru: "Анна Соколова", uz: "Anna Sokolova" },
      role: { ru: "Кондитер, преподаватель", uz: "Qandolatchi-oʻqituvchi" },
      icon: "cake",
      exp: 8,
      bio: {
        ru: "Специалист по хлебу на закваске, круассанам и дизайну тортов. Ведёт Cake Design и детскую кулинарную школу — терпеливо и с вдохновением.",
        uz: "Xamirturushli non, kruassan va tort dizayni boʻyicha mutaxassis. Cake Design va bolalar pazandachilik maktabini sabr va ilhom bilan olib boradi."
      },
      tags: { ru: ["Хлеб и выпечка", "Cake Design", "Детские группы"], uz: ["Non va pishiriqlar", "Cake Design", "Bolalar guruhlari"] }
    },
    {
      id: "timur",
      name: { ru: "Тимур Ахмедов", uz: "Timur Ahmedov" },
      role: { ru: "Фуд-фотограф", uz: "Fud-fotograf" },
      icon: "camera",
      exp: 9,
      bio: {
        ru: "Снимает меню для ресторанов Ташкента и рекламные кампании брендов. Научит ставить свет, строить композицию и фотографировать еду на телефон и камеру.",
        uz: "Toshkent restoranlari menyulari va brendlarning reklama kampaniyalarini suratga oladi. Yorugʻlik qoʻyish, kompozitsiya va taomni telefon hamda kamerada suratga olishni oʻrgatadi."
      },
      tags: { ru: ["Свет", "Композиция", "Фуд-стайлинг"], uz: ["Yorugʻlik", "Kompozitsiya", "Fud-stayling"] }
    }
  ];

  /* cat: cooking | pastry | special. installment: months of 0% installment (0 = not available). */
  var courses = [
    {
      id: "basics", cat: "cooking", teacher: "alina", lessons: 8, weeks: 4, price: 2400000, installment: 0,
      image: U("1466637574441-749b8f19452f"),
      title: { ru: "Основы кулинарии", uz: "Pazandachilik asoslari" },
      desc: {
        ru: "Работа с ножом, базовые техники, соусы, гарниры и подача. Идеальный старт для тех, кто хочет готовить уверенно.",
        uz: "Pichoq bilan ishlash, asosiy texnikalar, souslar, garnirlar va taqdimot. Ishonch bilan taom tayyorlashni istaganlar uchun ideal start."
      }
    },
    {
      id: "italian", cat: "cooking", teacher: "alina", lessons: 8, weeks: 4, price: 2800000, installment: 3,
      image: U("1565299624946-b28f40a0ae38"),
      title: { ru: "Итальянская кухня", uz: "Italyan oshxonasi" },
      desc: {
        ru: "Неаполитанская пицца, ризотто, свежая паста и классические десерты Италии — от теста до идеальной подачи.",
        uz: "Neapol pitsasi, rizotto, yangi pasta va Italiyaning klassik desertlari — xamirdan mukammal taqdimotgacha."
      }
    },
    {
      id: "uzbek", cat: "cooking", teacher: "malika", lessons: 6, weeks: 3, price: 2200000, installment: 0,
      image: U("1512058564366-18510be2db19"),
      title: { ru: "Узбекская кухня", uz: "Oʻzbek oshxonasi" },
      desc: {
        ru: "Плов, лагман, самса, манты и шурпа. Секреты традиционных рецептов и современная подача национальных блюд.",
        uz: "Palov, lagʻmon, somsa, manti va shoʻrva. An’anaviy retseptlar sirlari va milliy taomlarning zamonaviy taqdimoti."
      }
    },
    {
      id: "asian", cat: "cooking", teacher: "malika", lessons: 8, weeks: 4, price: 2900000, installment: 3,
      image: U("1569718212165-3a8278d5f624"),
      title: { ru: "Паназиатская кухня", uz: "Panosiyo oshxonasi" },
      desc: {
        ru: "Рамен, вок, димсамы, том ям и роллы. Баланс вкусов Азии, работа с соусами и специями.",
        uz: "Ramen, vok, dimsamlar, tom yam va rollar. Osiyo ta’mlari muvozanati, souslar va ziravorlar bilan ishlash."
      }
    },
    {
      id: "pastry", cat: "pastry", teacher: "david", lessons: 24, weeks: 12, price: 6900000, installment: 6, popular: true,
      image: U("1551024601-bec78aea704b"),
      title: { ru: "Кондитерское дело", uz: "Qandolatchilik" },
      desc: {
        ru: "Профессиональная программа: тесты, кремы, муссовые торты, пирожные и французские десерты. Сертификат по окончании.",
        uz: "Professional dastur: xamirlar, kremlar, mussli tortlar, pirojnoe va fransuz desertlari. Yakunida sertifikat."
      }
    },
    {
      id: "cake", cat: "pastry", teacher: "anna", lessons: 10, weeks: 5, price: 3900000, installment: 3,
      image: U("1464349095431-e9a21285b5f3"),
      title: { ru: "Cake Design", uz: "Cake Design" },
      desc: {
        ru: "Ярусные торты, выравнивание кремом, работа с мастикой, цветы из крема и современный декор.",
        uz: "Koʻp qavatli tortlar, krem bilan tekislash, mastika bilan ishlash, kremdan gullar va zamonaviy bezak."
      }
    },
    {
      id: "bread", cat: "pastry", teacher: "anna", lessons: 8, weeks: 4, price: 2600000, installment: 0,
      image: U("1509440159596-0249088772ff"),
      title: { ru: "Выпечка и хлеб", uz: "Non va pishiriqlar" },
      desc: {
        ru: "Хлеб на закваске, багеты, фокачча, круассаны и слоёное тесто. Понимание брожения и работы с мукой.",
        uz: "Xamirturushli non, baget, fokachcha, kruassan va qatlamli xamir. Bijgʻish jarayoni va un bilan ishlashni tushunish."
      }
    },
    {
      id: "chocolate", cat: "pastry", teacher: "david", lessons: 6, weeks: 3, price: 2700000, installment: 0,
      image: U("1511381939415-e44015466834"),
      title: { ru: "Шоколад и конфеты", uz: "Shokolad va konfetlar" },
      desc: {
        ru: "Темперирование, корпусные конфеты, трюфели, плитки и шоколадный декор ручной работы.",
        uz: "Temperlash, korpusli konfetlar, tryufellar, plitkalar va qoʻlda yasalgan shokolad bezaklari."
      }
    },
    {
      id: "healthy", cat: "special", teacher: "malika", lessons: 6, weeks: 3, price: 2100000, installment: 0,
      image: U("1512621776951-a57141f2eefd"),
      title: { ru: "Healthy Cooking", uz: "Healthy Cooking" },
      desc: {
        ru: "Полезное питание без скуки: боулы, ПП-десерты, ферментация и меню на неделю с расчётом баланса.",
        uz: "Zerikarli boʻlmagan sogʻlom ovqatlanish: boullar, PP-desertlar, fermentatsiya va muvozanatli haftalik menyu."
      }
    },
    {
      id: "pasta", cat: "cooking", teacher: "alina", lessons: 4, weeks: 2, price: 1500000, installment: 0,
      image: U("1621996346565-e3dbc646d9a9"),
      title: { ru: "Pasta & Sauces", uz: "Pasta & Sauces" },
      desc: {
        ru: "Свежая паста вручную: тальятелле, равиоли, ньокки и пять базовых соусов итальянской кухни.",
        uz: "Qoʻlda tayyorlangan yangi pasta: talyatelle, ravioli, nyokki va italyan oshxonasining beshta asosiy sousi."
      }
    },
    {
      id: "kids", cat: "special", teacher: "anna", lessons: 8, weeks: 4, price: 1600000, installment: 0,
      image: U("1558961363-fa8fdf82db35"),
      title: { ru: "Детская кулинарная школа", uz: "Bolalar pazandachilik maktabi" },
      desc: {
        ru: "Для детей 7–12 лет: печенье, пицца, простые салаты и безопасная работа на кухне в игровой форме.",
        uz: "7–12 yoshli bolalar uchun: pechene, pitsa, oddiy salatlar va oshxonada xavfsiz ishlash — oʻyin shaklida."
      }
    },
    {
      id: "photo", cat: "special", teacher: "timur", lessons: 6, weeks: 3, price: 2500000, installment: 0,
      image: U("1490645935967-10de6ba17061"),
      title: { ru: "Food Photography", uz: "Food Photography" },
      desc: {
        ru: "Свет, композиция, фуд-стайлинг и обработка. Снимаем еду для меню, блога и соцсетей на камеру и смартфон.",
        uz: "Yorugʻlik, kompozitsiya, fud-stayling va ishlov berish. Menyu, blog va ijtimoiy tarmoqlar uchun taomni kamera va smartfonda suratga olamiz."
      }
    }
  ];

  /* Launch dates are offsets (in days) from today, so the calendar never goes stale. */
  var launches = [
    { course: "basics", offset: 3, time: "18:30", seats: 4, total: 10 },
    { course: "pastry", offset: 6, time: "10:00", seats: 2, total: 8 },
    { course: "italian", offset: 9, time: "18:30", seats: 6, total: 10 },
    { course: "kids", offset: 13, time: "11:00", seats: 5, total: 8 },
    { course: "uzbek", offset: 16, time: "18:00", seats: 7, total: 10 },
    { course: "cake", offset: 20, time: "10:00", seats: 2, total: 8 },
    { course: "photo", offset: 24, time: "15:00", seats: 6, total: 10 },
    { course: "asian", offset: 27, time: "18:30", seats: 8, total: 10 },
    { course: "pasta", offset: 27, time: "11:00", seats: 5, total: 10 },
    { course: "chocolate", offset: 33, time: "11:00", seats: 5, total: 8 },
    { course: "healthy", offset: 37, time: "18:00", seats: 9, total: 12 },
    { course: "bread", offset: 41, time: "10:00", seats: 4, total: 8 },
    { course: "basics", offset: 48, time: "18:30", seats: 8, total: 10 },
    { course: "pastry", offset: 58, time: "10:00", seats: 6, total: 8 },
    { course: "italian", offset: 66, time: "18:30", seats: 10, total: 10 },
    { course: "cake", offset: 76, time: "10:00", seats: 7, total: 8 },
    { course: "uzbek", offset: 86, time: "18:00", seats: 10, total: 10 },
    { course: "kids", offset: 96, time: "11:00", seats: 8, total: 8 }
  ];

  var plans = [
    {
      id: "masterclass", price: 350000, unit: "perLesson", course: "",
      type: { ru: "Мастер-класс", uz: "Master-klass" },
      name: { ru: "Разовое занятие", uz: "Bir martalik dars" },
      desc: { ru: "Попробуйте формат школы за один вечер", uz: "Maktab formatini bir oqshomda sinab koʻring" },
      features: {
        ru: ["3 часа практики у плиты", "Все продукты и фартук", "Ужин из приготовленного", "Рецепты на почту"],
        uz: ["Plita yonida 3 soat amaliyot", "Barcha mahsulotlar va fartuk", "Tayyorlangan taomlardan kechki ovqat", "Retseptlar pochtaga"]
      }
    },
    {
      id: "basics", price: 2400000, unit: "fullCourse", course: "basics",
      type: { ru: "Старт", uz: "Start" },
      name: { ru: "Основы кулинарии", uz: "Pazandachilik asoslari" },
      desc: { ru: "Базовые техники для уверенной готовки дома", uz: "Uyda ishonch bilan pishirish uchun asosiy texnikalar" },
      features: {
        ru: ["8 занятий по 3 часа", "Группа до 10 человек", "Продукты и инвентарь", "Сертификат школы"],
        uz: ["3 soatdan 8 ta dars", "10 kishigacha guruh", "Mahsulotlar va jihozlar", "Maktab sertifikati"]
      }
    },
    {
      id: "pastry", price: 6900000, unit: "fullCourse", course: "pastry", popular: true,
      type: { ru: "Профессия", uz: "Kasb" },
      name: { ru: "Кондитерское дело", uz: "Qandolatchilik" },
      desc: { ru: "Полная программа для работы в профессии", uz: "Kasbda ishlash uchun toʻliq dastur" },
      features: {
        ru: ["24 занятия, 3 месяца", "Группа до 8 человек", "Стажировка в кондитерской", "Профессиональный сертификат", "Помощь с портфолио"],
        uz: ["24 ta dars, 3 oy", "8 kishigacha guruh", "Qandolatxonada amaliyot", "Professional sertifikat", "Portfolio boʻyicha yordam"]
      }
    },
    {
      id: "cake", price: 3900000, unit: "fullCourse", course: "cake",
      type: { ru: "Мастерство", uz: "Mahorat" },
      name: { ru: "Cake Design", uz: "Cake Design" },
      desc: { ru: "Торты, которые хочется фотографировать", uz: "Suratga olgingiz keladigan tortlar" },
      features: {
        ru: ["10 занятий по 4 часа", "Группа до 8 человек", "Набор инструментов в подарок", "Сертификат школы"],
        uz: ["4 soatdan 10 ta dars", "8 kishigacha guruh", "Sovgʻa sifatida asboblar toʻplami", "Maktab sertifikati"]
      }
    }
  ];

  var honor = [
    {
      name: { ru: "Нигора Юсупова", uz: "Nigora Yusupova" }, course: "pastry", medal: "gold", year: 2026,
      colors: ["#b8894a", "#4a3218"],
      achievement: { ru: "Золотая медаль конкурса Tashkent Pastry Cup 2026 в номинации «Муссовый торт»", uz: "Tashkent Pastry Cup 2026 tanlovida «Mussli tort» nominatsiyasi boʻyicha oltin medal" }
    },
    {
      name: { ru: "Азиз Хамидов", uz: "Aziz Hamidov" }, course: "italian", medal: "gold", year: 2025,
      colors: ["#a87d4e", "#3c2a1a"],
      achievement: { ru: "Стал су-шефом итальянского ресторана в центре Ташкента через полгода после выпуска", uz: "Bitirgandan yarim yil oʻtib Toshkent markazidagi italyan restoranida su-shef boʻldi" }
    },
    {
      name: { ru: "Севара Ташпулатова", uz: "Sevara Toshpoʻlatova" }, course: "cake", medal: "silver", year: 2026,
      colors: ["#9e7f86", "#3a2a30"],
      achievement: { ru: "Открыла собственную кондитерскую студию — более 1 200 выполненных заказов", uz: "Oʻzining qandolat studiyasini ochdi — 1 200 dan ortiq bajarilgan buyurtma" }
    },
    {
      name: { ru: "Бекзод Нурматов", uz: "Bekzod Nurmatov" }, course: "uzbek", medal: "silver", year: 2025,
      colors: ["#8a7a52", "#33301c"],
      achievement: { ru: "Победитель конкурса «Лучший плов» на фестивале Tashkent Food Fest", uz: "Tashkent Food Fest festivalidagi «Eng yaxshi palov» tanlovi gʻolibi" }
    },
    {
      name: { ru: "Камила Рашидова", uz: "Kamila Rashidova" }, course: "photo", medal: "bronze", year: 2026,
      colors: ["#7b6b8e", "#2c2438"],
      achievement: { ru: "Снимает меню для 15 ресторанов и кафе города", uz: "Shahardagi 15 ta restoran va kafe uchun menyu suratga oladi" }
    },
    {
      name: { ru: "Артём Ким", uz: "Artyom Kim" }, course: "asian", medal: "bronze", year: 2025,
      colors: ["#5d7f78", "#1e302c"],
      achievement: { ru: "Запустил собственный стрит-фуд проект с паназиатским меню", uz: "Panosiyo menyuli oʻz strit-fud loyihasini ishga tushirdi" }
    }
  ];

  var reviews = [
    {
      name: { ru: "Гульноза Алиева", uz: "Gulnoza Aliyeva" }, course: "basics", rating: 5,
      text: {
        ru: "Пришла с нулевым уровнем, а через месяц приготовила семье ужин из трёх блюд. Алина объясняет так, что всё получается с первого раза.",
        uz: "Noldan keldim, bir oydan soʻng oilam uchun uch xil taomdan iborat kechki ovqat tayyorladim. Alina shunday tushuntiradiki, hammasi birinchi urinishdayoq chiqadi."
      }
    },
    {
      name: { ru: "Рустам Каримов", uz: "Rustam Karimov" }, course: "italian", rating: 5,
      text: {
        ru: "Наконец понял, как делать настоящее ризотто и пасту без магазинных полуфабрикатов. Атмосфера на занятиях — как в хорошем ресторане.",
        uz: "Nihoyat, doʻkon yarim tayyor mahsulotlarisiz haqiqiy rizotto va pastani qanday tayyorlashni tushundim. Darslardagi muhit — xuddi yaxshi restorandagidek."
      }
    },
    {
      name: { ru: "Елена Пак", uz: "Yelena Pak" }, course: "pastry", rating: 5,
      text: {
        ru: "Программа по кондитерскому делу изменила мою жизнь: сейчас работаю в кондитерской и беру заказы. Давид — настоящий мастер и наставник.",
        uz: "Qandolatchilik dasturi hayotimni oʻzgartirdi: hozir qandolatxonada ishlayman va buyurtmalar olaman. David — haqiqiy usta va ustoz."
      }
    },
    {
      name: { ru: "Шахзод Умаров", uz: "Shahzod Umarov" }, course: "photo", rating: 5,
      text: {
        ru: "Тимур научил видеть свет. Мои фотографии для кафе стали в разы лучше, а количество заказов выросло уже через месяц после курса.",
        uz: "Timur yorugʻlikni koʻrishni oʻrgatdi. Kafe uchun suratlarim bir necha barobar yaxshilandi, kursdan bir oy oʻtib buyurtmalar soni oshdi."
      }
    },
    {
      name: { ru: "Мадина Исмоилова", uz: "Madina Ismoilova" }, course: "cake", rating: 5,
      text: {
        ru: "Каждое занятие — маленький праздник. Теперь пеку торты на дни рождения друзьям, и все спрашивают, где я этому научилась.",
        uz: "Har bir dars — kichik bayram. Endi doʻstlarimga tugʻilgan kun uchun tort pishiraman, hamma buni qayerda oʻrganganimni soʻraydi."
      }
    },
    {
      name: { ru: "Ольга Ли", uz: "Olga Li" }, course: "kids", rating: 4,
      text: {
        ru: "Сын ходит в детскую школу с удовольствием и дома теперь сам готовит завтраки. Хотелось бы больше групп по выходным.",
        uz: "Oʻglim bolalar maktabiga zavq bilan qatnaydi va endi uyda nonushtani oʻzi tayyorlaydi. Dam olish kunlari guruhlar koʻproq boʻlishini istardik."
      }
    }
  ];

  var gallery = [
    { cat: "dishes", src: U("1504674900247-0877df9cc836", 800, 1000), caption: { ru: "Подача горячего блюда", uz: "Issiq taom taqdimoti" } },
    { cat: "process", src: U("1507048331197-7d4ac70811cf", 800, 600), caption: { ru: "Шеф за работой", uz: "Ish ustidagi oshpaz" } },
    { cat: "baking", src: U("1509440159596-0249088772ff", 800, 1000), caption: { ru: "Хлеб на закваске", uz: "Xamirturushli non" } },
    { cat: "kitchen", src: U("1556909114-f6e7ad7d3136", 800, 600), caption: { ru: "Учебная кухня", uz: "Oʻquv oshxonasi" } },
    { cat: "dishes", src: U("1540189549336-e6e99c3679fe", 800, 800), caption: { ru: "Сезонный салат", uz: "Mavsumiy salat" } },
    { cat: "students", src: U("1577219491135-ce391730fb2c", 800, 1000), caption: { ru: "Выпускник программы", uz: "Dastur bitiruvchisi" } },
    { cat: "baking", src: U("1555507036-ab1f4038808a", 800, 600), caption: { ru: "Круассаны", uz: "Kruassanlar" } },
    { cat: "process", src: U("1466637574441-749b8f19452f", 800, 1000), caption: { ru: "Подготовка овощей", uz: "Sabzavotlarni tayyorlash" } },
    { cat: "dishes", src: U("1414235077428-338989a2e8c0", 800, 600), caption: { ru: "Ресторанная подача", uz: "Restoran taqdimoti" } },
    { cat: "baking", src: U("1578985545062-69928b1d9587", 800, 1000), caption: { ru: "Шоколадный торт", uz: "Shokoladli tort" } },
    { cat: "kitchen", src: U("1556911220-bff31c812dba", 800, 1000), caption: { ru: "Рабочее место ученика", uz: "Oʻquvchining ish joyi" } },
    { cat: "students", src: U("1581299894007-aaa50297cf16", 800, 600), caption: { ru: "Практика в группе", uz: "Guruhda amaliyot" } },
    { cat: "process", src: U("1495521821757-a1efb6729352", 800, 800), caption: { ru: "Ингредиенты", uz: "Ingrediyentlar" } },
    { cat: "dishes", src: U("1565299624946-b28f40a0ae38", 800, 1000), caption: { ru: "Неаполитанская пицца", uz: "Neapol pitsasi" } },
    { cat: "baking", src: U("1486427944299-d1955d23e34d", 800, 600), caption: { ru: "Пирожные", uz: "Pirojnoe" } },
    { cat: "dishes", src: U("1621996346565-e3dbc646d9a9", 800, 800), caption: { ru: "Свежая паста", uz: "Yangi pasta" } }
  ];

  var faq = [
    {
      q: { ru: "Как записаться на курс?", uz: "Kursga qanday yozilish mumkin?" },
      a: {
        ru: "Оставьте заявку в форме на сайте, напишите нам в Telegram @culinaryhouse_uz или позвоните по номеру +998 71 200 45 45. Менеджер подтвердит место в группе и расскажет о деталях в течение 30 минут.",
        uz: "Saytdagi shaklda ariza qoldiring, Telegramda @culinaryhouse_uz ga yozing yoki +998 71 200 45 45 raqamiga qoʻngʻiroq qiling. Menejer 30 daqiqa ichida guruhdagi joyni tasdiqlaydi va tafsilotlarni aytib beradi."
      }
    },
    {
      q: { ru: "Нужен ли опыт?", uz: "Tajriba kerakmi?" },
      a: {
        ru: "Нет. Большинство программ рассчитаны на новичков — мы начинаем с основ. Для профессиональных курсов проводим короткую консультацию и подбираем подходящий уровень.",
        uz: "Yoʻq. Aksariyat dasturlar yangi boshlovchilar uchun moʻljallangan — biz asoslardan boshlaymiz. Professional kurslar uchun qisqa maslahat oʻtkazamiz va mos darajani tanlaymiz."
      }
    },
    {
      q: { ru: "Что входит в стоимость?", uz: "Narxga nimalar kiradi?" },
      a: {
        ru: "Все продукты, профессиональный инвентарь, фартук и колпак, рецепты в электронном виде, дегустация приготовленного и сертификат Culinary House по окончании курса.",
        uz: "Barcha mahsulotlar, professional jihozlar, fartuk va qalpoq, elektron retseptlar, tayyorlangan taomlarni tatib koʻrish va kurs yakunida Culinary House sertifikati."
      }
    },
    {
      q: { ru: "Нужно ли приносить свои продукты?", uz: "Oʻz mahsulotlarimni olib kelishim kerakmi?" },
      a: {
        ru: "Нет, всё необходимое мы закупаем сами: свежие и качественные продукты от проверенных поставщиков. Достаточно прийти в удобной обуви и с хорошим настроением.",
        uz: "Yoʻq, barcha kerakli narsalarni oʻzimiz xarid qilamiz: ishonchli yetkazib beruvchilardan yangi va sifatli mahsulotlar. Qulay poyabzal va yaxshi kayfiyat bilan kelish kifoya."
      }
    },
    {
      q: { ru: "Можно ли оплатить курс частями?", uz: "Kurs uchun boʻlib toʻlash mumkinmi?" },
      a: {
        ru: "Да. Для программ «Кондитерское дело», «Cake Design», «Итальянская кухня» и «Паназиатская кухня» доступна рассрочка 0% на 3–6 месяцев без переплат. Остальные курсы можно оплатить двумя частями.",
        uz: "Ha. «Qandolatchilik», «Cake Design», «Italyan oshxonasi» va «Panosiyo oshxonasi» dasturlari uchun 3–6 oyga ortiqcha toʻlovsiz 0% muddatli toʻlov mavjud. Qolgan kurslarni ikki qismda toʻlash mumkin."
      }
    },
    {
      q: { ru: "Можно ли перенести занятие?", uz: "Darsni boshqa kunga koʻchirish mumkinmi?" },
      a: {
        ru: "Да, предупредите нас минимум за 24 часа — мы предложим отработку с параллельной группой или индивидуальное занятие. За весь курс можно перенести до двух занятий.",
        uz: "Ha, kamida 24 soat oldin xabar bering — parallel guruh bilan qayta oʻtish yoki individual darsni taklif qilamiz. Butun kurs davomida ikkitagacha darsni koʻchirish mumkin."
      }
    }
  ];

  window.CH_DATA = {
    placeholders: PH,
    images: images,
    teachers: teachers,
    courses: courses,
    launches: launches,
    plans: plans,
    honor: honor,
    reviews: reviews,
    gallery: gallery,
    faq: faq,
    featuredCourse: "pastry",
    contacts: {
      phone: "+998 71 200 45 45",
      phoneHref: "tel:+998712004545",
      telegram: "@culinaryhouse_uz",
      telegramHref: "https://t.me/culinaryhouse_uz",
      instagram: "@culinaryhouse.uz",
      instagramHref: "https://instagram.com/culinaryhouse.uz",
      mapQuery: "Tashkent, Shota Rustaveli street 45"
    }
  };
})();
