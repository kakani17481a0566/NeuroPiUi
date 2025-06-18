// data.js (for Roles table)
export async function fetchRoles(tenantId = 1) {
  try {
    const response = await fetch(`https://localhost:7202/api/Role/tenant/${tenantId}`);
    const result = await response.json();

    if (response.ok && result.data) {
      return result.data;
    } else {
      console.error("Failed to load roles:", result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}
