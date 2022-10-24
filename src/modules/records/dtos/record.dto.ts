import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class RecordDto {
  @IsNotEmpty()
  @IsString()
  names: string;

  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Phone number must be Airtel or MTN number formatted like 07********",
  })
  phoneNumber: string;

  @Length(16, 16, { message: "NID size must be 16" })
  @IsNumberString()
  nid: string;

  @IsNotEmpty()
  @IsIn(["male", "female", "others"])
  gender: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  errors: string[];
}
