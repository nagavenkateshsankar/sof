const { test, expect } = require('@playwright/test');

test.describe('Full Quiz Recording - Current Resolution', () => {
  test('Record complete quiz playthrough in current screen resolution', async ({ page }) => {
    // Use default viewport (current screen resolution)
    await page.goto('http://localhost:9090/src/quiz.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Initial load buffer

    console.log('🎬 Starting quiz recording at current screen resolution...\n');

    // Track progress through all 5 questions
    const totalQuestions = 5;
    const timings = {
      timerDuration: 15000,      // 15 seconds per question
      explanationDuration: 10000, // 10 seconds for explanation
      transitionBuffer: 2000      // 2 seconds transition buffer
    };

    for (let questionNum = 1; questionNum <= totalQuestions; questionNum++) {
      console.log(`📝 Question ${questionNum}/${totalQuestions}`);

      // Verify question counter
      const counter = await page.locator('#questionCounter').textContent();
      expect(counter).toBe(`${questionNum}/${totalQuestions}`);

      // Get question text
      const questionText = await page.locator('#questionText').textContent();
      console.log(`   Question: "${questionText}"`);

      // Wait for timer countdown (showing the question)
      console.log(`   ⏱️  Timer countdown (15 seconds)...`);
      await page.waitForTimeout(timings.timerDuration);

      // Now in explanation phase
      console.log(`   📖 Showing explanation (10 seconds)...`);

      // Verify explanation is showing
      const hasExplanation = await page.locator('#contentWrapper').evaluate(el =>
        el.classList.contains('show-explanation'));
      expect(hasExplanation).toBe(true);

      // Wait for explanation duration
      await page.waitForTimeout(timings.explanationDuration);

      if (questionNum < totalQuestions) {
        console.log(`   ➡️  Transitioning to next question...\n`);
        // Wait for transition to next question
        await page.waitForTimeout(timings.transitionBuffer);

        // Verify we moved to the next question
        const nextCounter = await page.locator('#questionCounter').textContent();
        expect(nextCounter).toBe(`${questionNum + 1}/${totalQuestions}`);
      } else {
        console.log(`   🏁 Final question completed, showing results...\n`);
        // Wait for final transition to results
        await page.waitForTimeout(timings.transitionBuffer);

        // Verify results screen is showing
        const resultsVisible = await page.locator('#resultContainer.show').isVisible();
        expect(resultsVisible).toBe(true);

        // Keep results visible for a few seconds in the recording
        console.log('✨ Showing "Thank You" screen...');
        await page.waitForTimeout(5000);
      }
    }

    console.log('\n🎉 Quiz Recording Complete!');
    console.log('📹 Video saved in test-results folder');

    // Final pause to ensure clean recording end
    await page.waitForTimeout(1000);
  });
});