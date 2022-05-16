import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Author,
  AuthorDocument,
  CreateAuthorInput,
} from './schemas/author.schema';
import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async findAllAuthors(): Promise<Author[]> {
    try {
      return this.authorModel.find().lean();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async findAuthorById(authorId: string): Promise<Author> {
    try {
      return this.authorModel.findById(authorId).lean();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async createAuthor(author: CreateAuthorInput) {
    try {
      return this.authorModel.create(author);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
