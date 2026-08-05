// api.js
const BASE_URL = "http://127.0.0.1:8000";

async function apiFetch(path, token, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const data = isJson ? await response.json() : null;
    throw new Error(data?.detail || `Request failed (${response.status})`);
  }

  // 204 No Content (delete) has no body to parse
  if (response.status === 204) {
    return null;
  }

  return isJson ? response.json() : response.blob();
}

// --- Auth ---

export function login(username, password) {
  return apiFetch("/api/auth/login", null, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

// --- Tenants ---

export function listTenants(token) {
  return apiFetch("/api/tenants", token);
}

// --- Policy files ---

export function listPolicyFiles(token, tenantId) {
  return apiFetch(`/api/tenants/${tenantId}/policy-files`, token);
}

export function uploadPolicyFile(token, tenantId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch(`/api/tenants/${tenantId}/policy-files`, token, {
    method: "POST",
    body: formData,
  });
}

export async function downloadPolicyFile(token, tenantId, fileId, filename) {
  const blob = await apiFetch(`/api/tenants/${tenantId}/policy-files/${fileId}/download`, token);
  // Trigger a browser download using a temporary object URL + anchor click.
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function deletePolicyFile(token, tenantId, fileId) {
  return apiFetch(`/api/tenants/${tenantId}/policy-files/${fileId}`, token, {
    method: "DELETE",
  });
}