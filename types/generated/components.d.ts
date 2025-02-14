import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedTextAndMedia extends Schema.Component {
  collectionName: 'components_shared_text_and_medias';
  info: {
    displayName: 'TextAndMedia';
    icon: 'landscape';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    media: Attribute.Media<'images' | 'videos'> & Attribute.Required;
    contentOrder: Attribute.Enumeration<
      [
        '\u0422\u0435\u043A\u0441\u0442 \u0441\u043B\u0435\u0432\u0430',
        '\u0422\u0435\u043A\u0441\u0442 \u0441\u043F\u0440\u0430\u0432\u0430'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'\u0422\u0435\u043A\u0441\u0442 \u0441\u043B\u0435\u0432\u0430'>;
    viewFootsteps: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedHero extends Schema.Component {
  collectionName: 'components_shared_heroes';
  info: {
    displayName: 'Hero';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    image: Attribute.Media<'images'> & Attribute.Required;
    infoCard: Attribute.Component<'hero.info-card'> & Attribute.Required;
    scheduleCard: Attribute.Component<'hero.schedule-card'> &
      Attribute.Required;
  };
}

export interface SharedCards extends Schema.Component {
  collectionName: 'components_shared_cards';
  info: {
    displayName: 'Cards';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    cards: Attribute.Component<'card.card', true> & Attribute.Required;
  };
}

export interface ScheduleCardTimetable extends Schema.Component {
  collectionName: 'components_shedule_card_timetables';
  info: {
    displayName: 'Timetable';
    description: '';
  };
  attributes: {
    days: Attribute.String & Attribute.Required;
    time: Attribute.String & Attribute.Required;
    ticketsOfficeTime: Attribute.String;
  };
}

export interface HomeServices extends Schema.Component {
  collectionName: 'components_home_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    cards: Attribute.Component<'shared.cards'> & Attribute.Required;
    phone: Attribute.Text & Attribute.Required;
    email: Attribute.Text & Attribute.Required;
  };
}

export interface HeroScheduleCard extends Schema.Component {
  collectionName: 'components_hero_schedule_cards';
  info: {
    displayName: 'ScheduleCard';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    timetable: Attribute.Component<'schedule-card.timetable', true> &
      Attribute.Required;
  };
}

export interface HeroInfoCard extends Schema.Component {
  collectionName: 'components_hero_info_cards';
  info: {
    displayName: 'InfoCard';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text & Attribute.Required;
  };
}

export interface CardLabel extends Schema.Component {
  collectionName: 'components_card_labels';
  info: {
    displayName: 'label';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
  };
}

export interface CardCard extends Schema.Component {
  collectionName: 'components_card_cards';
  info: {
    displayName: 'card';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    image: Attribute.Media<'images'> & Attribute.Required;
    labels: Attribute.Component<'card.label', true>;
    link: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.text-and-media': SharedTextAndMedia;
      'shared.seo': SharedSeo;
      'shared.meta-social': SharedMetaSocial;
      'shared.hero': SharedHero;
      'shared.cards': SharedCards;
      'schedule-card.timetable': ScheduleCardTimetable;
      'home.services': HomeServices;
      'hero.schedule-card': HeroScheduleCard;
      'hero.info-card': HeroInfoCard;
      'card.label': CardLabel;
      'card.card': CardCard;
    }
  }
}
