const { test, expect } = require('@playwright/test');

test.describe('Interactive Quiz Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the quiz page
    await page.goto('http://localhost:8080/src/quiz.html');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Allow audio context to initialize
    await page.waitForTimeout(1000);
  });

  test('should display first question correctly', async ({ page }) => {
    // Check if quiz container is visible
    await expect(page.locator('.quiz-container')).toBeVisible();

    // Check if question counter shows 1/5
    await expect(page.locator('#questionCounter')).toHaveText('1/5');

    // Check if first question text is visible and not empty
    const questionText = page.locator('#questionText');
    await expect(questionText).toBeVisible();
    await expect(questionText).not.toHaveText('');

    // Check if options are visible
    const options = page.locator('.option');
    await expect(options).toHaveCount(4);

    // Log the question text for debugging
    const questionContent = await questionText.textContent();
    console.log('First question text:', questionContent);
  });

  test('should progress to second question after timeout', async ({ page }) => {
    // Wait for first question to load
    await expect(page.locator('#questionText')).toBeVisible();
    const firstQuestionText = await page.locator('#questionText').textContent();
    console.log('First question:', firstQuestionText);

    // Wait for timer to reach 0 (15 seconds + some buffer)
    await page.waitForTimeout(16000);

    // Check if explanation is shown (split screen)
    await expect(page.locator('.content-wrapper')).toHaveClass(/show-explanation/);

    // Wait for auto-advance to next question (10 seconds + buffer)
    await page.waitForTimeout(11000);

    // Check if we're on question 2
    await expect(page.locator('#questionCounter')).toHaveText('2/5');

    // CRITICAL: Check if second question text is visible and different
    const secondQuestionText = await page.locator('#questionText').textContent();
    console.log('Second question:', secondQuestionText);

    // Verify question text is not empty and different from first
    expect(secondQuestionText).not.toBe('');
    expect(secondQuestionText).not.toBe(firstQuestionText);
    expect(secondQuestionText).not.toBe('Loading question...');

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-second-question.png', fullPage: true });
  });

  test('should show all questions content properly', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      console.log(`\n--- Checking Question ${i + 1} ---`);

      // Wait for question to load
      await page.waitForTimeout(2000);

      // Check question counter
      await expect(page.locator('#questionCounter')).toHaveText(`${i + 1}/5`);

      // Check question text
      const questionText = await page.locator('#questionText').textContent();
      console.log(`Question ${i + 1} text:`, questionText);

      // Verify question is not empty
      expect(questionText).not.toBe('');
      expect(questionText).not.toBe('Loading question...');

      // Check if question text element is visible
      await expect(page.locator('#questionText')).toBeVisible();

      // Check options are present
      const optionsCount = await page.locator('.option').count();
      console.log(`Question ${i + 1} options count:`, optionsCount);
      expect(optionsCount).toBe(4);

      // Take screenshot for each question
      await page.screenshot({
        path: `debug-question-${i + 1}.png`,
        fullPage: true
      });

      if (i < 4) { // Don't advance after last question
        // Wait for timeout and explanation
        await page.waitForTimeout(16000);

        // Wait for auto-advance to next question
        await page.waitForTimeout(11000);
      }
    }
  });

  test('should debug element states during question transitions', async ({ page }) => {
    // Helper function to log element states
    const debugElements = async (stage) => {
      console.log(`\n=== DEBUG: ${stage} ===`);

      const quizContent = page.locator('#quizContent');
      const questionText = page.locator('#questionText');
      const questionSection = page.locator('.question-section');
      const contentWrapper = page.locator('#contentWrapper');

      // Log visibility states
      console.log('quizContent visible:', await quizContent.isVisible());
      console.log('questionText visible:', await questionText.isVisible());
      console.log('questionSection visible:', await questionSection.isVisible());

      // Log content
      const questionContent = await questionText.textContent();
      console.log('questionText content:', questionContent);

      // Log CSS properties
      const questionTextStyles = await questionText.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          fontSize: styles.fontSize,
          color: styles.color
        };
      });
      console.log('questionText styles:', questionTextStyles);

      const questionSectionStyles = await questionSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          flex: styles.flex,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems
        };
      });
      console.log('questionSection styles:', questionSectionStyles);
    };

    // Debug initial state
    await debugElements('Initial Load');

    // Wait for first timeout
    await page.waitForTimeout(16000);
    await debugElements('After First Timeout');

    // Wait for advance to second question
    await page.waitForTimeout(11000);
    await debugElements('Second Question Loaded');

    // Take final screenshot
    await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
  });
});