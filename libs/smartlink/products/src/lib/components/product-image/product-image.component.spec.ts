import { createComponentFactory } from '@ngneat/spectator/jest';
import { ProductImageComponent } from './product-image.component';

describe('ProductImageComponent', () => {
  const createComponent = createComponentFactory({
    component: ProductImageComponent,
  });

  it('should display the image if image is available', () => {
    // Arrange
    const spectator = createComponent({
      props: {
        loading: false,
        isInViewport: true,
        imgUrl: '200.png',
      },
    });
    const img = spectator.query('.responsive-img');

    // Assert
    expect(img).toBeVisible();
    expect(img.getAttribute('src')).toEqual(spectator.component.imgUrl);
  });

  it('should render the `image not in catalog` if the error event is fired', () => {
    // Arrange
    const spectator = createComponent({
      props: {
        loading: false,
        isInViewport: true,
        imgUrl: '404.png',
      },
    });

    const img = spectator.query<HTMLImageElement>('img')!;

    // Act
    img.dispatchEvent(new ErrorEvent('error'));

    // Assert
    expect(img.src).toEqual(
      // `default` is coming from `identity-obj-proxy`.
      'http://localhost/default'
    );
  });
});
