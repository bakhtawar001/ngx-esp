import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentToHtmlPipeModule } from '@contentful/common/pipes/documentToHtml.pipe';
import { ContentfulService } from '@contentful/common/services/contentful.service';
import { dataCySelector } from '@cosmos/testing';
import { SuppliersService } from '@esp/suppliers';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { SponsoredProductComponentModule } from '@smartlink/products';
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { of } from 'rxjs';
import { SPONSORED_CONTENT_CONFIG } from '../../configs';
import { SponsoredArticleComponent } from './sponsored-article.component';

const mockedSponsoredContentConfig = {
  space: '',
  accessToken: '',
  environment: '',
  host: '',
};

describe('SponsoredArticleComponent', () => {
  const createComponent = createComponentFactory({
    component: SponsoredArticleComponent,
    imports: [
      DocumentToHtmlPipeModule,
      RouterTestingModule,
      SponsoredProductComponentModule,
      HttpClientTestingModule,
    ],
    providers: [
      mockProvider(ContentfulService),
      {
        provide: SPONSORED_CONTENT_CONFIG,
        useValue: mockedSponsoredContentConfig,
      },
      mockProvider(SuppliersService),
    ],
    shallow: true,
  });

  const mockData = {
    fields: {
      sponsoredBy: {
        fields: {
          companyName: 'ImprintID',
          asiNumber: '12345',
        },
      },
      // this structure is what contentful returns
      description: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'content text',
                nodeType: 'text',
              },
            ],
            nodeType: 'paragraph',
          },
        ],
        nodeType: 'document',
      },
      products: [...Array(3)].map((it, index) => ({
        fields: {
          title: `product ${index + 1}`,
          // this structure is what contentful returns
          description: {
            data: {},
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: 'product content',
                    nodeType: 'text',
                  },
                ],
                nodeType: 'paragraph',
              },
            ],
            nodeType: 'document',
          },
        },
      })),
    },
  };

  const testSetup = () => {
    const spectator = createComponent({
      props: {
        article$: of(mockData),
        supplier$: of(SuppliersMockDb.suppliers[0]),
      },
    });
    const component = spectator.component;

    const suppliersService = spectator.inject(SuppliersService, true);
    const contentfulService = spectator.inject(ContentfulService, true);
    jest.spyOn(contentfulService, 'setConfig');
    jest.spyOn(contentfulService, 'getEntity');

    return { spectator, component, contentfulService, suppliersService };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Following elements will be read from Backend API and displayed on this page', () => {
    it('Supplier name', () => {
      // Arrange
      const { spectator } = testSetup();

      const element = spectator.query(
        dataCySelector('sponsored-article__sponsored-by')
      );

      // Assert
      expect(element).toHaveText('ImprintID');
    });

    it('ASI number', () => {
      // Arrange
      const { component, spectator, suppliersService } = testSetup();
      jest.spyOn(suppliersService, 'getByAsiNumber');
      const supplierDetailClickSpy = jest.spyOn(
        component.supplierDetailClick,
        'emit'
      );

      const element = spectator.query(
        dataCySelector('sponsored-article__asi-number')
      );
      spectator.click(element);
      spectator.detectChanges();

      // Assert
      expect(supplierDetailClickSpy).toHaveBeenCalled();
      expect(element).toHaveText('12345');
    });

    it('Content Text', () => {
      // Arrange
      const { spectator } = testSetup();

      const element = spectator.query(
        dataCySelector('sponsored-article__content-text')
      );

      // Assert
      expect(element).toHaveText('content text');
    });
  });

  describe('The ad will display a max of 3 products. Below data points will be displayed under each of the products', () => {
    it('Product title', () => {
      // Arrange
      const { spectator } = testSetup();

      const element = spectator.queryAll(
        dataCySelector('sponsored-article__product-title')
      )[0];

      // Assert
      expect(element).toHaveText('product 1');
    });

    it('Product content', () => {
      // Arrange
      const { spectator } = testSetup();

      const element = spectator.queryAll(
        dataCySelector('sponsored-article__product-content')
      )[0];

      // Assert
      expect(element).toHaveText('product content');
    });
  });

  it('At the end of the article, the supplier card of the sponsoring supplier should be displayed.', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const supplierDetailClickSpy = jest.spyOn(
      component.supplierDetailClick,
      'emit'
    );

    const element = spectator.query(
      dataCySelector('sponsored-article__supplier-card')
    );
    spectator.click(element);
    spectator.detectChanges();

    // Assert
    expect(supplierDetailClickSpy).toHaveBeenCalled();
    expect(element).toExist();
  });
});
