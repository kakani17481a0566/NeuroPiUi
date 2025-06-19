// data.js (for Roles table)

// ✅ Fetch all roles for a specific tenant
export async function fetchRoles(tenantId = 1) {
  try {
    const response = await fetch(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Role/tenant/${tenantId}`);
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

// ✅ Create a new role using tenantId and createdBy (userId)
export async function createRole(roleName) {
  const tenantId = localStorage.getItem("tenantId");
  const createdBy = localStorage.getItem("userId");

  if (!tenantId || !createdBy) {
    console.error("Missing tenantId or userId in localStorage");
    return;
  }

  try {
    const response = await fetch(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roleName,
        tenantId: Number(tenantId),
        createdBy: Number(createdBy),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.error("Failed to create role:", result.message);
      throw new Error(result.message || "Failed to create role");
    }
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}
