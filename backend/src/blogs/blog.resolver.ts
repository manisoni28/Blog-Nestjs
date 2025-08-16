import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from '../entities/blog.entity';
import { CreateBlogInput } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return this.blogService.getBlogs();
  }

  @Mutation(() => Blog)
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Args('input') createBlogInput: CreateBlogInput,
    @CurrentUser() user: User,
  ): Promise<Blog> {
    return this.blogService.createBlog(createBlogInput, user);
  }

  @Subscription(() => Blog)
  blogCreated() {
    return this.blogService.getBlogCreatedSubscription();
  }
}
