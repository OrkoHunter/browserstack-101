// File: testLogin.js
// Selenium test using BrowserStack which checks the add to cart flow on bstackdemo.com
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

  // Add an item to cart
  await driver.get("https://bstackdemo.com");
  const addToCartButton = await driver.findElement(webdriver.By.className("shelf-item__buy-btn"))
  await addToCartButton.click()

  // Begin tests
  // If any of the test fails, this will become false.
  let allTestsSuccessful = true;

  console.log("Validate cart quantity subscript")
  const bagQuantity = await driver.findElement(webdriver.By.className("bag__quantity"))
  if (await bagQuantity.getAttribute("innerHTML") !== '1') {
    console.error("Cart quantity subscript is wrong.")
    allTestsSuccessful = false;
  }

  console.log("Validate number of items")
  const itemsInCart = await driver.findElements(webdriver.By.className("shelf-item__details"))
  if (itemsInCart.length !== 1) {
    console.error("Number of items in cart does not add up to attempts.")
    allTestsSuccessful = false;
  }


  // Return final result
  if (allTestsSuccessful) {
    console.log("Add to cart working successfully!")
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Add to cart working successfully!"}}'
    );
  } else {
    console.log("Something went wrong. Please check error logs!");
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Something went wrong. Please check error logs!"}}'
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
