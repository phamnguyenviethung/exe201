import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Author {
  @PrimaryKey()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
