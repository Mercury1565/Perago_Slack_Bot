import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDto: Partial<User>) {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async updateLastResponseTime(user: User) {
    const currentDate = new Date();
    await this.userRepository.update({ id: user.id }, {
      ...user,
      lastResponseTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
}
