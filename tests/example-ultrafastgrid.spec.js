'use strict';

const {
  VisualGridRunner,
  RunnerOptions,
  Eyes,
  Target,
  BatchInfo,
  BrowserType,
  DeviceName,
  ScreenOrientation
} = require('@applitools/eyes-webdriverio');

let eyes;
let runner;
let configuration;

describe('LSEG App - wdio6', function () {

  before(async () => {

    const runnerOptions = new RunnerOptions().testConcurrency(50);

    runner = new VisualGridRunner(runnerOptions);

    eyes = new Eyes(runner);

    if (browser.config.enableEyesLogs) {
      eyes.setLogHandler(new ConsoleLogHandler(true));
    }

    configuration = eyes.getConfiguration();
    configuration.setApiKey(process.env.APPLITOOLS_API_KEY)
    configuration.setBatch(new BatchInfo('lseg Batch - WDIO 6'))
    configuration.addBrowser(800, 600, BrowserType.CHROME);
    configuration.addBrowser(1920, 1080, BrowserType.CHROME);
    configuration.addBrowser(700, 500, BrowserType.FIREFOX);
    configuration.setVisualGridOption('polyfillAdoptedStyleSheets', true);
    configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
    configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
  });


  beforeEach(async function () {
    configuration.setAppName('Lseg App - WDIO 6');
    configuration.setTestName('Lseg Test - WDIO 6');
    eyes.setConfiguration(configuration);

    await eyes.open(browser);
  });


  it('ultraFastTest', async () => {
    await browser.url('https://workspace.ppe.refinitiv.com/login');
    await browser.pause(2000);

    // //Login Workflow
    const userInput = await browser.$('#AAA-AS-SI1-SE003');
    await userInput.addValue('hemmawan.kanokkanjana@thomsonreuters.com');
    const passInput = await browser.$('#AAA-AS-SI1-SE006');
    await passInput.addValue('Secret123');
    await browser.pause(8000);

    await browser.url('https://workspace.ppe.refinitiv.com/web/Apps/Pulse/?st=PortfolioID#/pulse');
 
    await browser.pause(20000);
    
    // Click button to open frame
    let frameApp = await browser.$('iframe[name="AppFrame"]');
    await frameApp.waitForExist();
    await browser.switchToFrame(frameApp);

    const frameInternal = await browser.$('iframe[name="internal"]');
    await frameInternal.waitForExist();
    await browser.switchToFrame(frameInternal);

    frameApp = await browser.$('iframe[name="AppFrame"]');
    await frameApp.waitForExist();
    await browser.switchToFrame(frameApp);

    const frameContent = await browser.$('/html/body/browser-window/div[1]/div[2]/div[2]/div[2]/iframe');
    await frameContent.waitForExist();
    await browser.switchToFrame(frameContent);

    frameApp = await browser.$('#AppFrame');
    await frameApp.waitForExist();
    await browser.switchToFrame(frameApp);

    const customizeDataButton = await browser.$('body > pls-root > pls-pulse > div > div > div:nth-child(1) > coral-button');
    await customizeDataButton.waitForExist();
    await customizeDataButton.click();
    await browser.pause(25000);

    await eyes.check(
      'Panel Check', 
      Target
        .shadow('body > pls-root > pls-pulse > div > pls-activity-settings-menu > pls-customize-dialog > coral-dialog')
        .region('#popup')
        .fully()
    );

    await eyes.closeAsync();
  });

  afterEach(async () => {
    await eyes.abortAsync();
  });

  after(async () => {
    const results = await runner.getAllTestResults();
    console.log(results);
  });

});
