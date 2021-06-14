import React, {
  FunctionComponent,
  ReactElement,
  useState,
} from 'react';
import styled from 'styled-components';
import { faAngleDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonLayout, ListLayout } from 'client/components/general';
import { VerticalSpace } from 'client/components/layout';
import DAY, { dayEnumToString, days } from 'common/constants/day';
import { meetingTimeSlots } from 'common/constants/timeslots';
import { CourseInstanceResponseMeeting } from 'common/dto/courses/CourseInstanceResponse';
import { MeetingRoomResponse } from 'common/dto/meeting/MeetingResponse.dto';
import {
  convert12To24HourTime,
  convertTo12HourDisplayTime,
} from 'common/utils/timeHelperFunctions';
import {
  BorderlessButton,
  Button,
  ButtonDropdownMenu,
  ButtonDropdownMenuItem,
  Dropdown,
  TextInput,
  ValidationErrorMessage,
  VARIANT,
} from 'mark-one';

/**
 * Contains the meeting day and time selectors so they can be displayed side by side
 */
const TimeSelector = styled.div`
  display: flex;
  flex-direction: row;
`;

interface MeetingTimesListProps {
  /**
   * The current existing meetings for this course instance
   */
  meetings: CourseInstanceResponseMeeting[];
}

/**
 * The meeting times section of the modal that allows users to edit meetings
 * for a particular course instance.
 */
