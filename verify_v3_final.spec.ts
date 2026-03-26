import { test, expect } from '@playwright/test';

test('verify level matrix ceremony fields', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-v3/levels');
  // Wait for table
  await page.waitForSelector('text=Level Configuration Matrix');
  
  // Click on level 3
  await page.click('text=Identity');
  
  // Verify drawer is open and has ceremony fields
  await page.waitForSelector('text=Ceremony & Celebration');
  await expect(page.locator('input[placeholder*="Broadcast Message"]')).toHaveValue('An identity emerges.');
  
  await page.screenshot({ path: 'screenshot_v3_final_ceremony.png', fullPage: true });
});
