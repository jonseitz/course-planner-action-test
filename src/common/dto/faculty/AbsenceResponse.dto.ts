import { ApiModelProperty } from '@nestjs/swagger';
import { ABSENCE_TYPE } from 'common/constants';

export abstract class AbsenceResponseDTO {
  @ApiModelProperty({
    type: 'string',
    example: '34b90cb7-fb90-4476-a793-e722f21748bb',
  })
  public id: string;

  @ApiModelProperty({
    example: ABSENCE_TYPE.RESEARCH_LEAVE,
    enum: ABSENCE_TYPE,
  })
  public type: ABSENCE_TYPE;
}
