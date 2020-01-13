const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('web-worker externals [%s]', mode => {
  it('supports externals for web-worker', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);
      await page.waitForFunction(
        `document.querySelector('h1').innerText === 'Some external text'`,
      );
    });
  });
});
