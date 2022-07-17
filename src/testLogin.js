// File: testLogin.js
// Selenium test using BrowserStack which tests the login flow on bstackdemo.com
const webdriver = require('selenium-webdriver');

const browserstackServerUrl = `http://${process.env['BROWSERSTACK_USERNAME']}:${process.env['BROWSERSTACK_ACCESS_KEY']}@hub-cloud.browserstack.com/wd/hub`;

async function runTest(capabilities) {
  // Initialize a webdriver to use a local browser instance
  let driver = new webdriver.Builder()
  .usingServer(browserstackServerUrl)
    .withCapabilities({
    ...capabilities,
    ...capabilities['browser'] && { browserName: capabilities['browser']}  // Because NodeJS language binding requires browserName to be defined
  })
  .build();

  // Click the Sign In Button
  await driver.get("https://bstackdemo.com");

  console.log("Opening Sign In Page")
  const signInButton = await driver.findElement(webdriver.By.id("signin"));
  await signInButton.click()

  // Explicit wait until the username input field loads, with a timeout of 100 seconds
  await driver.wait(webdriver.until.elementLocated(webdriver.By.css('#username input')), 100);

  // Enter username and password
  const usernameField = await driver.findElement(webdriver.By.css('#username input'));
  await usernameField.sendKeys("demouser", webdriver.Key.ENTER);

  const passwordField = await driver.findElement(webdriver.By.css('#password input'));
  await passwordField.sendKeys("testingisfun99", webdriver.Key.ENTER);

  const submitButton = await driver.findElement(webdriver.By.id("login-btn"));
  await submitButton.click()

  // Verify logged in username
  await driver.wait(webdriver.until.elementLocated(webdriver.By.className("username")), 100);

  const usernameDisplay = await driver.findElement(webdriver.By.className("username"))
  if (await usernameDisplay.getText() == "demouser") {
    console.log("Successfully logged in!")
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Successfully logged in!"}}'
    );
  } else {
    console.log("Something went wrong. Log in failed!");
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Something went wrong, could not log in!"}}'
    );
  }

  await driver.quit();
  return;
}

const baseCapabilities = {
  'realMobile': 'true',
  'build': 'Browserstack demo site',
}

const capabilities1 = {
  ...baseCapabilities,
  'name': 'Test 1',
  'device': 'iPhone 13 Pro Max',
  'osVersion': '15',
  'browserName': 'Safari'
}

const capabilities2 = {
  ...baseCapabilities,
  'name': 'Test 2',
  'device': 'iPhone 13 Pro Max',
  'osVersion': '15',
  'browserName': 'Chrome',
}

const capabilities3 = {
  ...baseCapabilities,
  'name': 'Test 3',
	'device': 'OnePlus 9',
  'osVersion': '11.0',
  'browserName': 'Chrome',
}

const capabilities4 = {
  ...baseCapabilities,
  'name': 'Test 4',
	'device': 'OnePlus 9',
  'osVersion': '11.0',
  'browserName': 'Firefox',
}

runTest(capabilities1);
runTest(capabilities2);
runTest(capabilities3);
runTest(capabilities4);
