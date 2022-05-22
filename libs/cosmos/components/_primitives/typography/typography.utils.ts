import markdown from './typography.md';

const typeList = [
  {
    name: 'Header Style 24',
    class: 'header-style-24',
    sass: 'type-style-header-24',
    textLength: 2,
  },
  {
    name: 'Header Style 22',
    class: 'header-style-22',
    sass: 'type-style-header-22',
    textLength: 2,
  },
  {
    name: 'Header Style 18',
    class: 'header-style-18',
    sass: 'type-style-header-18',
    textLength: 2,
  },
  {
    name: 'Header Style 16',
    class: 'header-style-16',
    sass: 'type-style-header-16',
    textLength: 2,
  },
  {
    name: 'Header Style 14 Bold',
    class: 'header-style-14-bold',
    sass: 'type-style-header-14-bold',
    textLength: 2,
  },
  {
    name: 'Header Style 14 Semibold',
    class: 'header-style-14-semibold',
    sass: 'type-style-header-14-semibold',
    textLength: 2,
  },
  {
    name: 'Header Style 12 Mineshaft',
    class: 'header-style-12-mineshaft',
    sass: 'type-style-header-12-mineshaft',
    textLength: 2,
  },
  {
    name: 'Header Style 12 Shark',
    class: 'header-style-12-shark',
    sass: 'type-style-header-12-shark',
    textLength: 2,
  },
  {
    name: 'Body Style 14 Mineshaft',
    class: 'body-style-14-mineshaft',
    sass: 'type-body-style-14-mineshaft',
    textLength: 2,
  },
  {
    name: 'Body Style 14 Shark',
    class: 'body-style-14-shark',
    sass: 'type-body-style-14-shark',
    textLength: 2,
  },
  {
    name: 'Body Style 12 Shark',
    class: 'body-style-12-shark',
    sass: 'type-body-style-12-shark',
    textLength: 2,
  },
  {
    name: 'Body Style 12 Medium',
    class: 'body-style-12-medium',
    sass: 'type-body-style-12-medium',
    textLength: 3,
  },
  {
    name: 'Body Style 12',
    class: 'body-style-12',
    sass: 'type-body-style-12',
    textLength: 3,
  },
  {
    name: 'Body Style 11',
    class: 'body-style-11',
    sass: 'type-body-style-11',
    textLength: 3,
  },
  {
    name: 'Large Input Placeholder',
    class: 'input-large-placeholder',
    sass: 'large-input-placeholder',
    textLength: 3,
  },
  {
    name: 'Large Input Filled',
    class: 'input-large-filled',
    sass: 'large-input-filled',
    textLength: 3,
  },
  {
    name: 'Medium Input Placeholder',
    class: 'input-medium-placeholder',
    sass: 'medium-input-placeholder',
    textLength: 3,
  },

  {
    name: 'Medium Input Filled',
    class: 'input-medium-filled',
    sass: 'medium-input-filled',
    textLength: 3,
  },

  {
    name: 'Small Input Placeholder',
    class: 'input-small-placeholder',
    sass: 'small-input-placeholder',
    textLength: 3,
  },
  {
    name: 'Small Input Filled',
    class: 'input-small-filled',
    sass: 'small-input-filled',
    textLength: 3,
  },
  {
    name: 'Medium Pill Text',
    class: 'pill-medium-text',
    sass: 'medium-pill-text',
    textLength: 3,
  },
];

