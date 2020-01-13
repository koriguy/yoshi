const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('transpile whitelisted external [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);
      const result = await page.$eval(
        '#transpile-default-external',
        elm => elm.textContent,
      );

      expect(result).toBe('Wix style react.');
    });
  });
});
