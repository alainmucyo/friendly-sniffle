import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RecordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  names: string;

  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Phone number must be Airtel or MTN number formatted like 07********",
  })
  @ApiProperty()
  phoneNumber: string;

  @Length(16, 16, { message: "NID size must be 16" })
  @IsNumberString()
  @ApiProperty()
  nid: string;

  @IsNotEmpty()
  @IsIn(["male", "female", "others"])
  @ApiProperty()
  gender: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  errors: string[];
}
