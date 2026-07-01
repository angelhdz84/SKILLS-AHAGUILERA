module.exports = {
  testDir: '.',
  timeout: 30000,
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
};
