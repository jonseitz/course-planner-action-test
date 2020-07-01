import { strictEqual } from 'assert';
import {
  absenceEnumToTitleCase,
  facultyTypeEnumToTitleCase,
  facultyTypeTitleCaseToEnum,
} from 'common/__tests__/utils/facultyHelperFunctions';
import { FACULTY_TYPE } from 'common/constants';

describe('Faculty Helper Functions', function () {
  describe('absenceEnumToTitleCase', function () {
    it('should remove the underscore(s) and capitalize the first letter of each word', function () {
      const formattedAbsence = absenceEnumToTitleCase('SABBATICAL_ELIGIBLE');
      strictEqual(formattedAbsence, 'Sabbatical Eligible');
    });
  });
  describe('facultyTypeEnumToTitleCase', function () {
    it('convert NON_SEAS_LADDER enum value to Non-SEAS Ladder', function () {
      strictEqual(
        facultyTypeEnumToTitleCase(FACULTY_TYPE.NON_SEAS_LADDER),
        'Non-SEAS Ladder'
      );
    });
    it('convert NON_LADDER enum value to Non-Ladder', function () {
      strictEqual(
        facultyTypeEnumToTitleCase(FACULTY_TYPE.NON_LADDER),
        'Non-Ladder'
      );
    });
    it('convert LADDER enum value to Ladder', function () {
      strictEqual(
        facultyTypeEnumToTitleCase(FACULTY_TYPE.LADDER),
        'Ladder'
      );
    });
  });
  describe('facultyTypeTitleCaseToEnum', function () {
    it('converts Non-SEAS Ladder to NON_SEAS_LADDER enum value', function () {
      strictEqual(
        facultyTypeTitleCaseToEnum('Non-SEAS Ladder'),
        FACULTY_TYPE.NON_SEAS_LADDER
      );
    });
    it('converts Non-Ladder to NON_LADDER enum value', function () {
      strictEqual(
        facultyTypeTitleCaseToEnum('Non-Ladder'),
        FACULTY_TYPE.NON_LADDER
      );
    });
    it('converts Ladder to LADDER enum value', function () {
      strictEqual(
        facultyTypeTitleCaseToEnum('Ladder'),
        FACULTY_TYPE.LADDER
      );
    });
  });
});