const genText = (length) => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac pharetra velit. Suspendisse dictum consequat ornare. Nullam efficitur pharetra est quis ornare. Nunc a dignissim odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius leo vitae dui pellentesque, et rhoncus turpis feugiat. Curabitur interdum ipsum in nulla scelerisque, eget ullamcorper massa pharetra. Nam sed odio in magna placerat eleifend in vitae dui. Suspendisse potenti. Donec ac cursus velit, quis rhoncus nunc. Curabitur ante leo, faucibus in luctus ullamcorper, pretium ut neque. Sed dignissim magna ut pulvinar consectetur. Proin ullamcorper ante aliquam purus aliquam pulvinar. Sed laoreet aliquet massa ac imperdiet. Sed pellentesque leo vitae risus facilisis, id eleifend dui dapibus. Etiam rhoncus euismod ex sit amet laoreet. Sed mollis placerat eros, vel consequat dui elementum a. Nam accumsan vitae lectus a tempus. Nunc non finibus quam. Sed convallis urna sed hendrerit tempor. Aenean euismod, diam in ornare imperdiet, eros purus ornare lectus, quis porttitor nulla mauris in est. Nullam consectetur vel velit ut ornare. Donec cursus viverra diam, vel bibendum metus. Nunc ipsum enim, commodo ac consectetur eget, rhoncus ut lectus. Fusce aliquet cursus faucibus. Suspendisse semper laoreet est, at mollis felis vehicula sed. Quisque in justo at nibh facilisis finibus eget non risus. Pellentesque vitae leo at risus sodales iaculis in nec urna. Nam at magna nec orci placerat suscipit ut quis justo. Maecenas posuere suscipit dapibus. Donec ac felis viverra, finibus velit sit amet, pulvinar ligula. Sed dictum odio sed hendrerit feugiat. Praesent euismod urna eget rutrum semper. Curabitur est lacus, suscipit vitae vestibulum at, volutpat ut leo. Etiam fermentum mi in tellus aliquet, vitae porttitor nibh tristique. Nam vehicula ligula sit amet diam pellentesque, et efficitur dolor pulvinar. Nullam tempor libero a eros lacinia hendrerit. Duis eu blandit nisl. Etiam ipsum turpis, interdum at dolor quis, tempus fermentum magna. Pellentesque maximus in arcu eget aliquam. Vivamus a quam tortor. In varius augue non ipsum interdum egestas. Nunc mollis nisi nunc, sit amet porttitor urna iaculis quis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin sit amet scelerisque magna. Etiam eleifend libero scelerisque velit lobortis dignissim. Nunc nec ligula at lorem vehicula maximus. Fusce scelerisque consequat ligula, sit amet pellentesque sapien lacinia quis. Pellentesque euismod, orci nec consequat dignissim, arcu augue accumsan lectus, in vestibulum elit nisi ultrices purus. Fusce in est molestie, varius augue a, aliquam felis. Vestibulum sit amet sapien id turpis sagittis hendrerit. Maecenas eget velit sit amet velit dapibus facilisis. Mauris convallis enim sit amet leo cursus porttitor. Sed risus erat, tristique sit amet elit quis, suscipit auctor sem. Praesent cursus est id nisi egestas malesuada. Donec at neque porttitor, auctor neque id, ullamcorper enim. Aliquam fringilla justo a orci commodo pharetra. Morbi elit tellus, venenatis eu facilisis ac, commodo id magna. Nunc diam odio, consequat tempus elementum commodo, facilisis laoreet nisi. Donec erat mauris, sodales a condimentum a, mattis at enim. Nam libero lectus, pharetra ac elementum eget, rutrum nec sem.`.split(
    '. '
  );

  return `${text.slice(0, length).join('. ')}.`;
};

const wrapGrid = (input) =>
  `<div class="documentation-grid--list">${input}</div>`;

const nameBlock = (input) =>
  input.name
    ? `<p>
      <strong>${input.name}</strong>
    </p>`
    : null;
const classBlock = (input) =>
  input.class
    ? `<p>
      <code>.${input.class}</code>
    </p>`
    : null;
const sassBlock = (input) =>
  input.sass
    ? `<p>
      <code>${input.sass}</code>
    </p>`
    : null;

const typeItem = (input, demoLength) =>
  `<div
    class="documentation-block documentation-typography"
  >
    <div class="type-block">
      <p class=${input.class}>${genText(input.textLength)}</p>
    </div>
    <div class="type-block type-block--demo">
      <div>
        <p>${genText(demoLength)}</p>
        <p class=${input.class}>${genText(input.textLength)}</p>
        <p>${genText(demoLength)}</p>
      </div>
    </div>
    <footer>
      ${nameBlock(input)}
      ${classBlock(input)}
      ${sassBlock(input)}
    </footer>
  </div>`;

// export const all = () => ({
//   template: wrapGrid(typeList.map((item) => typeItem(item, 8)).join('')),
// });

export const ALL = wrapGrid(typeList.map((item) => typeItem(item, 8)).join(''));

export const HEADERS = wrapGrid(
  typeList
    .filter((x) => x.class.includes('header-style'))
    .map((item) => typeItem(item, 8))
    .join('')
);

export const BODY = wrapGrid(
  typeList
    .filter((x) => x.class.includes('body-style'))
    .map((item) => typeItem(item, 8))
    .join('')
);

export const INPUT = wrapGrid(
  typeList
    .filter((x) => x.class.includes('input'))
    .map((item) => typeItem(item, 8))
    .join('')
);

export const PILL = wrapGrid(
  typeList
    .filter((x) => x.class.includes('pill'))
    .map((item) => typeItem(item, 8))
    .join('')
);

// export default {
//   title: 'Primitives / Typography',
//   parameters: {
//     notes: markdown,
//   },
// };
