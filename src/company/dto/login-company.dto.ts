import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginCompanyDto {
  @IsNotEmpty({ message: 'Vui lòng nhập email!' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu!' })
  @MinLength(8, { message: 'Mật khẩu phải chứa ít nhất 8 ký tự!' })
  @Matches(/[A-Z]/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
  })
  @Matches(/[a-z]/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
  })
  @Matches(/\d/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ số!',
  })
  @Matches(/[@$!%*?&]/, {
    message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
  })
  password: string;
}
