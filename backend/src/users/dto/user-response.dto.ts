import { Expose, Exclude, Type } from 'class-transformer';

@Exclude()
export class RoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
export class UserRoleDto {
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  full_name: string;

  @Expose()
  avatar_url: string;

  @Expose()
  bio: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => UserRoleDto)
  user_roles: UserRoleDto[];
}
