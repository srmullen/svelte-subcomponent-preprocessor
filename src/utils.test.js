const { stripComments } = require('./util');

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

