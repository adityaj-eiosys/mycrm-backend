import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UsersRole } from '../roles/entities/usersRole.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(UsersRole);

  const adminRole =
    (await roleRepo.findOne({ where: { name: 'ADMIN' } })) ||
    (await roleRepo.save(roleRepo.create({ name: 'ADMIN' })));

  const adminExists = await userRepo.findOne({
    where: { email: 'admin@mycrm.com' },
  });

  if (!adminExists) {
    const password = await bcrypt.hash('Admin@123', 10);

    const admin = userRepo.create({
      fullName: 'Super Admin',
      email: 'admin@mycrm.com',
      mobileNumber: process.env.DEV_ADMIN_MOBILE || '0000000000',
      password,
      roleId: adminRole.id,
      enabled: true,
    });

    await userRepo.save(admin);
    console.log('✅ Default admin created successfully!');
    console.log('   📧 Email: admin@mycrm.com');
    console.log('   🔑 Password: Admin@123');
  } else {
    console.log('ℹ️  Admin already exists, skipping creation');
  }
}
