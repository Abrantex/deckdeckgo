import {firestore} from 'firebase-admin';

import {UserSocial} from './user';

export interface DeckMetaAuthor {
  name: string;
  photo_url?: string | firestore.FieldValue;
  social?: UserSocial | firestore.FieldValue;
}

export interface DeckMeta {
  title: string;

  description?: string | firestore.FieldValue;
  tags?: string[] | firestore.FieldValue;

  pathname: string;

  author?: DeckMetaAuthor | firestore.FieldValue;

  published: boolean;
  published_at: firestore.Timestamp;

  feed: boolean;
  github?: boolean;

  updated_at: firestore.Timestamp;
}

export interface DeckAttributes {
  style?: string;
  transition?: 'slide' | 'fade' | 'none';
}

export interface DeckClone {
  deck_id_from?: string;
  deck_id_to?: string;
}

export interface DeckData {
  name: string;

  attributes?: DeckAttributes;
  background?: string;
  header?: string;
  footer?: string;

  owner_id: string;

  slides?: string[];

  api_id?: string;

  meta?: DeckMeta;

  clone?: DeckClone;

  created_at?: firestore.Timestamp;
  updated_at?: firestore.Timestamp;
}

export interface Deck {
  id: string;
  data: DeckData;
  ref: firestore.DocumentReference;
}
