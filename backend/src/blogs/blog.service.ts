import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { User } from '../entities/user.entity';
import { CreateBlogInput } from './dto/blog.dto';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class BlogService {
  private pubSub = new PubSub();

  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async createBlog(
    createBlogInput: CreateBlogInput,
    user: User,
  ): Promise<Blog> {
    const blog = this.blogRepository.create({
      ...createBlogInput,
      author: user,
      authorId: user.id,
    });

    const savedBlog = await this.blogRepository.save(blog);

    const blogWithAuthor = await this.blogRepository.findOne({
      where: { id: savedBlog.id },
      relations: ['author'],
    });

    this.pubSub.publish('blogCreated', { blogCreated: blogWithAuthor });

    return blogWithAuthor;
  }

  async getBlogs(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  getBlogCreatedSubscription() {
    return this.pubSub.asyncIterator('blogCreated');
  }
}