export const MeetingTimesList
: FunctionComponent<MeetingTimesListProps> = function ({
  meetings,
}): ReactElement {
  /**
   * Keeps track of the current meetings for this instance. This is updated as
   * users add and edit meetings in the modal.
   */
  const [
    currentMeetings,
    setCurrentMeetings,
  ] = useState(meetings);

  /**
   * The meeting within the list of meetings that is currently being edited
   */
  const [
    currentMeetingId,
    setCurrentMeetingId,
  ] = useState(null as string);

  /**
   * The selected day in the dropdown for the meeting currently being edited
   */
  const [
    currentDay,
    setCurrentDay,
  ] = useState(null as DAY);

  /**
   * The timeslot currently selected in the time picker dropdown
   */
  const [
    currentTimeslot,
    setCurrentTimeslot,
  ] = useState(null as string);

  /**
   * The start time value for the meeting currently being edited
   */
  const [
    currentStartTime,
    setCurrentStartTime,
  ] = useState(null as string);

  /**
   * The end time value for the meeting currently being edited
   */
  const [
    currentEndTime,
    setCurrentEndTime,
  ] = useState(null as string);

  /**
   * The room assigned to the meeting currently being edited
   */
  const [
    currentRoom,
    setCurrentRoom,
  ] = useState(null as MeetingRoomResponse);

  /**
   * The current value of the error message when creating or editing a meeting time
   */
  const [
    meetingTimeError,
    setMeetingTimeError,
  ] = useState('');

  /**
   * Used to create a temporary unique ID for new meetings on the client. A permanent UUID will be assigned as a result of the server request
   */
  const [
    newMeetingIndex,
    setNewMeetingIndex,
  ] = useState(0);

  /**
   * The fields of the existing meeting are checked to make sure they are non-empty.
   * The entered start and end times are compared to make sure the start time is
   * not later than the end time. In either case, an error is set.
   */
  const validateTimes = (): boolean => {
    if (currentMeetingId && (currentDay === '' as DAY || currentStartTime === '' || currentEndTime === '')) {
      setMeetingTimeError('Please provide a day and start/end times before proceeding.');
      return false;
    }
    if (currentMeetingId && (currentStartTime >= currentEndTime)) {
      setMeetingTimeError('End time must be later than start time.');
      return false;
    }
    setMeetingTimeError('');
    return true;
  };

  return (
    <div className="meeting-times-section">
      <ul>
        {currentMeetings.map(
          (meeting) => (
            <ListLayout key={meeting.id}>
              <BorderlessButton
                id={`deleteButton${meeting.id}`}
                variant={VARIANT.DANGER}
                onClick={
                  (): void => {}
                }
              >
                <FontAwesomeIcon icon={faTrash} />
              </BorderlessButton>
              {
                meeting.id === currentMeetingId
                  ? (
                    <div>
                      <TimeSelector>
                        <Dropdown
                          id="meetingDay"
                          name="meetingDay"
                          label="Meeting Day"
                          options={[{ value: '', label: '' }]
                            .concat(days.map((day) => ({
                              value: day,
                              label: dayEnumToString(day),
                            })))}
                          value={currentDay}
                          onChange={(event
                          : React.ChangeEvent<HTMLSelectElement>): void => {
                            setCurrentDay(event.currentTarget.value as DAY);
                            setCurrentMeetings(currentMeetings.map(
                              (currentMeeting) => (
                                currentMeeting.id === currentMeetingId
                                  ? {
                                    ...currentMeeting,
                                    day: event.currentTarget.value as DAY,
                                  }
                                  : currentMeeting
                              )
                            ));
                          }}
                          hideError
                          isRequired
                          isLabelVisible={false}
                        />
                        <ButtonDropdownMenu
                          alt="Timeslot Button"
                          label={<FontAwesomeIcon icon={faAngleDown} size="sm" />}
                          variant={VARIANT.BASE}
                        >
                          {meetingTimeSlots.map(({
                            label,
                            start,
                            end,
                          }) => (
                            <ButtonDropdownMenuItem
                              onClick={() => {
                                const startTime = convert12To24HourTime(start);
                                const endTime = convert12To24HourTime(end);
                                setCurrentStartTime(startTime);
                                setCurrentEndTime(endTime);
                                setCurrentMeetings(currentMeetings.map(
                                  (currentMeeting) => (
                                    currentMeeting.id === currentMeetingId
                                      ? {
                                        ...currentMeeting,
                                        startTime,
                                        endTime,
                                      }
                                      : currentMeeting
                                  )
                                ));
                              }}
                              key={label}
                            >
                              {label}
                            </ButtonDropdownMenuItem>
                          ))}
                        </ButtonDropdownMenu>
                        <TextInput
                          id="meetingStartTime"
                          name="meetingStartTime"
                          label="Meeting Start Time"
                          type="time"
                          value={currentStartTime !== '' ? convert12To24HourTime(currentStartTime) : ''}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>)
                          : void => {
                            setCurrentStartTime(event.currentTarget.value);
                            setCurrentMeetings(currentMeetings.map(
                              (currentMeeting) => (
                                currentMeeting.id === currentMeetingId
                                  ? {
                                    ...currentMeeting,
                                    startTime: event.currentTarget.value,
                                  }
                                  : currentMeeting
                              )
                            ));
                          }}
                          hideError
                          isRequired
                          isLabelVisible={false}
                        />
                        <TextInput
                          id="meetingEndTime"
                          name="meetingEndTime"
                          label="Meeting End Time"
                          type="time"
                          value={currentEndTime !== '' ? convert12To24HourTime(currentEndTime) : ''}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>)
                          : void => {
                            setCurrentEndTime(event.currentTarget.value);
                            setCurrentMeetings(currentMeetings.map(
                              (currentMeeting) => (
                                currentMeeting.id === currentMeetingId
                                  ? {
                                    ...currentMeeting,
                                    endTime: event.currentTarget.value,
                                  }
                                  : currentMeeting
                              )
                            ));
                          }}
                          hideError
                          isRequired
                          isLabelVisible={false}
                        />
                      </TimeSelector>
                      <div>
                        <ValidationErrorMessage
                          id="meetingTimeErrorMessage"
                        >
                          {meetingTimeError}
                        </ValidationErrorMessage>
                      </div>
                      <div>
                        <span>
                          Room:
                          {` ${currentRoom !== null ? currentRoom.name : ''}`}
                        </span>
                        <ButtonLayout>
                          <Button
                            id="closeButton"
                            onClick={
                              (): void => {
                                // Close the current meeting only if there are no validation errors
                                if (validateTimes()) {
                                  setCurrentMeetingId(null);
                                }
                              }
                            }
                            variant={VARIANT.SECONDARY}
                          >
                            Close
                          </Button>
                          <Button
                            id="showRoomsButton"
                            onClick={
                              (): void => {
                                validateTimes();
                              }
                            }
                            variant={VARIANT.PRIMARY}
                          >
                            Show Rooms
                          </Button>
                        </ButtonLayout>
                      </div>
                    </div>
                  )
                  : (
                    <>
                      <span>{`${dayEnumToString(meeting.day)}, ${convertTo12HourDisplayTime(meeting.startTime)} to ${convertTo12HourDisplayTime(meeting.endTime)} ${meeting.room !== null ? `in ${meeting.room.name}` : ''}`}</span>
                      <BorderlessButton
                        id={`editMeetingButton${meeting.id}`}
                        variant={VARIANT.INFO}
                        onClick={
                          (): void => {
                            if (validateTimes()) {
                              setCurrentMeetingId(meeting.id);
                              setCurrentDay(meeting.day);
                              setCurrentStartTime(meeting.startTime);
                              setCurrentEndTime(meeting.endTime);
                              setCurrentRoom(meeting.room);
                            }
                          }
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </BorderlessButton>
                    </>
                  )
              }
            </ListLayout>
          )
        )}
      </ul>
      <VerticalSpace />
      <ButtonLayout>
        <Button
          id="addNewTimeButton"
          onClick={
            (): void => {
              // Close the current meeting only if there are no validation errors
              if (validateTimes()) {
                setCurrentMeetingId(null);
                // Generate a new meeting row using a newly created meeting ID via the newMeetingIndex
                setCurrentMeetings([...currentMeetings, {
                  id: `newMeeting${newMeetingIndex}`,
                  day: '' as DAY,
                  startTime: '',
                  endTime: '',
                  room: null,
                }]);
                setCurrentMeetingId(`newMeeting${newMeetingIndex}`);
                setNewMeetingIndex(newMeetingIndex + 1);
                setCurrentDay('' as DAY);
                setCurrentStartTime('');
                setCurrentEndTime('');
                setCurrentRoom(null);
              }
            }
          }
          variant={VARIANT.SECONDARY}
        >
          Add New Time
        </Button>
      </ButtonLayout>
    </div>
  );
};
