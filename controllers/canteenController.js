// This object will now store the state for multiple canteens
let canteens = {
  'Pharmacy Foods': { status: 'Unknown', reports: [] },
  'Court': { status: 'Unknown', reports: [] },
  'Maggi Point': { status: 'Unknown', reports: [] },
};

const config = {
  threshold: 3, // 3 reports needed
  timeWindow: 5 * 60 * 1000, // 5 minutes
  resetInterval: 60 * 60 * 1000, // 1 hour
};

// Function to automatically reset a specific canteen's status
const scheduleReset = (canteenName) => {
  if (canteens[canteenName].resetTimer) {
    clearTimeout(canteens[canteenName].resetTimer);
  }
  canteens[canteenName].resetTimer = setTimeout(() => {
    canteens[canteenName].status = 'Unknown';
    console.log(`${canteenName} status has been reset to Unknown.`);
  }, config.resetInterval);
};

// @desc    Get the status of all canteens
// @route   GET /api/canteen/status
export const getCanteenStatus = (req, res) => {
  const statuses = {
    'Pharmacy Foods': canteens['Pharmacy Foods'].status,
    'Court': canteens['Court'].status,
    'Maggi Point': canteens['Maggi Point'].status,
  };
  res.json(statuses);
};

// @desc    Report a canteen's status
// @route   POST /api/canteen/status
export const reportCanteenStatus = (req, res) => {
  const { canteenName, status } = req.body; // Expects canteenName and status ("Open" or "Closed")
  const userId = req.user._id;

  if (!canteens[canteenName]) {
    return res.status(404).json({ message: 'Canteen not found' });
  }

  const now = Date.now();
  // Filter old reports for the specific canteen
  canteens[canteenName].reports = canteens[canteenName].reports.filter(
    (report) => now - report.timestamp < config.timeWindow
  );

  // Remove previous report from this user for this canteen
  canteens[canteenName].reports = canteens[canteenName].reports.filter(
    (report) => report.userId.toString() !== userId.toString()
  );
  
  // Add the new report
  canteens[canteenName].reports.push({ userId, status, timestamp: now });

  // Check threshold for the specific canteen
  const openReports = canteens[canteenName].reports.filter((r) => r.status === 'Open').length;
  const closedReports = canteens[canteenName].reports.filter((r) => r.status === 'Closed').length;

  let statusChanged = false;
  if (openReports >= config.threshold && canteens[canteenName].status !== 'Open') {
    canteens[canteenName].status = 'Open';
    statusChanged = true;
  } else if (closedReports >= config.threshold && canteens[canteenName].status !== 'Closed') {
    canteens[canteenName].status = 'Closed';
    statusChanged = true;
  }

  if (statusChanged) {
    scheduleReset(canteenName);
  }

  res.json({ message: 'Report received', canteen: canteenName, currentState: canteens[canteenName].status });
};