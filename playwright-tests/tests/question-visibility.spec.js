const { test, expect } = require('@playwright/test');

test.describe('Question Visibility Debug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/src/quiz.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should show question text during timer countdown for all questions', async ({ page }) => {
    // Helper function to debug question state
    const debugQuestionState = async (questionNumber) => {
      console.log(`\n=== DEBUGGING QUESTION ${questionNumber} DURING TIMER ===`);

      // Check question counter
      const questionCounter = await page.locator('#questionCounter').textContent();
      console.log('Question counter:', questionCounter);

      // Check if we're in question mode (not explanation mode)
      const contentWrapper = page.locator('#contentWrapper');
      const hasExplanationClass = await contentWrapper.evaluate(el => el.classList.contains('show-explanation'));
      console.log('In explanation mode:', hasExplanationClass);

      // Check question text visibility and content
      const questionText = page.locator('#questionText');
      const isVisible = await questionText.isVisible();
      const textContent = await questionText.textContent().catch(() => 'ERROR: Could not get text');

      console.log('Question text visible:', isVisible);
      console.log('Question text content:', textContent);

      // Check question text computed styles
      const styles = await questionText.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          fontSize: computedStyle.fontSize,
          color: computedStyle.color,
          position: computedStyle.position
        };
      });
      console.log('Question text styles:', styles);

      // Check parent containers
      const questionSection = page.locator('.question-section');
      const questionSectionVisible = await questionSection.isVisible();
      console.log('Question section visible:', questionSectionVisible);

      const quizContent = page.locator('#quizContent');
      const quizContentVisible = await quizContent.isVisible();
      console.log('Quiz content visible:', quizContentVisible);

      // Take screenshot for visual debugging
      await page.screenshot({
        path: `debug-question-${questionNumber}-timer-phase.png`,
        fullPage: true
      });

      return { isVisible, textContent, hasExplanationClass };
    };

    // Test Question 1 during timer phase
    console.log('\n🔍 Testing Question 1 visibility...');
    const q1State = await debugQuestionState(1);
    expect(q1State.isVisible).toBe(true);
    expect(q1State.textContent).not.toBe('');
    expect(q1State.hasExplanationClass).toBe(false);

    // Wait for Q1 to timeout and advance to Q2
    console.log('\n⏳ Waiting for Q1 timeout and Q2 to load...');
    await page.waitForTimeout(16000); // Wait for 15sec timer + explanation
    await page.waitForTimeout(11000); // Wait for 10sec auto-advance

    // Test Question 2 during timer phase (THIS IS THE PROBLEM AREA)
    console.log('\n🔍 Testing Question 2 visibility during timer phase...');

    // Wait a bit for Q2 to fully load
    await page.waitForTimeout(2000);

    const q2State = await debugQuestionState(2);

    // These should pass but might fail due to the bug
    console.log('\n❌ CRITICAL TEST: Question 2 visibility during timer');
    console.log('Expected: Question visible = true, Has explanation = false');
    console.log(`Actual: Question visible = ${q2State.isVisible}, Has explanation = ${q2State.hasExplanationClass}`);

    if (!q2State.isVisible) {
      console.log('🚨 BUG CONFIRMED: Question 2 text is not visible during timer phase!');

      // Additional debugging
      await page.evaluate(() => {
        console.log('Current question index:', window.currentQuestion);
        const questionTextEl = document.getElementById('questionText');
        console.log('Question text element:', questionTextEl);
        console.log('Question text content:', questionTextEl?.textContent);
        console.log('Question text innerHTML:', questionTextEl?.innerHTML);
      });
    }

    // This assertion will fail and help us see the issue
    expect(q2State.isVisible).toBe(true);
    expect(q2State.textContent).not.toBe('');
    expect(q2State.textContent).not.toBe('Loading question...');
    expect(q2State.hasExplanationClass).toBe(false);
  });

  test('should verify question text gets properly set in loadQuestion function', async ({ page }) => {
    // Add console logging to track loadQuestion calls
    await page.addInitScript(() => {
      window.originalLoadQuestion = window.loadQuestion;
      window.loadQuestion = function() {
        console.log('=== loadQuestion called ===');
        console.log('Current question index:', window.currentQuestion);

        const result = window.originalLoadQuestion?.();

        // Check if question text was set
        const questionTextEl = document.getElementById('questionText');
        console.log('Question text after loadQuestion:', questionTextEl?.textContent);

        return result;
      };
    });

    // Wait for first question
    await page.waitForTimeout(2000);

    // Wait for transition to second question
    console.log('Waiting for transition to Q2...');
    await page.waitForTimeout(27000); // Full cycle to Q2

    // Check console logs
    const logs = await page.evaluate(() => {
      return {
        currentQuestion: window.currentQuestion,
        questionText: document.getElementById('questionText')?.textContent,
        quizData: window.quizData?.[window.currentQuestion]?.question
      };
    });

    console.log('Final state check:', logs);
  });
});