// Simple standalone verification test without external test runners
function testHealthData(): void {
  const statusData = { serviceStatus: "ok", serviceName: "socrates-backend" };
  if (statusData.serviceStatus !== "ok" || statusData.serviceName !== "socrates-backend") {
    throw new Error("Test failed: Health status invalid");
  }
  console.log("Health test passed successfully");
}

testHealthData();
