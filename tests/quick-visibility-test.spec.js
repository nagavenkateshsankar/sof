const { test, expect } = require('@playwright/test');

test('Quick test: All questions visible during timer phase', async ({ page }) => {
  await page.goto('http://localhost:8080/src/quiz.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Test first 3 questions quickly
  for (let i = 1; i <= 3; i++) {
    console.log(`\n=== Testing Question ${i} ===`);

    // Wait for question to be fully loaded
    await page.waitForTimeout(2000);

    // Check that we're in question mode (timer showing, no explanation)
    const hasExplanation = await page.locator('#contentWrapper').evaluate(el =>
      el.classList.contains('show-explanation'));

    expect(hasExplanation).toBe(false); // Should be in question mode

    // Check question text is visible and not empty
    const questionText = page.locator('#questionText');
    await expect(questionText).toBeVisible();

    const questionContent = await questionText.textContent();
    expect(questionContent).not.toBe('');
    expect(questionContent).not.toBe('Loading question...');

    console.log(`Question ${i} text: "${questionContent}"`);

    // Check question counter
    const counter = await page.locator('#questionCounter').textContent();
    expect(counter).toBe(`${i}/5`);

    console.log(`✅ Question ${i} is visible and correct`);

    if (i < 3) {
      // Skip to next question (wait for timeout + explanation + advance)
      await page.waitForTimeout(27000); // 15s timer + 10s explanation + 2s buffer
    }
  }

  console.log('\n🎉 All tested questions are visible during timer phase!');
});