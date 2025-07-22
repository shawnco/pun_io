const {chromium} = require('playwright');

class Cagematch {
  constructor() {
    this.eventUrl = null;
  }

  async setEvent(url) {
    this.eventUrl = url;
    console.log('Event URL set');
    return 'Event URL set';
  }

  async getEvent() {
    if (!this.eventUrl) {
      console.log('No event URL set');
      return 'No event URL set';
    }
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
      await page.goto(this.eventUrl);
      const name = await page.locator('div.InformationBowRow')
        .nth(0)
        .locator('div.InformationBowContents')
        .innerText();
      const date = await page.locator('div.InformationBowRow')
        .nth(1)
        .locator('div.InformationBowContents')
        .innerText();
      const promotion = await page.locator('div.InformationBowRow')
        .nth(2)
        .locator('div.InformationBowContents')
        .innerText();
      return `${name}, ${date} (${promotion})`;
    } catch (err) {
      console.error('Error fetching event details:', err);
      return 'Error fetching event details';
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  }

  async getMatch(id) {
    if (!this.eventUrl) {
      console.log('No event URL set');
      return 'No event URL set';
    }
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
      await page.goto(`${this.eventUrl}&page=2`);
      const matchType = await page.locator('div.Match')
        .nth(parseInt(id) - 1)
        .locator('div.MatchType')
        .innerText();
      const matchWrestlers = await page.locator('div.Match')
        .nth(parseInt(id) - 1)
        .locator('div.MatchResults')
        .innerText();
      return `${matchWrestlers} (${matchType})`;
    } catch (err) {
      console.error('Error fetching match details:', err);
      return 'Error fetching match details';
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

module.exports = Cagematch;