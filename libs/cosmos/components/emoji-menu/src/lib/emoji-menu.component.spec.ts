import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosEmojiMenuComponent } from './emoji-menu.component';
import { CosEmojiMenuModule } from './emoji-menu.module';

describe('CosEmojiMenuComponent', () => {
  let component: CosEmojiMenuComponent;
  let spectator: Spectator<CosEmojiMenuComponent>;

  const createComponent = createComponentFactory({
    component: CosEmojiMenuComponent,
    imports: [CosEmojiMenuModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        emoji: ':package:',
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Clicking on Emoji should open the Emoji menu', () => {
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    const emojiMenu = spectator.query('.mat-menu-trigger');
    const emojiMenupanel = spectator.query('.cos-emoji-menu-panel');
    expect(emojiMenu.getAttribute('aria-expanded')).toBeTruthy();
    expect(emojiMenu.getAttribute('aria-controls')).toEqual(
      emojiMenupanel.getAttribute('id')
    );
    expect(emojiMenupanel).toExist();
  });

  it('User should be able to search through the emoji menu', () => {
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.cos-emoji-menu-panel')).toExist();
    const emojiSearchSection = spectator.query('.emoji-mart-search');
    expect(emojiSearchSection).toExist();
    const emojiSearchInput = emojiSearchSection.children[0];
    expect(emojiSearchInput.tagName).toEqual('INPUT');
    expect(emojiSearchInput.getAttribute('type')).toEqual('search');
    expect(emojiSearchInput.getAttribute('placeholder')).toEqual('Search');
    spectator.typeInElement('hello', emojiSearchInput);
    spectator.detectChanges();
    const resultsSection = spectator.query('.emoji-mart-category');
    const results = [];
    resultsSection.childNodes.forEach((item) => {
      if (item.nodeName === 'NGX-EMOJI') {
        results.push(item);
      }
    });
    expect(results).toHaveLength(2);
  });

  it('User should be able to search a different emoji from emoji menu at Collections detail page', () => {
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.cos-emoji-menu-panel')).toExist();
    const emojiSearchSection = spectator.query('.emoji-mart-search');
    expect(emojiSearchSection).toExist();
    const emojiSearchInput = emojiSearchSection.children[0];
    expect(emojiSearchInput.tagName).toEqual('INPUT');
    expect(emojiSearchInput.getAttribute('type')).toEqual('search');
    expect(emojiSearchInput.getAttribute('placeholder')).toEqual('Search');
    spectator.typeInElement('hello', emojiSearchInput);
    spectator.detectChanges();
    const resultsSection = spectator.query('.emoji-mart-category');
    const results = [];
    resultsSection.childNodes.forEach((item) => {
      if (item.nodeName === 'NGX-EMOJI') {
        results.push(item);
      }
    });
    expect(results).toHaveLength(2);
  });

  it('User should be able to filter and select a different emoji', () => {
    const defaultEmoji = ':package:';
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.emoji-mart-anchors')).toExist();
    const filters = spectator.queryAll('.emoji-mart-anchor');
    expect(filters).toHaveLength(9);
    spectator.click(filters[1]);
    expect(filters[1]).toHaveClass('emoji-mart-anchor-selected');
    const filterTitle = filters[1].getAttribute('title');
    expect(filterTitle).toBe('Smileys & People');
    const emojiListSection = spectator.query('.emoji-mart-scroll');
    expect(
      emojiListSection.children[2].children[0].children[0].getAttribute(
        'data-name'
      )
    ).toEqual(filterTitle);
    expect(
      emojiListSection.children[2].children[0].children[0].children
    ).toHaveText(filterTitle);
    spectator.click(
      emojiListSection.children[2].children[0].children[1].children[0]
    );
    expect(component.emoji).not.toEqual(defaultEmoji);
    expect(component.emoji).toBe(':grinning:');
  });

  it('User should be able to select a different emoji from emoji menu at Collections detail page', () => {
    const defaultEmoji = ':package:';
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.emoji-mart-anchors')).toExist();
    const filters = spectator.queryAll('.emoji-mart-anchor');
    expect(filters).toHaveLength(9);
    spectator.click(filters[1]);
    expect(filters[1]).toHaveClass('emoji-mart-anchor-selected');
    const filterTitle = filters[1].getAttribute('title');
    expect(filterTitle).toBe('Smileys & People');
    const emojiListSection = spectator.query('.emoji-mart-scroll');
    expect(
      emojiListSection.children[2].children[0].children[0].getAttribute(
        'data-name'
      )
    ).toEqual(filterTitle);
    expect(
      emojiListSection.children[2].children[0].children[0].children
    ).toHaveText(filterTitle);
    spectator.click(
      emojiListSection.children[2].children[0].children[1].children[0]
    );
    expect(component.emoji).not.toEqual(defaultEmoji);
    expect(component.emoji).toBe(':grinning:');
  });

  it('Emoji icon should be updated at collection details page when user clicks on a different emoji', () => {
    const defaultEmoji = ':package:';
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.emoji-mart-anchors')).toExist();
    const filters = spectator.queryAll('.emoji-mart-anchor');
    expect(filters).toHaveLength(9);
    spectator.click(filters[1]);
    expect(filters[1]).toHaveClass('emoji-mart-anchor-selected');
    const filterTitle = filters[1].getAttribute('title');
    expect(filterTitle).toBe('Smileys & People');
    const emojiListSection = spectator.query('.emoji-mart-scroll');
    expect(
      emojiListSection.children[2].children[0].children[0].getAttribute(
        'data-name'
      )
    ).toEqual(filterTitle);
    expect(
      emojiListSection.children[2].children[0].children[0].children
    ).toHaveText(filterTitle);
    spectator.click(
      emojiListSection.children[2].children[0].children[1].children[0]
    );
    expect(component.emoji).not.toEqual(defaultEmoji);
    expect(component.emoji).toBe(':grinning:');
  });

  it('User should be able to create a collection with non default emoji', () => {
    const defaultEmoji = ':package:';
    const emojiButton = spectator.query('.emoji-mart-emoji');
    expect(emojiButton).toExist();
    spectator.click(emojiButton);
    expect(spectator.query('.emoji-mart-anchors')).toExist();
    const filters = spectator.queryAll('.emoji-mart-anchor');
    expect(filters).toHaveLength(9);
    spectator.click(filters[1]);
    expect(filters[1]).toHaveClass('emoji-mart-anchor-selected');
    const filterTitle = filters[1].getAttribute('title');
    expect(filterTitle).toBe('Smileys & People');
    const emojiListSection = spectator.query('.emoji-mart-scroll');
    expect(
      emojiListSection.children[2].children[0].children[0].getAttribute(
        'data-name'
      )
    ).toEqual(filterTitle);
    expect(
      emojiListSection.children[2].children[0].children[0].children
    ).toHaveText(filterTitle);
    spectator.click(
      emojiListSection.children[2].children[0].children[1].children[0]
    );
    expect(component.emoji).not.toEqual(defaultEmoji);
    expect(component.emoji).toBe(':grinning:');
  });
});
