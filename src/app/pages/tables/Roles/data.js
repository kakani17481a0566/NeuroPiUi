// data.js (for Roles table)
export async function fetchRoles(tenantId = 1) {
  try {
    //DailyAssessment/get-matrix?tenantId=1&courseId=1&branchId=1&timeTableId=2
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
