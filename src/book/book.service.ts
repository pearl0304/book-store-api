import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  Book,
  BookDocument,
  BookInputType,
  UpdateBookType,
} from './schemas/book.schema';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAllBooks(): Promise<Book[]> {
    try {
      return this.bookModel.find().sort({ created_date: -1 }).exec();
    } catch (e) {
      throw new ApolloError(e);
    }
  }
  async findBookById(bookId: string): Promise<Book> {
    try {
      return await this.bookModel.findById(bookId).exec();
    } catch (e) {
      throw new ApolloError(e);
    }
  }
  async createBook(book: BookInputType) {
    try {
      // CHECK DUPLICATED
      const checkBook = await this.bookModel.findOne({ isbn: book.isbn });
      if (checkBook) throw new ApolloError('This book is already registered');

      const result = await this.bookModel.create(book);
      return {
        id: result._id,
        ...book,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async updateBook(bookId: string, book: UpdateBookType) {
    try {
      if (!bookId) throw new ApolloError('Please input bookId ');
      return await this.bookModel.findOneAndUpdate(
        { _id: bookId },
        { $set: { ...book } },
        { new: true },
      );
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async deleteBook(bookId: string) {
    try {
      await this.bookModel.deleteOne({ _id: bookId });
      return bookId;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
