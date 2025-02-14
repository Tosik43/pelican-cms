import test, { expect, Page } from "@playwright/test";
import { authenticate, deleteFiles, E2E_SMOKE_NAME_PREFIX, getStrapiUrl, gotoCMS } from "./helpers/global-helpers";
import { createAndPublishDocumentsCategory, deleteDocumentsCategories, getDocumentCategoriesWithTestPrefix } from "./helpers/documents-helpers/documents-categories-helpers";
import { createAndPublishDocument, deleteDocuments, getDocumentsWithTestPrefix } from "./helpers/documents-helpers/documents-helpers";
import { createAndPublishNews, deleteNews, getNewsWithTestPrefix } from "./helpers/news-helpers/news-helpers";
import axios from "axios";
import { createAndPublishHomepage, deleteHomepage } from "./helpers/homepage-helpers/homepage-helpers";
import { createAndPublishContactZooPage, deleteContactZooPage } from "./helpers/contact-zoo-page-helpers/contact-zoo-page-helpers";
import qs from "qs";
import { MOCK_HOME_SERVICES, MOCK_SEO, MOCK_HERO, MOCK_TEXT_AND_MEDIA } from "./helpers/mocks";


test.describe(`API response tests`, () => {
  let page: Page;

  test.beforeAll(async ({
    browser,
  }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await gotoCMS({ page });

    await authenticate({
      page,
    });
  });


  test.describe(`News response tests`, () => {
    test.beforeEach(async () => {
      await deleteNews();

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteNews();

      await deleteFiles();
    });

    test(`
      GIVEN collection of news without record
      WHEN create one news
      SHOULD get a response with this news
      `,
      async () => await checkNewsResponseTest({ page })
    );
  });

  test.describe(`Documents categories response tests`, () => {
    test.beforeEach(async () => {
      await deleteDocumentsCategories();

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteDocumentsCategories();

      await deleteFiles();
    });

    test(`
      GIVEN collection of documents categories without record
      WHEN create one category
      SHOULD get a response with this category
      `,
      async () => await checkDocumentsCategoriesResponseTest({ page })
    );
  });

  test.describe(`Documents response tests`, () => {
    test.beforeEach(async () => {
      await deleteDocumentsCategories();

      await deleteDocuments();

      await deleteFiles();;
    });

    test.afterEach(async () => {
      await deleteDocumentsCategories();

      await deleteDocuments();

      await deleteFiles();
    });

    test(`
      GIVEN collection of documents without record
      WHEN create one document
      SHOULD get a response with this document
      `,
      async () => await checkDocumentsResponseTest({ page })
    );
  });

  test.describe(`Homepage response tests`, () => {
    test.beforeEach(async () => {
      await deleteHomepage()

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteHomepage()

      await deleteFiles();
    });

    test(`
      GIVEN empty home page
      WHEN fill out the home page
      SHOULD get a response home page
      `,
      async () => await checkHomepageResponseTest({ page })
    );
  });

  test.describe(`ContactZoo response tests`, () => {
    test.beforeEach(async () => {
      await deleteContactZooPage();

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteContactZooPage();

      await deleteFiles();
    });

    test(`
      GIVEN empty contact zoo page
      WHEN fill out the contact zoo page
      SHOULD get a response contact zoo page
      `,
      async () => await checkContactZooPageResponseTest({ page })
    );
  });
})


