/* Lureva shared script: language switch (English/Arabic, right-to-left), collections list,
   and the create-your-piece form. Used by index.html and collections.html. */
(function () {
  /* Collections and pieces live in content/collections.json. The editor (admin/) changes that file;
     this script only reads it. Photos are file names in the assets folder. */
  var COLLECTIONS = [];

  function slug(x) {
    return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function normalize(data) {
    return (data.collections || []).map(function (c) {
      return {
        id: slug(c.name || ""),
        name: c.name || "",
        desc: { en: c.description_en || "", ar: c.description_ar || c.description_en || "" },
        pieces: (c.pieces || []).map(function (p) {
          return {
            name: { en: p.name_en || "", ar: p.name_ar || p.name_en || "" },
            images: (p.images || []).filter(function (i) { return i.image; }).map(function (i) {
              var src = String(i.image).replace(/^\//, "");
              return { src: src, thumb: src, alt: { en: i.alt_en || p.name_en || "", ar: i.alt_ar || p.name_ar || p.name_en || "" } };
            })
          };
        })
      };
    });
  }

  function loadContent() {
    var host = document.getElementById("colls");
    if (!host) return;
    fetch("content/collections.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (d) { COLLECTIONS = normalize(d); renderCollections(); })
      .catch(function () { host.textContent = ""; });
  }

  var I18N = {
    en: {
      nav_home: "Home", nav_collections: "Collections", nav_create: "Create your piece", nav_contact: "Contact",
      eyebrow: "Fine jewelry, personal by design",
      lead: "Jewelry is personal, a reflection of who you are. Gold, diamonds and precious stones, masterfully crafted and designed with passion and love, down to the smallest detail.",
      btn_explore: "Explore the collection", btn_create: "Create your piece",
      coll_title: "The collections", coll_lead: "Choose what speaks to you.", coll_note: "Every piece is made to order in yellow, rose or white gold.", soon: "Render coming soon",
      create_title: "Create your piece", create_lead: "Designed around your individuality, your preferences and your budget.",
      n1: "01", n2: "02", n3: "03",
      s1_title: "Share your idea", s1_text: "Bring an inspiration, a color, a gemstone or simply a feeling, with any photos that speak to you.",
      s2_title: "Choose from three designs", s2_text: "After a dedicated design session, we present three designs for you to choose from.",
      s3_title: "Refine every detail", s3_text: "Together we refine your chosen design until every detail feels right.",
      alt1: "A mood board of fabric swatches, gemstone photos and a handwritten card that reads Share your idea or inspiration",
      alt2: "Three watercolor ring sketches on paper: Organic Wave, Double Bezel and Asymmetrical Diamonds",
      altf: "A flat lay of Lureva jewelry on pink silk: the LR monogram pieces, a gemstone pendant, a woven cuff and a three-stone ring beside a pink gift box and a black velvet pouch",
      alt3: "A gold ring with an oval pink stone and two small diamonds in a pink leather box",
      form_title: "Start your piece", f_name: "Your name", f_idea: "Your idea", f_idea_ph: "Describe the piece: metal, stones, occasion, size.",
      f_photos: "Inspiration photos", f_choose: "Choose photos", f_none: "No photos chosen", photos_n: " photos chosen",
      send_email: "Send by email", send_wa: "Send via WhatsApp",
      need_idea: "Please describe your idea first.",
      wa_open: "Opening WhatsApp. Please attach your photos in the chat.", wa_shared: "Choose WhatsApp to send your idea and photos.", mail_open: "Opening your email app. Please attach your photos to the message.", msg_new_piece: "A new piece request for Lureva", msg_name: "Name", msg_idea: "Idea", msg_photos: "I will attach inspiration photos.",
      photo_n: "Photo", photo_of: "of",
      preview: "Preview only. On the live site your request is sent straight to Lureva.",
      contact_title: "Write to us", contact_lead: "For questions about a piece or a commission.", msg_btn: "Send us a message",
      cta_line: "Have something of your own in mind?",
      mail_subject: "A message for Lureva",
      lang_btn: "العربية", lang_label: "Switch language"
    },
    ar: {
      nav_home: "الرئيسية", nav_collections: "المجموعات", nav_create: "ابتكري قطعتك", nav_contact: "تواصل معنا",
      eyebrow: "مجوهرات راقية، شخصية بالتصميم",
      lead: "المجوهرات شخصية، انعكاسٌ لمن تكونين. ذهب وألماس وأحجار كريمة، تُصنع ببراعة وتُصمَّم بشغف وحب، حتى أدق التفاصيل.",
      btn_explore: "استكشفي المجموعة", btn_create: "ابتكري قطعتك",
      coll_title: "المجموعات", coll_lead: "اختاري ما يخاطبكِ.", coll_note: "كل قطعة تُصنع حسب الطلب بالذهب الأصفر أو الوردي أو الأبيض.", soon: "الصورة قريبًا",
      create_title: "ابتكري قطعتك", create_lead: "نصمم حول شخصيتكِ وذوقكِ وميزانيتكِ.",
      n1: "٠١", n2: "٠٢", n3: "٠٣",
      s1_title: "شاركينا فكرتك", s1_text: "أحضري إلهامًا أو لونًا أو حجرًا كريمًا أو مجرد إحساس، مع أي صور تعجبكِ.",
      s2_title: "اختاري من ثلاثة تصاميم", s2_text: "بعد جلسة تصميم مخصصة، نقدّم لكِ ثلاثة تصاميم لتختاري منها.",
      s3_title: "نُنقّح كل تفصيل", s3_text: "نُنقّح التصميم الذي اخترتِه معًا حتى يصبح كل تفصيل في مكانه.",
      alt1: "لوحة إلهام من عينات الأقمشة وصور الأحجار الكريمة وبطاقة مكتوبة بخط اليد تدعوكِ إلى مشاركة فكرتك",
      alt2: "ثلاثة رسومات مائية لخواتم على الورق: الموجة العضوية، والإطار المزدوج، والألماس غير المتناظر",
      altf: "تشكيلة من مجوهرات لوريفا على الحرير الوردي: قطع مونوغرام LR وقلادة بأحجار ملونة وسوار منسوج وخاتم بثلاثة أحجار بجانب علبة هدايا وردية وكيس قطيفة أسود",
      alt3: "خاتم ذهبي بحجر وردي بيضاوي وماستين صغيرتين داخل علبة جلدية وردية",
      form_title: "ابدئي قطعتك", f_name: "اسمك", f_idea: "فكرتك", f_idea_ph: "صفي القطعة: المعدن، الأحجار، المناسبة، المقاس.",
      f_photos: "صور مُلهمة", f_choose: "اختيار الصور", f_none: "لم يتم اختيار صور", photos_n: " صور مختارة",
      send_email: "أرسلي بالبريد الإلكتروني", send_wa: "أرسلي عبر واتساب",
      need_idea: "من فضلك صفي فكرتك أولًا.",
      wa_open: "جارٍ فتح واتساب. من فضلك أرفقي صورك في المحادثة.", wa_shared: "اختاري واتساب لإرسال فكرتك وصورك.", mail_open: "جارٍ فتح تطبيق البريد. من فضلك أرفقي صورك بالرسالة.", msg_new_piece: "طلب قطعة جديدة من لوريفا", msg_name: "الاسم", msg_idea: "الفكرة", msg_photos: "سأرفق صور الإلهام.",
      photo_n: "صورة", photo_of: "من",
      preview: "هذه معاينة فقط. على الموقع الفعلي يصل طلبك مباشرة إلى لوريفا.",
      contact_title: "راسلينا", contact_lead: "للاستفسار عن قطعة أو طلب تصميم خاص.", msg_btn: "أرسلي إلينا رسالة",
      cta_line: "هل لديكِ فكرة خاصة بكِ؟",
      mail_subject: "A message for Lureva",
      lang_btn: "English", lang_label: "تغيير اللغة"
    }
  };

  var HEADLINE = {
    en: "Designed to be yours.<br><em>Made to be noticed.</em>",
    ar: "صُمّمت لتكون لكِ.<br><em>صُنعت لتُلفت الأنظار.</em>"
  };

  var lang = "en";
  var fileCount = 0;

  function $(id) { return document.getElementById(id); }
  function t(k) { return I18N[lang][k]; }

  function renderCollections() {
    var host = $("colls");
    if (!host) return;
    host.textContent = "";
    COLLECTIONS.forEach(function (c) {
      var sec = document.createElement("div");
      sec.className = "coll";
      sec.id = c.id;
      var head = document.createElement("div");
      head.className = "coll-head";
      var h2 = document.createElement("h2");
      h2.textContent = c.name;
      head.appendChild(h2);
      var desc = document.createElement("p");
      desc.className = "coll-desc";
      desc.textContent = c.desc[lang];
      var grid = document.createElement("div");
      grid.className = "pieces";
      var items = c.pieces.length ? c.pieces : [{}, {}, {}];
      items.forEach(function (p) {
        var fig = document.createElement("figure");
        fig.className = "piece";
        var tile = document.createElement("div");
        tile.className = "tile";
        var imgs = p.images || [];
        var pname = p.name ? p.name[lang] : "";
        var main = null;
        if (imgs.length) {
          main = document.createElement("img");
          main.src = imgs[0].src;
          main.alt = imgs[0].alt[lang];
          main.decoding = "async";
          main.loading = "lazy";
          tile.appendChild(main);
        }
        var cap = document.createElement("figcaption");
        cap.textContent = pname || t("soon");
        if (!pname) cap.className = "is-soon";
        fig.appendChild(tile);
        fig.appendChild(cap);
        if (imgs.length > 1) {
          var row = document.createElement("div");
          row.className = "thumbs";
          imgs.forEach(function (im, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "thumb";
            b.setAttribute("aria-label", t("photo_n") + " " + (i + 1) + " " + t("photo_of") + " " + imgs.length + ", " + pname);
            b.setAttribute("aria-current", i === 0 ? "true" : "false");
            var ti = document.createElement("img");
            ti.src = im.thumb;
            ti.alt = "";
            ti.loading = "lazy";
            b.appendChild(ti);
            b.addEventListener("click", function () {
              main.src = im.src;
              main.alt = im.alt[lang];
              row.querySelectorAll(".thumb").forEach(function (x) { x.setAttribute("aria-current", "false"); });
              b.setAttribute("aria-current", "true");
            });
            row.appendChild(b);
          });
          fig.appendChild(row);
        }
        grid.appendChild(fig);
      });
      sec.appendChild(head);
      sec.appendChild(desc);
      sec.appendChild(grid);
      host.appendChild(sec);
    });
  }

  function applyLang(l) {
    lang = l;
    var root = document.documentElement;
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.id === "fileNames" && fileCount > 0) return;
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.placeholder = t(el.getAttribute("data-i18n-ph"));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      el.alt = t(el.getAttribute("data-i18n-alt"));
    });
    var h = $("headline");
    if (h) h.innerHTML = HEADLINE[l];
    var btn = $("lang");
    if (btn) {
      btn.textContent = t("lang_btn");
      btn.setAttribute("aria-label", t("lang_label"));
    }
    var note = $("note");
    if (note) note.textContent = "";
    var fn = $("fileNames");
    if (fn && fileCount > 0) fn.textContent = fileCount + t("photos_n");
    renderCollections();
    try { localStorage.setItem("lureva-lang", l); } catch (e) {}
  }

  var langBtn = $("lang");
  if (langBtn) langBtn.addEventListener("click", function () { applyLang(lang === "en" ? "ar" : "en"); });

  var photos = $("photos");
  if (photos) photos.addEventListener("change", function (e) {
    fileCount = e.target.files.length;
    $("fileNames").textContent = fileCount ? fileCount + t("photos_n") : t("f_none");
  });

  /* The WhatsApp number and the email address are assembled here so neither is written in the page markup. */
  var WA_NUMBER = ["20", "1060072924"].join("");
  function requestText() {
    var nm = $("name"), idea = $("idea"), p = $("photos");
    var lines = [t("msg_new_piece"), ""];
    if (nm && nm.value.trim()) lines.push(t("msg_name") + ": " + nm.value.trim());
    lines.push(t("msg_idea") + ": " + idea.value.trim());
    if (p && p.files.length) lines.push("", t("msg_photos"));
    return lines.join("\n");
  }

  document.querySelectorAll("[data-channel]").forEach(function (b) {
    b.addEventListener("click", function () {
      var note = $("note");
      var idea = $("idea");
      if (!idea.value.trim()) {
        note.textContent = t("need_idea");
        idea.focus();
        return;
      }
      var text = requestText();
      var files = $("photos") ? Array.prototype.slice.call($("photos").files) : [];
      if (b.getAttribute("data-channel") === "email") {
        var to = ["info", "lurevaatelier.com"].join("@");
        note.textContent = t("mail_open");
        try { window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(t("msg_new_piece")) + "&body=" + encodeURIComponent(text); } catch (e) {}
        return;
      }
      /* WhatsApp: on phones the share sheet can carry the photos too; otherwise open the chat with the text. */
      var fallback = function () {
        note.textContent = t("wa_open");
        try { window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener"); } catch (e) {}
      };
      try {
        if (files.length && navigator.canShare && navigator.canShare({ files: files })) {
          note.textContent = t("wa_shared");
          navigator.share({ files: files, text: text }).catch(function (err) { if (err && err.name !== "AbortError") fallback(); });
          return;
        }
      } catch (e) {}
      fallback();
    });
  });

  /* The address is assembled here so it is never shown on the page. */
  var msgBtn = $("msgBtn");
  if (msgBtn) msgBtn.addEventListener("click", function () {
    var to = ["info", "lurevaatelier.com"].join("@");
    try { window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(t("mail_subject")); } catch (e) {}
  });

  var saved = "en";
  try { saved = localStorage.getItem("lureva-lang") || "en"; } catch (e) {}
  applyLang(saved === "ar" ? "ar" : "en");
  loadContent();
})();
