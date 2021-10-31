const { componentsRE } = require('./regexp');

const myComponent = `{#component MyComponent}
<script>
  import { onMount } from 'svelte';
  onMount(() => console.log('hello'));
</script

<p>Yo!</p>
{/component}`;

const otherComponent = `{#component OtherComponent}
<div class="othercomponent">
  <slot />
</div>
{/component}`

const oneComponentSrc = `<script>
  console.log('hello');
</script>

<MyComponent />

${myComponent}
`;

const twoComponentSrc = `
<OtherComponent>
  <MyComponent />
</OtherComponent>

${otherComponent}

${myComponent}
`;

const svelteIgnoreComment = `<!-- svelte-ignore missing-declaration -->`;
const commentedOutComponent = `<!--
${myComponent}
-->`

const commentSrc = `<div class="flex"><slot /></div>
<style>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>

${svelteIgnoreComment}
${myComponent}`

describe('regex', () => {
  describe('componentsRE', () => {
    test('it matches the component name in the first group', () => {
      const [match1] = [...myComponent.matchAll(componentsRE)];
      expect(match1).not.toBeNull();
      expect(match1[1]).toEqual('MyComponent')
      const [match2] = [...otherComponent.matchAll(componentsRE)];
      expect(match2).not.toBeNull();
      expect(match2[1]).toEqual('OtherComponent');
    });

    test('it matches component blocks', () => {
      const matches = [...oneComponentSrc.matchAll(componentsRE)];
      expect(matches.length).toEqual(1);
      expect(matches[0][0]).toEqual(myComponent);
    });

    test('it matches more than one component', () => {
      const matches = [...twoComponentSrc.matchAll(componentsRE)];
      expect(matches.length).toEqual(2);
      expect(matches[0][0]).toEqual(otherComponent);
      expect(matches[1][0]).toEqual(myComponent);
    });

    describe('html comments', () => {
      const matches = [...commentSrc.matchAll(componentsRE)];
      
      test('it matches html comments', () => {
        expect(matches.length).toEqual(2);
        expect(matches[0][0]).toEqual(svelteIgnoreComment);
      });

      test('no groups are captured', () => {
        const match = matches[0];
        expect(match[0]).toEqual(svelteIgnoreComment);
        expect(match[1]).toBeUndefined();
        expect(match[2]).toBeUndefined();
      });

      test('it doesn\'t capture commented-out components', () => {
        const matches = [...commentedOutComponent.matchAll(componentsRE)];
        expect(matches.length).toEqual(1);
        expect(matches[0][1]).toBeUndefined();
        expect(matches[0][2]).toBeUndefined();
      });
    });
  });
});