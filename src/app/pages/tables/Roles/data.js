// data.js (for Roles table)

const API_BASE = "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api";

/**
 * Fetch all roles for a specific tenant
 * @param {number} tenantId
 * @returns {Promise<Array>} List of roles or empty array
 */
export async function fetchRoles(tenantId = 1) {
  try {
    const response = await fetch(`${API_BASE}/Role/tenant/${tenantId}`);
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

/**
 * Create a new role using tenantId and createdBy (from localStorage)
 * @param {string} roleName
 * @returns {Promise<Object|null>} Newly created role object or null
 */
export async function createRole(roleName) {
  const tenantId = parseInt(localStorage.getItem("tenantId"), 10);
  const createdBy = parseInt(localStorage.getItem("userId"), 10);

  if (isNaN(tenantId) || isNaN(createdBy)) {
    console.error("Invalid tenantId or userId in localStorage");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/Role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roleName,
        tenantId,
        createdBy,
      }),
    });

    const result = await response.json();

    if (response.ok && result.data) {
      return result.data;
    } else {
      console.error("Failed to create role:", result.message);
      throw new Error(result.message || "Failed to create role");
    }
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}
