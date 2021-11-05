import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { COURSE_TABLE_COLUMN } from 'common/constants';

/**
 * Create View DTO
 *
 * Defines the data shape for creating a new [[View]] entry in the database.
 */
export class CreateViewDTO {
  @ApiProperty({
    description: 'Array of column names for this view',
    example: COURSE_TABLE_COLUMN.AREA,
    enum: COURSE_TABLE_COLUMN,
  })
  @IsEnum(COURSE_TABLE_COLUMN, { each: true })
  public columns: COURSE_TABLE_COLUMN[] = [];

  @ApiProperty({
    example: 'No semester data',
    description: 'A descriptive name for this custom view',
  })
  @IsString()
  @MinLength(1)
  public name: string;
}
