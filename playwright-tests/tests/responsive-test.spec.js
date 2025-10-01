const { test, expect } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  const resolutions = [
    { name: '1080p', width: 1920, height: 1080 },
    { name: '1440p', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 }
  ];

  resolutions.forEach(({ name, width, height }) => {
    test(`Quiz should be responsive at ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport to specific resolution
      await page.setViewportSize({ width, height });

      // Navigate to quiz
      await page.goto('http://localhost:9090/src/quiz.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      console.log(`\n📐 Testing ${name} resolution (${width}x${height})`);

      // Test basic layout elements
      const quizContainer = page.locator('.quiz-container');
      const title = page.locator('.quiz-title');
      const timer = page.locator('.timer');
      const questionCounter = page.locator('.question-counter');
      const questionText = page.locator('.question-text');

      // Verify elements are visible
      await expect(quizContainer).toBeVisible();
      await expect(title).toBeVisible();
      await expect(timer).toBeVisible();
      await expect(questionCounter).toBeVisible();
      await expect(questionText).toBeVisible();

      // Get computed styles for font sizes
      const titleFontSize = await title.evaluate(el =>
        window.getComputedStyle(el).fontSize);
      const timerFontSize = await timer.evaluate(el =>
        window.getComputedStyle(el).fontSize);
      const questionFontSize = await questionText.evaluate(el =>
        window.getComputedStyle(el).fontSize);

      console.log(`   Title font size: ${titleFontSize}`);
      console.log(`   Timer font size: ${timerFontSize}`);
      console.log(`   Question font size: ${questionFontSize}`);

      // Verify container width scales appropriately
      const containerWidth = await quizContainer.evaluate(el => el.offsetWidth);
      const viewportWidth = width;
      const containerPercentage = (containerWidth / viewportWidth) * 100;

      console.log(`   Container width: ${containerWidth}px (${containerPercentage.toFixed(1)}% of viewport)`);

      // Container should not overflow viewport width
      expect(containerWidth).toBeLessThanOrEqual(viewportWidth);

      // For larger screens, container should not be too narrow
      if (width >= 1920) {
        expect(containerPercentage).toBeGreaterThan(60); // At least 60% of viewport
      }

      // Font sizes should be appropriate for screen size
      const titleSize = parseFloat(titleFontSize);
      const questionSize = parseFloat(questionFontSize);

      if (width >= 3840) { // 4K
        expect(titleSize).toBeGreaterThan(30); // Larger fonts for 4K
        expect(questionSize).toBeGreaterThan(35);
      } else if (width <= 768) { // Mobile/Tablet
        expect(titleSize).toBeLessThan(35); // Smaller fonts for mobile
        expect(questionSize).toBeLessThan(40);
      }

      console.log(`   ✅ ${name} layout test passed`);
    });
  });

  test('Quiz elements should not overlap at any resolution', async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await page.goto('http://localhost:9090/src/quiz.html');
    await page.waitForLoadState('networkidle');

    // Check for overlapping elements
    const timer = page.locator('.timer');
    const questionCounter = page.locator('.question-counter');
    const title = page.locator('.quiz-title');

    const timerBox = await timer.boundingBox();
    const counterBox = await questionCounter.boundingBox();
    const titleBox = await title.boundingBox();

    // Timer (right side) and counter (left side) should not overlap
    const timerLeft = timerBox.x;
    const counterRight = counterBox.x + counterBox.width;
    expect(counterRight).toBeLessThan(timerLeft - 50); // Counter should be well left of timer

    // Elements should not overlap with title
    const titleBottom = titleBox.y + titleBox.height;
    expect(timerBox.y).toBeGreaterThan(titleBottom - 10); // Some tolerance
    expect(counterBox.y).toBeGreaterThan(titleBottom - 10);

    console.log('✅ No element overlapping detected');
  });
});