async function checkNewsResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
  const description = `На фотографии изображен амурский тигр!`;
  const innerContent = `В зоопарке появился амурский тигр, приходите посмотреть!`;
  const expectedNewsResponse = {
    data: [
      {
        attributes: {
          title,
          description,
          innerContent: `<p>${innerContent}</p>`,
        }
      }
    ]
  };

  await createAndPublishNews({
    page,
    title,
    description,
    innerContent,
    filePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-tiger.png`,
  });


  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;
  const newsWithPrefix = getNewsWithTestPrefix({ news: newsResponse });

  await expect({
    data: [
      {
        attributes:
        {
          title: newsWithPrefix[0].attributes.title,
          description: newsWithPrefix[0].attributes.description,
          innerContent: newsWithPrefix[0].attributes.innerContent,
        }
      }
    ]
  })
    .toEqual(expectedNewsResponse);

  await expect(newsWithPrefix[0].attributes.image.data.attributes.url)
    .not
    .toBeNull();
}

async function checkDocumentsResponseTest({
  page,
}: {
  page: Page
}) {
  const categoryTitle = `${E2E_SMOKE_NAME_PREFIX} Отчёты`;
  const showDate = false;
  const title = `${E2E_SMOKE_NAME_PREFIX} Договор №350474`;
  const subtitle = `Договор на поставку продукции животноводства (мясо говядина) для нужд муниципального бюджетного учреждения культуры «зоопарк»`;
  const description = `Контракт заключен по результатам электронного аукциона в рамках 223-ФЗ. Извещение №31907985126 в электронной форме размещены на сайте по адресу в сети Интернет: www.zakupki.gov.ru и на электронной площадке tender.otc.ru процедура №4442641 лот №7816638. Протокол №U4442641-7816638-3 от 07.07.2019 г.`;
  const date = new Date();
  const expectedDocumentsResponse = {
    data: [
      {
        attributes: {
          date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`,
          showDate,
          title,
          subtitle: `<p>${subtitle}</p>`,
          description: `<p>${description}</p>`,
        }
      }
    ]
  };

  await createAndPublishDocumentsCategory({
    page,
    title: categoryTitle,
  });

  await createAndPublishDocument({
    page,
    categoryTitle,
    title,
    subtitle,
    description,
    filePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-new-document.pdf`,
  });

  await page.waitForTimeout(500);

  const documentsResponse = (await axios.get(getStrapiUrl({ path: '/api/documents?populate=*' }))).data;
  const documentsWithPrefix = getDocumentsWithTestPrefix({ documents: documentsResponse });

  await expect({
    data: [
      {
        attributes: {
          date: documentsWithPrefix[0].attributes.date,
          showDate: documentsWithPrefix[0].attributes.showDate,
          title: documentsWithPrefix[0].attributes.title,
          subtitle: documentsWithPrefix[0].attributes.subtitle,
          description: documentsWithPrefix[0].attributes.description,
        }
      }
    ]
  })
    .toEqual(expectedDocumentsResponse);

  await expect(documentsWithPrefix[0].attributes.files.data[0].attributes.url)
    .not
    .toBeNull();
}

async function checkDocumentsCategoriesResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} Отчёты`;
  const expectedDocumentsCategoriesResponse = {
    data: [
      {
        attributes: {
          title,
        }
      }
    ]
  };

  await createAndPublishDocumentsCategory({
    page,
    title,
  });

  const documentsCategoriesResponse = (await axios.get(getStrapiUrl({ path: '/api/documents-categories?populate=*' }))).data;
  const documentCategoriesWithPrefix = getDocumentCategoriesWithTestPrefix({ documentCategories: documentsCategoriesResponse });

  await expect({
    data: [
      {
        attributes:
        {
          title: documentCategoriesWithPrefix[0].attributes.title,
        }
      }
    ]
  })
    .toEqual(expectedDocumentsCategoriesResponse);
}

async function checkHomepageResponseTest({
  page
}: {
  page: Page
}) {
  const { filePath, ...expectedHero } = MOCK_HERO;
  const { filePath: servicesFilePath, ...expectedServices } = MOCK_HOME_SERVICES;
  const { filePath: textAndMediaFilePath, ...expectedTextAndMedia } = MOCK_TEXT_AND_MEDIA;

  const expectedHomepageResponse = {
    data: {
      attributes: {
        blocks: [
          expectedHero,
          expectedServices,
          expectedTextAndMedia
        ],
        seo: MOCK_SEO
      }
    }
  };

  await createAndPublishHomepage({
    page,
    hero: MOCK_HERO,
    services: MOCK_HOME_SERVICES,
    textAndMedia: MOCK_TEXT_AND_MEDIA,
    seo: MOCK_SEO,
  });

  const queryParams = {
    populate: [
      `blocks.infoCard`,
      `blocks.scheduleCard`,
      `blocks.scheduleCard.timetable`,
      `blocks.image`,
      `blocks.cards`,
      `blocks.cards.cards`,
      `blocks.cards.cards.image`,
      `blocks.cards.cards.labels`,
      `blocks.media`,
      `seo`,
    ],
  };

  const homepageResponse = (await axios.get(getStrapiUrl({
    path: `/api/home?${qs.stringify(queryParams)}`
  }))).data;

  const heroBlock = homepageResponse.data.attributes.blocks.find((block) => block.__component === 'shared.hero');
  const servicesBlock = homepageResponse.data.attributes.blocks.find((block) => block.__component === 'home.services');
  const textAndMediaBlock = homepageResponse.data.attributes.blocks.find((block) => block.__component === 'shared.text-and-media');

  await expect({
    data: {
      attributes: {
        blocks: [
          {
            title: heroBlock.title,
            __component: heroBlock.__component,
            infoCard: {
              title: heroBlock.infoCard.title,
              description: heroBlock.infoCard.description
            },
            scheduleCard: {
              title: heroBlock.scheduleCard.title,
              timetable: [
                {
                  days: heroBlock.scheduleCard.timetable[0].days,
                  time: heroBlock.scheduleCard.timetable[0].time,
                  ticketsOfficeTime: heroBlock.scheduleCard.timetable[0].ticketsOfficeTime
                }
              ]
            },
          },
          {
            __component: servicesBlock.__component,
            phone: servicesBlock.phone,
            email: servicesBlock.email,
            cards: {
              title: servicesBlock.cards.title,
              cards: [
                {
                  title: servicesBlock.cards.cards[0].title,
                  description: servicesBlock.cards.cards[0].description,
                  link: servicesBlock.cards.cards[0].link,
                  labels: [{
                    text: servicesBlock.cards.cards[0].labels[0].text
                  }]
                }
              ],
            }
          },
          {
            __component: textAndMediaBlock.__component,
            title: textAndMediaBlock.title,
            description: textAndMediaBlock.description,
            contentOrder: textAndMediaBlock.contentOrder,
            viewFootsteps: textAndMediaBlock.viewFootsteps,
          },
        ],
        seo: {
          metaTitle: homepageResponse.data.attributes.seo.metaTitle,
          metaDescription: homepageResponse.data.attributes.seo.metaDescription,
        }
      }
    }
  })
    .toEqual(expectedHomepageResponse);

  await expect(heroBlock.image.data.attributes.url)
    .not
    .toBeNull();

  await expect(servicesBlock.cards.cards[0].image.data.attributes.url)
    .not
    .toBeNull();

  await expect(textAndMediaBlock.media.data.attributes.url)
    .not
    .toBeNull();
}

async function checkContactZooPageResponseTest({
  page
}: {
  page: Page
}) {
  const { filePath, ...expectedHero } = MOCK_HERO;

  const expectedConcatZooPageResponse = {
    data: {
      attributes: {
        blocks: [
          expectedHero
        ],
        seo: MOCK_SEO
      }
    }
  };

  await createAndPublishContactZooPage({
    page,
    hero: MOCK_HERO,
    seo: MOCK_SEO,
  });

  const queryParams = {
    populate: [
      `blocks.infoCard`,
      `blocks.scheduleCard`,
      `blocks.scheduleCard.timetable`,
      `blocks.image`,
      `seo`,
    ],
  };

  const contactZooPageResponse = (await axios.get(getStrapiUrl({
    path: `/api/contact-zoo?${qs.stringify(queryParams)}`
  }))).data;

  const heroBlock = contactZooPageResponse.data.attributes.blocks.find((block) => block.__component === 'shared.hero');

  await expect({
    data: {
      attributes: {
        blocks: [
          {
            title: heroBlock.title,
            __component: heroBlock.__component,
            infoCard: {
              title: heroBlock.infoCard.title,
              description: heroBlock.infoCard.description
            },
            scheduleCard: {
              title: heroBlock.scheduleCard.title,
              timetable: [
                {
                  days: heroBlock.scheduleCard.timetable[0].days,
                  time: heroBlock.scheduleCard.timetable[0].time,
                  ticketsOfficeTime: heroBlock.scheduleCard.timetable[0].ticketsOfficeTime
                }
              ]
            },
          },
        ],
        seo: {
          metaTitle: contactZooPageResponse.data.attributes.seo.metaTitle,
          metaDescription: contactZooPageResponse.data.attributes.seo.metaDescription,
        }
      }
    }
  })
    .toEqual(expectedConcatZooPageResponse);

  await expect(heroBlock.image.data.attributes.url)
    .not
    .toBeNull();
}