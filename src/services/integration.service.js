const STORAGE_KEYS = {
  GA: "wms_integration_ga",
  WA_MARKETING: "wms_integration_wa_marketing",
  WA_BOT: "wms_integration_wa_bot",
  META_ADS: "wms_integration_meta_ads",
};

export const integrationService = {
  // 1. Google Analytics
  getGAConfig: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.GA);
    if (saved) return JSON.parse(saved);
    return {
      measurementId: "G-9K382LM982",
      tagManagerId: "GTM-WMS994",
      apiSecret: "wms_sec_********************",
      isActive: true,
      lastSync: "Just now",
      realtimeVisitors: 28,
      activeChannels: [
        { channel: "Direct / Storefront", visitors: 11, percent: 39 },
        { channel: "Meta Ads (Instagram / FB)", visitors: 9, percent: 32 },
        { channel: "WhatsApp Campaigns", visitors: 5, percent: 18 },
        { channel: "Organic Google Search", visitors: 3, percent: 11 },
      ],
      ecommerceFunnel: [
        { step: "Product Views", count: 480, rate: "100%" },
        { step: "Added to Cart", count: 142, rate: "29.5%" },
        { step: "Initiated Checkout", count: 74, rate: "15.4%" },
        { step: "Completed Purchase", count: 38, rate: "7.9%" },
      ],
    };
  },
  saveGAConfig: (data) => {
    localStorage.setItem(STORAGE_KEYS.GA, JSON.stringify({ ...data, lastSync: new Date().toISOString() }));
    return { success: true, message: "Google Analytics credentials saved successfully!" };
  },

  // 2. WhatsApp Marketing API
  getWhatsAppMarketingConfig: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.WA_MARKETING);
    if (saved) return JSON.parse(saved);
    return {
      wabaId: "104928192837461",
      phoneNumberId: "109827364512938",
      accessToken: "EAABw...ClientPermanentToken...X9",
      businessPhoneNumber: "+91 98765 00123",
      isActive: true,
      templates: [
        {
          id: "tpl_festive_sweet_box",
          name: "festival_sweet_box_promo",
          category: "Marketing",
          language: "en_US",
          status: "APPROVED",
          content: "Hi {{1}}, celebrate this festive season with 100% natural, preservative-free sweets from We Make Sweets! Get 20% OFF on all Sweet Boxes. Use code FESTIVE20. Order now: {{2}}",
        },
        {
          id: "tpl_cart_recovery",
          name: "abandoned_cart_recovery_15",
          category: "Marketing",
          language: "en_US",
          status: "APPROVED",
          content: "Hello {{1}}, you left your sweet treats in your cart! Complete your order now and enjoy an instant 15% discount with code SWEET15: {{2}}",
        },
        {
          id: "tpl_vip_gift",
          name: "vip_customer_exclusive",
          category: "Marketing",
          language: "en_US",
          status: "APPROVED",
          content: "Namaste {{1}}! As a valued patron of We Make Sweets, here is an exclusive tasting box link just for you: {{2}}",
        },
      ],
      stats: {
        totalBroadcasts: 18,
        messagesSent: 4250,
        messagesDelivered: 4190,
        messagesRead: 3410,
        linkClicks: 820,
        deliveredRate: "98.5%",
        readRate: "81.3%",
        clickRate: "19.5%",
      },
    };
  },
  saveWhatsAppMarketingConfig: (data) => {
    localStorage.setItem(STORAGE_KEYS.WA_MARKETING, JSON.stringify(data));
    return { success: true, message: "WhatsApp Marketing API credentials saved!" };
  },

  // 3. WhatsApp Bot
  getWhatsAppBotConfig: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.WA_BOT);
    if (saved) return JSON.parse(saved);
    return {
      webhookUrl: "https://wemakesweets-backend.onrender.com/api/webhook/whatsapp",
      verifyToken: "wemake_bot_secure_token_2026",
      botName: "Mithai Mitra (We Make Sweets Bot)",
      isActive: true,
      greetingMessage: "Namaste! Welcome to We Make Sweets. How can I assist you today? 🍬\n1. Track Order 📦\n2. View Sweet Catalog 🍯\n3. Confirm COD Order ✅\n4. Talk to Support 💬",
      autoConfirmCod: true,
      autoSendTracking: true,
      botTriggers: [
        { trigger: "Track Order / Where is my order", action: "Prompts for Order ID or mobile number and returns live AWB tracking." },
        { trigger: "Confirm COD Order", action: "Sends quick-reply buttons (Confirm Order / Cancel) before shipping." },
        { trigger: "Ingredients & Nutrition", action: "Answers queries regarding zero refined sugar, natural dates, and multi-seed contents." },
      ],
    };
  },
  saveWhatsAppBotConfig: (data) => {
    localStorage.setItem(STORAGE_KEYS.WA_BOT, JSON.stringify(data));
    return { success: true, message: "WhatsApp Bot configuration saved!" };
  },

  // 4. Meta Ads
  getMetaAdsConfig: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.META_ADS);
    if (saved) return JSON.parse(saved);
    return {
      pixelId: "982374182938471",
      capiAccessToken: "EAAG...MetaCapiPermanentToken...Z1",
      adAccountId: "act_9182374829",
      isActive: true,
      eventDeduplication: true,
      eventsTracked: [
        { event: "PageView", count24h: 3240, status: "Active (CAPI + Browser)", matchQuality: "9.2/10" },
        { event: "ViewContent", count24h: 1820, status: "Active (CAPI + Browser)", matchQuality: "8.9/10" },
        { event: "AddToCart", count24h: 490, status: "Active (CAPI + Browser)", matchQuality: "9.4/10" },
        { event: "InitiateCheckout", count24h: 210, status: "Active (CAPI + Browser)", matchQuality: "9.1/10" },
        { event: "Purchase", count24h: 96, status: "Active (CAPI + Browser)", matchQuality: "9.8/10" },
      ],
      campaignPerformance: {
        adSpendMonth: 42800,
        revenueTracked: 184500,
        roas: "4.31x",
        totalPurchases: 248,
        costPerPurchase: 172.5,
      },
    };
  },
  saveMetaAdsConfig: (data) => {
    localStorage.setItem(STORAGE_KEYS.META_ADS, JSON.stringify(data));
    return { success: true, message: "Meta Ads & Conversions API credentials saved!" };
  },
};

export default integrationService;
