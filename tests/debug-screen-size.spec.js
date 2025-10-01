const { test, expect } = require('@playwright/test');

test('Debug current screen size and quiz layout', async ({ page }) => {
  // Use default viewport (simulates current browser window)
  await page.goto('http://localhost:9090/src/quiz.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Get actual viewport and screen info
  const viewportSize = page.viewportSize();
  const screenInfo = await page.evaluate(() => ({
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
  }));

  console.log('\n🖥️ Screen Information:');
  console.log(`   Screen resolution: ${screenInfo.screenWidth}x${screenInfo.screenHeight}`);
  console.log(`   Viewport size: ${screenInfo.viewportWidth}x${screenInfo.viewportHeight}`);
  console.log(`   Playwright viewport: ${viewportSize.width}x${viewportSize.height}`);
  console.log(`   Device pixel ratio: ${screenInfo.devicePixelRatio}`);

  // Get quiz container dimensions and styling
  const quizContainer = page.locator('.quiz-container');
  const containerInfo = await quizContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      maxWidth: style.maxWidth,
      computedMaxWidth: parseFloat(style.maxWidth),
      position: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      }
    };
  });

  console.log('\n📦 Quiz Container Info:');
  console.log(`   Actual width: ${containerInfo.width}px`);
  console.log(`   Actual height: ${containerInfo.height}px`);
  console.log(`   Max-width CSS: ${containerInfo.maxWidth}`);
  console.log(`   Position: left=${containerInfo.position.left}, top=${containerInfo.position.top}`);

  // Calculate percentage of viewport
  const widthPercentage = (containerInfo.width / screenInfo.viewportWidth) * 100;
  const heightPercentage = (containerInfo.height / screenInfo.viewportHeight) * 100;

  console.log(`   Width percentage: ${widthPercentage.toFixed(1)}% of viewport`);
  console.log(`   Height percentage: ${heightPercentage.toFixed(1)}% of viewport`);

  // Check if container is overflowing
  const isOverflowing = containerInfo.position.right > screenInfo.viewportWidth ||
                       containerInfo.position.bottom > screenInfo.viewportHeight;

  console.log(`   Overflowing viewport: ${isOverflowing ? '❌ YES' : '✅ NO'}`);

  // Get font sizes
  const title = page.locator('.quiz-title');
  const questionText = page.locator('.question-text');
  const timer = page.locator('.timer');

  const fontSizes = await Promise.all([
    title.evaluate(el => window.getComputedStyle(el).fontSize),
    questionText.evaluate(el => window.getComputedStyle(el).fontSize),
    timer.evaluate(el => window.getComputedStyle(el).fontSize)
  ]);

  console.log('\n📝 Font Sizes:');
  console.log(`   Title: ${fontSizes[0]}`);
  console.log(`   Question: ${fontSizes[1]}`);
  console.log(`   Timer: ${fontSizes[2]}`);

  // Check root font size
  const rootFontSize = await page.evaluate(() =>
    window.getComputedStyle(document.documentElement).fontSize
  );
  console.log(`   Root font-size: ${rootFontSize}`);

  // Check if elements are visible
  const elementsVisible = await Promise.all([
    quizContainer.isVisible(),
    title.isVisible(),
    questionText.isVisible(),
    timer.isVisible()
  ]);

  console.log('\n👁️ Element Visibility:');
  console.log(`   Container: ${elementsVisible[0] ? '✅ Visible' : '❌ Hidden'}`);
  console.log(`   Title: ${elementsVisible[1] ? '✅ Visible' : '❌ Hidden'}`);
  console.log(`   Question: ${elementsVisible[2] ? '✅ Visible' : '❌ Hidden'}`);
  console.log(`   Timer: ${elementsVisible[3] ? '✅ Visible' : '❌ Hidden'}`);

  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'debug-current-screen.png', fullPage: true });
  console.log('\n📸 Screenshot saved as: debug-current-screen.png');
});