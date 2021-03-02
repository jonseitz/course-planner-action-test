import React from 'react';
import {
  BoundFunction,
  FindByText,
  fireEvent,
  QueryByText,
  wait,
  waitForElement,
} from '@testing-library/react';
import { strictEqual } from 'assert';
import { CourseAPI } from 'client/api';
import { SinonStub, stub } from 'sinon';
import { render } from 'test-utils';
import {
  am105CourseInstance,
  cs50CourseInstance,
  es095CourseInstance,
} from 'testData';
import CoursesPage from 'client/components/pages/Courses/CoursesPage';

describe('Meeting Modal Focus Behavior', function () {
  let getStub: SinonStub;
  let findByText: BoundFunction<FindByText>;
  let queryByText: BoundFunction<QueryByText>;
  const dispatchStub: SinonStub = stub();
  const testData = [
    es095CourseInstance,
    cs50CourseInstance,
    am105CourseInstance,
  ];
  beforeEach(function () {
    getStub = stub(CourseAPI, 'getCourseInstancesForYear');
    getStub.resolves(testData);
  });
  describe('On Open Behavior', function () {
    context('when a fall semester meeting modal is opened', function () {
      beforeEach(async function () {
        ({ findByText } = render(
          <CoursesPage />,
          dispatchStub
        ));
        const editCS50MeetingButton = await waitForElement(
          () => document.getElementById(`${cs50CourseInstance.id}-${cs50CourseInstance.termPattern}-edit-meetings-button`)
        );
        fireEvent.click(editCS50MeetingButton);
        await findByText(/Meetings for/);
      });
      it('sets the focus to the meeting modal header', function () {
        strictEqual(
          (document.activeElement as HTMLElement)
            .textContent.includes(cs50CourseInstance.catalogNumber),
          true
        );
      });
    });
    context('when a spring semester meeting modal is opened', function () {
      beforeEach(async function () {
        ({ findByText } = render(
          <CoursesPage />,
          dispatchStub
        ));
        const editAM105MeetingButton = await waitForElement(
          () => document.getElementById(`${am105CourseInstance.id}-${am105CourseInstance.termPattern}-edit-meetings-button`)
        );
        fireEvent.click(editAM105MeetingButton);
        await findByText(/Meetings for/);
      });
      it('sets the focus to the meeting modal header', function () {
        strictEqual(
          (document.activeElement as HTMLElement)
            .textContent.includes(am105CourseInstance.catalogNumber),
          true
        );
      });
    });
  });
  describe('On Close Behavior', function () {
    context('when a fall semester meeting modal is closed', function () {
      let editCS50MeetingButton: HTMLElement;
      beforeEach(async function () {
        ({ findByText, queryByText } = render(
          <CoursesPage />,
          dispatchStub
        ));
        editCS50MeetingButton = await waitForElement(
          () => document.getElementById(`${cs50CourseInstance.id}-${cs50CourseInstance.termPattern}-edit-meetings-button`)
        );
        fireEvent.click(editCS50MeetingButton);
        await findByText(/Meetings for/);
        const cancelButton = await findByText(/Cancel/);
        fireEvent.click(cancelButton);
        await wait(() => !queryByText(/Meetings for/));
      });
      it('returns focus to the originally clicked edit meeting button', function () {
        strictEqual(
          document.activeElement as HTMLElement,
          editCS50MeetingButton
        );
      });
    });
    context('when a spring semester meeting modal is closed', function () {
      let editAM105MeetingButton: HTMLElement;
      beforeEach(async function () {
        ({ findByText, queryByText } = render(
          <CoursesPage />,
          dispatchStub
        ));
        editAM105MeetingButton = await waitForElement(
          () => document.getElementById(`${am105CourseInstance.id}-${am105CourseInstance.termPattern}-edit-meetings-button`)
        );
        fireEvent.click(editAM105MeetingButton);
        await findByText(/Meetings for/);
        const cancelButton = await findByText(/Cancel/);
        fireEvent.click(cancelButton);
        await wait(() => !queryByText(/Meetings for/));
      });
      it('returns focus to the originally clicked edit meeting button', function () {
        strictEqual(
          document.activeElement as HTMLElement,
          editAM105MeetingButton
        );
      });
    });
  });
});
