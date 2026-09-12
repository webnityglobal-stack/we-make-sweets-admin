import { useState, useEffect, useCallback } from "react";
import integrationService from "../services/integration.service";

export const useIntegrations = () => {
  const [gaConfig, setGAConfig] = useState(null);
  const [waMarketingConfig, setWAMarketingConfig] = useState(null);
  const [waBotConfig, setWABotConfig] = useState(null);
  const [metaConfig, setMetaConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(() => {
    setIsLoading(true);
    try {
      setGAConfig(integrationService.getGAConfig());
      setWAMarketingConfig(integrationService.getWhatsAppMarketingConfig());
      setWABotConfig(integrationService.getWhatsAppBotConfig());
      setMetaConfig(integrationService.getMetaAdsConfig());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateGA = (data) => {
    integrationService.saveGAConfig(data);
    setGAConfig(data);
    return { success: true, message: "Google Analytics settings saved!" };
  };

  const updateWAMarketing = (data) => {
    integrationService.saveWhatsAppMarketingConfig(data);
    setWAMarketingConfig(data);
    return { success: true, message: "WhatsApp Marketing credentials saved!" };
  };

  const updateWABot = (data) => {
    integrationService.saveWhatsAppBotConfig(data);
    setWABotConfig(data);
    return { success: true, message: "WhatsApp Bot configuration saved!" };
  };

  const updateMeta = (data) => {
    integrationService.saveMetaAdsConfig(data);
    setMetaConfig(data);
    return { success: true, message: "Meta Ads credentials saved!" };
  };

  return {
    gaConfig,
    waMarketingConfig,
    waBotConfig,
    metaConfig,
    isLoading,
    updateGA,
    updateWAMarketing,
    updateWABot,
    updateMeta,
    refresh: loadAll,
  };
};

export default useIntegrations;
