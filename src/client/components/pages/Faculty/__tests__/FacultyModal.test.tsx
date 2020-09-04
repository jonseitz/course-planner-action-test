import {
  strictEqual,
  deepStrictEqual,
} from 'assert';
import { validHUID } from 'common/utils/facultyHelperFunctions';
import {
  waitForElement,
  fireEvent,
  BoundFunction,
  GetByText,
  AllByRole,
  wait,
} from '@testing-library/react';
import React from 'react';
import {
  SinonStub,
  stub,
} from 'sinon';
import { render } from 'common/utils';
import { testMetadata } from 'common/data/metadata';
import { FacultyAPI } from 'client/api';
import {
  bioengineeringFacultyMemberResponse,
  appliedMathFacultyMemberResponse,
  physicsFacultyMemberResponse,
  anotherPhysicsFacultyMemberResponse,
} from 'common/data';
import { ManageFacultyResponseDTO } from 'common/dto/faculty/ManageFacultyResponse.dto';
import { FACULTY_TYPE } from 'common/constants';
import { CreateFacultyDTO } from 'common/dto/faculty/CreateFaculty.dto';
import FacultyAdmin from '../../FacultyAdmin';

describe('Faculty Modal', function () {
  context('When creating a new faculty member', function () {
    let dispatchMessage: SinonStub;
    let getStub: SinonStub;
    let postStub: SinonStub;
    let getByText: BoundFunction<GetByText>;
    let getAllByRole: BoundFunction<AllByRole>;
    let queryAllByRole: BoundFunction<AllByRole>;
    let newFacultyInfo: CreateFacultyDTO;
    let courseAreaSelect: HTMLSelectElement;
    let huidInput: HTMLInputElement;
    let firstNameInput: HTMLInputElement;
    let lastNameInput: HTMLInputElement;
    let facultyCategorySelect: HTMLSelectElement;
    let jointWithInput: HTMLInputElement;
    let notesInput: HTMLInputElement;
    const newFacultyInfoId = '5c8e015f-eae6-4586-9eb0-fc7d243403bf';
    beforeEach(async function () {
      getStub = stub(FacultyAPI, 'getAllFacultyMembers');
      getStub.resolves([
        bioengineeringFacultyMemberResponse,
        appliedMathFacultyMemberResponse,
      ] as ManageFacultyResponseDTO[]);
      postStub = stub(FacultyAPI, 'createFaculty');
      postStub.callsFake((facultyInfo: CreateFacultyDTO) => ({
        ...facultyInfo,
        id: newFacultyInfoId,
        area: {
          id: '464e1579-70e4-43e9-afa0-4d94392b6d9d',
          name: facultyInfo.area,
        },
      }));
      dispatchMessage = stub();
      ({ getByText, getAllByRole, queryAllByRole } = render(
        <FacultyAdmin />,
        dispatchMessage,
        testMetadata
      ));
      const createFacultyButtonText = 'Create New Faculty';
      await waitForElement(() => getByText(createFacultyButtonText));
      fireEvent.click(getByText(createFacultyButtonText));
      newFacultyInfo = {
        area: 'AM',
        HUID: '12345678',
        lastName: 'Townson',
        firstName: 'Olive',
        category: FACULTY_TYPE.LADDER,
        jointWith: 'CS 350',
        notes: 'Prefers Allston campus',
      };
      courseAreaSelect = document.getElementById('courseArea') as HTMLSelectElement;
      huidInput = document.getElementById('HUID') as HTMLInputElement;
      firstNameInput = document.getElementById('firstName') as HTMLInputElement;
      lastNameInput = document.getElementById('lastName') as HTMLInputElement;
      facultyCategorySelect = document.getElementById('category') as HTMLSelectElement;
      jointWithInput = document.getElementById('jointWith') as HTMLInputElement;
      notesInput = document.getElementById('notes') as HTMLInputElement;
      fireEvent.change(courseAreaSelect,
        { target: { value: newFacultyInfo.area } });
      fireEvent.change(huidInput,
        { target: { value: newFacultyInfo.HUID } });
      fireEvent.change(firstNameInput,
        { target: { value: newFacultyInfo.firstName } });
      fireEvent.change(lastNameInput,
        { target: { value: newFacultyInfo.lastName } });
      fireEvent.change(facultyCategorySelect,
        { target: { value: newFacultyInfo.category } });
      fireEvent.change(jointWithInput,
        { target: { value: newFacultyInfo.jointWith } });
      fireEvent.change(notesInput,
        { target: { value: newFacultyInfo.notes } });
    });
    describe('On Open Behavior', function () {
      it('clears all form fields', async function () {
        const cancelButton = getByText('Cancel');
        fireEvent.click(cancelButton);
        const createFacultyButtonText = 'Create New Faculty';
        await waitForElement(() => getByText(createFacultyButtonText));
        fireEvent.click(getByText(createFacultyButtonText));
        courseAreaSelect = document.getElementById('courseArea') as HTMLSelectElement;
        huidInput = document.getElementById('HUID') as HTMLInputElement;
        firstNameInput = document.getElementById('firstName') as HTMLInputElement;
        lastNameInput = document.getElementById('lastName') as HTMLInputElement;
        facultyCategorySelect = document.getElementById('category') as HTMLSelectElement;
        jointWithInput = document.getElementById('jointWith') as HTMLInputElement;
        notesInput = document.getElementById('notes') as HTMLInputElement;
        strictEqual(courseAreaSelect.value, '');
        strictEqual(huidInput.value, '');
        strictEqual(firstNameInput.value, '');
        strictEqual(lastNameInput.value, '');
        strictEqual(facultyCategorySelect.value, '');
        strictEqual(jointWithInput.value, '');
        strictEqual(notesInput.value, '');
      });
      it('renders no error messages prior to initial form submission', async function () {
        strictEqual(queryAllByRole('alert').length, 0);
      });
    });
    describe('Field Validation', function () {
      describe('Area', function () {
        it('is a required field', async function () {
          courseAreaSelect = document.getElementById('courseArea') as HTMLSelectElement;
          fireEvent.change(courseAreaSelect, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'Area is required to submit';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('HUID', function () {
        it('is a required field', async function () {
          huidInput = document.getElementById('HUID') as HTMLInputElement;
          fireEvent.change(huidInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'HUID is required';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
        it('raises an appropriate error message when not valid', async function () {
          huidInput = document.getElementById('HUID') as HTMLInputElement;
          fireEvent.change(huidInput, { target: { value: '123' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'HUID is required and must contain 8 digits';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
        describe('validHUID', function () {
          it('should return false when the provided string contains at least one letter', function () {
            strictEqual(validHUID('a1234567'), false);
          });
          it('should return false when the provided string contains at least one symbol', function () {
            strictEqual(validHUID('12$45678'), false);
          });
          it('should return false when the HUID has a length shorter than 8 characters', function () {
            strictEqual(validHUID('1234567'), false);
          });
          it('should return false when the HUID has a length longer than 8 characters', function () {
            strictEqual(validHUID('123456789'), false);
          });
          it('should return true when the provided string contains 8 digits', function () {
            strictEqual(validHUID('12345678'), true);
          });
        });
      });
      describe('First name', function () {
        it('is not a required field', async function () {
          firstNameInput = document.getElementById('firstName') as HTMLInputElement;
          fireEvent.change(firstNameInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
      describe('Last name', function () {
        it('is a required field', async function () {
          lastNameInput = document.getElementById('lastName') as HTMLInputElement;
          fireEvent.change(lastNameInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'last name is required to submit';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('Category', function () {
        it('is a required field', async function () {
          facultyCategorySelect = document.getElementById('category') as HTMLSelectElement;
          fireEvent.change(facultyCategorySelect, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'category is required to submit';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('Joint With', function () {
        it('is not a required field', async function () {
          jointWithInput = document.getElementById('jointWith') as HTMLInputElement;
          fireEvent.change(jointWithInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
      describe('Notes', function () {
        it('is not a required field', async function () {
          notesInput = document.getElementById('notes') as HTMLInputElement;
          fireEvent.change(notesInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
    });
    describe('Resulting display', function () {
      it('sorts the updated list of faculty by area, last name, and first name ascending on modal submission', async function () {
        const submitButton = getByText('Submit');
        fireEvent.click(submitButton);
        await waitForElement(() => getByText(
          newFacultyInfo.lastName, { exact: false }
        ));
        const ids = getAllByRole('button')
          .filter((button) => button.id && button.id.startsWith('editFaculty'))
          .map((button) => button.id);
        const idsInExpectedOrder = [
          // area: AM, last name: Lee
          appliedMathFacultyMemberResponse.id,
          // area: AM, last name: Townson
          newFacultyInfoId,
          // area: BE, last name: Su
          bioengineeringFacultyMemberResponse.id,
        ].map((id) => `editFaculty${id}`);
        deepStrictEqual(ids, idsInExpectedOrder);
      });
    });
  });
  context('When editing an existing faculty member', function () {
    let dispatchMessage: SinonStub;
    let getStub: SinonStub;
    let editStub: SinonStub;
    let getByText: BoundFunction<GetByText>;
    let getAllByRole: BoundFunction<AllByRole>;
    let queryAllByRole: BoundFunction<AllByRole>;
    let newLastName: string;
    beforeEach(async function () {
      getStub = stub(FacultyAPI, 'getAllFacultyMembers');
      getStub.resolves([
        physicsFacultyMemberResponse,
        bioengineeringFacultyMemberResponse,
        appliedMathFacultyMemberResponse,
        anotherPhysicsFacultyMemberResponse,
      ] as ManageFacultyResponseDTO[]);
      newLastName = 'Hudson';
      editStub = stub(FacultyAPI, 'editFaculty');
      editStub.resolves({
        ...physicsFacultyMemberResponse,
        lastName: newLastName,
      });
      dispatchMessage = stub();
      ({ getByText, getAllByRole, queryAllByRole } = render(
        <FacultyAdmin />,
        dispatchMessage,
        testMetadata
      ));
      await waitForElement(
        () => getByText(physicsFacultyMemberResponse.lastName)
      );
      const physicsFacultyEditButton = document
        .getElementById('editFaculty' + physicsFacultyMemberResponse.id);
      fireEvent.click(physicsFacultyEditButton);
      const areaDropdown = await waitForElement(() => document.getElementById('courseArea') as HTMLSelectElement);
      await wait(() => (
        areaDropdown.value === physicsFacultyMemberResponse.area.name
      ));
    });
    describe('On Open Behavior', function () {
      it('populates the modal with the existing faculty information', async function () {
        const courseAreaSelect = document.getElementById('courseArea') as HTMLSelectElement;
        const huidInput = document.getElementById('HUID') as HTMLInputElement;
        const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
        const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
        const jointWithInput = document.getElementById('jointWith') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const notesInput = document.getElementById('notes') as HTMLInputElement;
        strictEqual(
          courseAreaSelect.value,
          physicsFacultyMemberResponse.area.name,
          'Area'
        );
        strictEqual(
          huidInput.value,
          physicsFacultyMemberResponse.HUID,
          'HUID'
        );
        strictEqual(
          firstNameInput.value,
          physicsFacultyMemberResponse.firstName || '',
          'first name'
        );
        strictEqual(
          lastNameInput.value,
          physicsFacultyMemberResponse.lastName,
          'last name'
        );
        strictEqual(
          jointWithInput.value,
          physicsFacultyMemberResponse.jointWith || '',
          'joint with'
        );
        strictEqual(
          categorySelect.value,
          physicsFacultyMemberResponse.category,
          'category'
        );
        strictEqual(
          notesInput.value,
          physicsFacultyMemberResponse.notes || '',
          'notes'
        );
      });
      it('renders no error messages prior to initial form submission', async function () {
        strictEqual(queryAllByRole('alert').length, 0);
      });
    });
    describe('Field Validation', function () {
      describe('Area', function () {
        it('is a required field', async function () {
          const courseAreaSelect = document.getElementById('courseArea') as HTMLSelectElement;
          fireEvent.change(courseAreaSelect, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'area is required to submit';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('HUID', function () {
        it('is a required field', async function () {
          const huidInput = document.getElementById('HUID') as HTMLInputElement;
          fireEvent.change(huidInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'HUID is required';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
        it('raises an appropriate error message when not valid', async function () {
          const huidInput = document.getElementById('HUID') as HTMLInputElement;
          fireEvent.change(huidInput, { target: { value: '123' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'HUID is required and must contain 8 digits';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('First Name', function () {
        it('is not a required field', function () {
          const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
          fireEvent.change(firstNameInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
      describe('Last Name', function () {
        it('is a required field', function () {
          const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
          fireEvent.change(lastNameInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          const errorMessage = 'Last name is required';
          return waitForElement(
            () => getByText(errorMessage, { exact: false })
          );
        });
      });
      describe('Category', function () {
        it('is a required field', function () {
          it('displays the appropriate validation error when the faculty category is not supplied', async function () {
            const facultyCategorySelect = document.getElementById('category') as HTMLSelectElement;
            fireEvent.change(facultyCategorySelect, { target: { value: '' } });
            const submitButton = getByText('Submit');
            fireEvent.click(submitButton);
            const errorMessage = 'category is required';
            return waitForElement(
              () => getByText(errorMessage, { exact: false })
            );
          });
        });
      });
      describe('Joint With', function () {
        it('is not a required field', async function () {
          const jointWithInput = document.getElementById('jointWith') as HTMLInputElement;
          fireEvent.change(jointWithInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
      describe('Notes', function () {
        it('is not a required field', async function () {
          const notesInput = document.getElementById('notes') as HTMLInputElement;
          fireEvent.change(notesInput, { target: { value: '' } });
          const submitButton = getByText('Submit');
          fireEvent.click(submitButton);
          strictEqual(queryAllByRole('alert').length, 0);
        });
      });
    });
    describe('Resulting display', function () {
      it('sorts the updated list of faculty by area, last name, and first name ascending on modal submission', async function () {
        const submitButton = getByText('Submit');
        fireEvent.click(submitButton);
        await waitForElement(() => getByText(
          newLastName, { exact: false }
        ));
        const ids = getAllByRole('button')
          .filter((button) => button.id && button.id.startsWith('editFaculty'))
          .map((button) => button.id);
        const idsInExpectedOrder = [
          // area: AM, last name: Lee
          appliedMathFacultyMemberResponse.id,
          // area: AP, last name: Hudson
          physicsFacultyMemberResponse.id,
          // area: AP, last name: Kenney
          anotherPhysicsFacultyMemberResponse.id,
          // area: BE, last name: Su
          bioengineeringFacultyMemberResponse.id,
        ].map((id) => `editFaculty${id}`);
        deepStrictEqual(ids, idsInExpectedOrder);
      });
    });
  });
});
