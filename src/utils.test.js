const { stripComments, hasScriptTag } = require('./util');

describe('stripComments', () => {
  test('it leaves code that is not commented out', () => {
    const src = `<script></script>`;
    expect(stripComments(src)).toEqual(src);
  });

  describe('commented code', () => {
    test('basic', () => {
      const src = `<!-- <script></script> -->`;
      expect(stripComments(src)).toEqual('');
    });

    test('multiline', () => {
      const src = `<script>
</script>
<!--
  {#component DontNeedComp}
    <script>console.log('hello')</script
  {/component}
-->`;

      expect(stripComments(src).trim()).toEqual(`<script>\n</script>`);
    });

    test('nested comment', () => {
      const src = `<script>
</script>
<!--
  {#component DontNeedComp}
    <!-- this is a subcomponent -->
    <script>console.log('hello')</script
  {/component}
-->
<div>hello</div>`;
      const result = `<script>
</script>

<div>hello</div>`;

      expect(stripComments(src)).toEqual(result);
    });
  });
});

describe('hasScriptTag', () => {
  test('it returns false if there is no script tag', () => {
    expect(hasScriptTag(``)).toBe(false);
    expect(hasScriptTag(`<h1>no script</h1>`)).toBe(false);
    expect(hasScriptTag(`
      <div class="hello"></div>
      <style>
        div { display: none; }
      </style>`)).toBe(false);
  });

  test('it returns true if there is a script tag', () => {
    expect(hasScriptTag(`<script></script>`)).toBe(true);
    expect(hasScriptTag(`<script lang="ts"></script>`)).toBe(true);
    expect(hasScriptTag(`<script>
    console.log('hello');
    </script>`)).toBe(true);
  });

  test('it returns false if the only script is a module context', () => {
    expect(hasScriptTag(`<script context="module"></script`)).toBe(false);
    expect(hasScriptTag(`<script lang='ts' context="module"></script`)).toBe(false);
  });

  test('script and script[context]=module', () => {
    expect(hasScriptTag(`<script context="module"></script>
    <script></script>`)).toBe(true);
  });

  test('commented out code is ignored', () => {
    expect(hasScriptTag(`<!-- <script></script> -->`)).toBe(false);
    expect(hasScriptTag(`<script context='module'></script>
    <!-- <script></script> -->`)).toBe(false);
  });
});