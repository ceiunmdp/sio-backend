import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
// @UseInterceptors(SerializerInterceptor)
// @Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService, // private readonly userSerializerService: UserSerializerService,
  ) {}

  @Get(':id')
  // @UsePipes(ParseIntPipe)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // async findOne(@Param('id', FindOneParams) id: number) {
    return this.usersService.findOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // return 'This action adds a new user';
    return this.usersService.create(createUserDto);
  }

  // @Post()
  // createBulk(@Body(new ParseArrayPipe({ items: CreateUserDto })) createUserDtos: CreateUserDto[]) {
  //   return 'This action adds new users';
  // }

  // @Get()
  // // findByIds(@Query('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
  // findByIds(@Query('id', ParseArrayPipeIds) ids: number[]) {
  //   return 'This action returns users by ids';
  // }

  // // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   console.log('Llegó controller');

  //   // return req.user;
  //   // return new User();
  //   // const res = this.userSerializerService.markSerializableValue(new User());
  //   console.log('Paso por acá');

  //   return {};
  // }
}
