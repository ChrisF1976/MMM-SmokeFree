Module.register("MMM-SmokeFree", {
  defaults: {
    startDate: "2025-06-24",
    
    cigarettesPerDay: 20,
    pricePerPack: 9.0,
    cigarettesPerPack: 20,
    updateInterval: 60 * 60 * 1000, // 1 Stunde
    
    style: "magnet", // or "simple"
    
    currency: "€", // or "$", "£", etc.
    currencyIcon: "mdi:currency-eur", // Icons: https://icon-sets.iconify.design/
    
    motivationalText: true,
    
    showMilestone: true,
    milestoneAmount: 500,
  },

  loadedTranslations: {},

  getTranslations: function () {
    return {
      de: "translations/de.json",
      en: "translations/en.json",
      fr: "translations/fr.json",
      nl: "translations/nl.json"
    };
  },

  translate: function (key, locale) {
    const translations = this.loadedTranslations[locale] || {};
    return translations[key] || key;
  },

  getMotivationalPhrase: function (locale) {
    const translations = this.loadedTranslations[locale] || {};
    const phrases = translations["motivationalPhrases"] || [];
    if (phrases.length === 0) return "";
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  loaded: function (callback) {
    const locale = this.getLocale();
    const path = this.getTranslations()[locale] || this.getTranslations().en;
    const self = this;

    fetch(`/modules/${this.name}/${path}`)
      .then(res => res.json())
      .then(data => {
        self.loadedTranslations[locale] = data;
        callback();
      })
      .catch(() => callback());
  },

  getLocale: function () {
    const lang = config.language || "en";
    if (["de", "en", "fr", "nl", "be"].includes(lang)) return lang === "be" ? "fr" : lang;
    return "en";
  },

  start: function () {
    this.loaded(() => {
      this.updateDom();
      setInterval(() => {
        this.updateDom();
      }, this.config.updateInterval);
    });
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

    const milestoneAmount = this.config.milestoneAmount;
    const nextMilestone = Math.max(0, Math.ceil((milestoneAmount - savedMoney) / (this.config.pricePerPack / this.config.cigarettesPerPack * this.config.cigarettesPerDay)));

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
    money.innerHTML = `<iconify-icon icon="${this.config.currencyIcon}"></iconify-icon> ${this.translate("saved", locale)}: ${savedMoney.toFixed(2)} ${this.config.currency}`;
    container.appendChild(money);

    if (this.config.showMilestone) {
      const milestone = document.createElement("div");
      milestone.className = "smokefree-milestone";
      milestone.innerHTML = `<iconify-icon icon="mdi:target"></iconify-icon> ${this.translate("nextMilestone", locale)}: ${milestoneAmount} ${this.config.currency} ${this.translate("inAbout", locale)} ${nextMilestone} ${this.translate("days", locale)}`;
      container.appendChild(milestone);
    }

    if (this.config.motivationalText) {
      const motiv = document.createElement("div");
      motiv.className = "smokefree-motivation";
      const phrase = this.getMotivationalPhrase(locale);
      motiv.innerHTML = `<iconify-icon icon='mdi:comment-quote'></iconify-icon> ${phrase}`;
      container.appendChild(motiv);
    }

    wrapper.appendChild(container);
    return wrapper;
  }
});
