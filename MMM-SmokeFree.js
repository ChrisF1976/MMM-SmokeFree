Module.register("MMM-SmokeFree", {
  defaults: {
    startDate: "2024-12-01",
    cigarettesPerDay: 20,
    pricePerPack: 8.0,
    cigarettesPerPack: 20,
    updateInterval: 60 * 60 * 1000, // 1 Stunde
    motivationalText: true,
    style: "magnet" // oder "simple"
  },

  motivationalPhrases: {
    de: [
      "Jede Zigarette, die du nicht rauchst, ist ein Sieg!",
      "Du atmest Freiheit ein!",
      "Deine Lunge dankt dir!",
      "Bleib stark, du schaffst das!",
      "1000€ sind näher als du denkst!"
    ],
    en: [
      "Every cigarette you don't smoke is a victory!",
      "You're breathing freedom!",
      "Your lungs thank you!",
      "Stay strong, you got this!",
      "1000€ is closer than you think!"
    ],
    fr: [
      "Chaque cigarette non fumée est une victoire !",
      "Tu respires la liberté !",
      "Tes poumons te remercient !",
      "Reste fort, tu peux le faire !",
      "1000€ sont plus proches que tu ne le penses !"
    ],
    nl: [
      "Elke sigaret die je niet rookt is een overwinning!",
      "Je ademt vrijheid!",
      "Je longen danken je!",
      "Blijf sterk, je kunt het!",
      "1000€ is dichterbij dan je denkt!"
    ]
  },

  getLocale: function () {
    const lang = config.language || "en";
    if (["de", "en", "fr", "nl", "be"].includes(lang)) return lang === "be" ? "fr" : lang;
    return "en";
  },

  start: function () {
    this.updateDom();
    var self = this;
    setInterval(function () {
      self.updateDom();
    }, this.config.updateInterval);
  },

  getStyles: function () {
    return [
      this.config.style === "simple" ? "MMM-SmokeFree.simple.css" : "MMM-SmokeFree.css"
    ];
  },

  getScripts: function () {
    return ["https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"];
  },

  formatDate: function (date, locale) {
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "MMM-SmokeFree";

    const container = document.createElement("div");
    container.className = this.config.style === "simple" ? "simple" : "magnet";

    const startDate = new Date(this.config.startDate);
    const now = new Date();
    const diffTime = now - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const totalCigarettes = diffDays * this.config.cigarettesPerDay;
    const totalPacks = totalCigarettes / this.config.cigarettesPerPack;
    const savedMoney = totalPacks * this.config.pricePerPack;

    const nextMilestone = Math.max(0, Math.ceil((1000 - savedMoney) / (this.config.pricePerPack / this.config.cigarettesPerPack * this.config.cigarettesPerDay)));

    const locale = this.getLocale();

    const title = document.createElement("div");
    title.className = "smokefree-title";
    title.innerHTML = `<iconify-icon icon="mdi:no-smoking"></iconify-icon> ${this.translate("smokeFreeSince", locale)}:<br><strong>${this.formatDate(startDate, locale)}</strong>`;
    container.appendChild(title);

    const days = document.createElement("div");
    days.className = "smokefree-days";
    days.innerHTML = `${diffDays} ${this.translate("daysSmokeFree", locale)}`;
    container.appendChild(days);

    const money = document.createElement("div");
    money.className = "smokefree-money";
    money.innerHTML = `<iconify-icon icon="mdi:currency-eur"></iconify-icon> ${this.translate("saved", locale)}: ${savedMoney.toFixed(2)} €`;
    container.appendChild(money);

    const milestone = document.createElement("div");
    milestone.className = "smokefree-milestone";
    milestone.innerHTML = `<iconify-icon icon="mdi:target"></iconify-icon> ${this.translate("nextMilestone", locale)}: 1000 € ${this.translate("inAbout", locale)} ${nextMilestone} ${this.translate("days", locale)}`;
    container.appendChild(milestone);

    if (this.config.motivationalText) {
      const motiv = document.createElement("div");
      motiv.className = "smokefree-motivation";
      const phrases = this.motivationalPhrases[locale] || this.motivationalPhrases.en;
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      motiv.innerHTML = `<iconify-icon icon='mdi:comment-quote'></iconify-icon> ${phrase}`;
      container.appendChild(motiv);
    }

    wrapper.appendChild(container);
    return wrapper;
  },

  translate: function (key, locale) {
    const translations = {
      smokeFreeSince: {
        de: "Rauchfrei seit",
        en: "Smoke-free since",
        fr: "Sans tabac depuis",
        nl: "Rookvrij sinds"
      },
      daysSmokeFree: {
        de: "Tage rauchfrei",
        en: "days smoke-free",
        fr: "jours sans tabac",
        nl: "dagen rookvrij"
      },
      saved: {
        de: "Erspart",
        en: "Saved",
        fr: "Économisé",
        nl: "Bespaar"
      },
      nextMilestone: {
        de: "Nächster Meilenstein",
        en: "Next milestone",
        fr: "Prochaine étape",
        nl: "Volgende mijlpaal"
      },
      inAbout: {
        de: "in ca.",
        en: "in about",
        fr: "dans environ",
        nl: "over ongeveer"
      },
      days: {
        de: "Tagen",
        en: "days",
        fr: "jours",
        nl: "dagen"
      }
    };
    return (translations[key] && translations[key][locale]) || translations[key].en;
  }
});
