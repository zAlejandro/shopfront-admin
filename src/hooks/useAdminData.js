import { useState, useEffect } from "react";
import { api } from "../services/api.js";
export default function useAdminData(user) {
  const [tenantId, setTenantId] = useState(user.tenant);
  const [tenants, setTenants] = useState([]);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  useEffect(() => {
    if (user.role === "owner")
      api.tenants().then((items) => {
        setTenants(items);
        setTenantId((x) => x || items[0]?.id);
      });
  }, []);
  useEffect(() => {
    if (tenantId) {
      setData(null);
      api
        .get(tenantId)
        .then(setData)
        .catch((e) => toast(e.message));
    }
  }, [tenantId]);
  const toast = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(""), 2400);
  };
  const save = async (key, value) => {
    try {
      const result = await api.set(tenantId, key, value);
      setData((x) => ({
        ...x,
        [key]: result ?? value,
      }));
      return result;
    } catch (e) {
      toast(e.message);
      throw e;
    }
  };
  const upload = async (file) => {
    const mediaItem = await api.upload(tenantId, file);
    setData((x) => ({
      ...x,
      media: [...x.media, mediaItem],
    }));
    return mediaItem;
  };
  return {
    tenantId,
    setTenantId,
    tenants,
    data,
    message,
    save,
    upload,
    toast,
  };
}
