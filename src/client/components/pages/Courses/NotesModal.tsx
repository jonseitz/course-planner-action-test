import { CourseAPI } from 'client/api';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiLineTextInput,
  POSITION,
  VARIANT,
  LoadSpinner,
} from 'mark-one';
import React, {
  ChangeEvent,
  FunctionComponent,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import CourseInstanceResponseDTO from '../../../../common/dto/courses/CourseInstanceResponse';

interface NotesModalProps {
  /**
   * Whether or not the modal should be visible on the page.
   */
  isVisible: boolean;

  /**
   * The course the modal is editing notes for
   */
  course: CourseInstanceResponseDTO;

  /**
   * Handler to be invoked when the modal closes
   */
  onClose: () => void;

  /**
   * Handler to be invoked when the modal has finished saving it's data. This is
   * particularly useful for persisting the saved data in local state so that a
   * page refresh isn't necessary.
   */
  onSave: (course: CourseInstanceResponseDTO) => void;

  /**
   * Enables or disables editing of the fields and data within the modal
   */
  isEditable: boolean;
}

const NotesModal: FunctionComponent<NotesModalProps> = function ({
  isVisible,
  course,
  onClose,
  onSave,
  isEditable,
}): ReactElement {
  /**
   * Current state value of course notes
   */
  const [
    courseNotes,
    setCourseNotes,
  ] = useState('');

  /**
   * The current value of the Meeting Modal ref
   */
  const modalHeaderRef: Ref<HTMLHeadingElement> = useRef(null);

  /**
   * Sets the ref focus.
   * Since modal may not have been rendered in DOM, wait for it to be
   * rendered by letting next task of event queue run first.
   */
  useEffect(() => {
    if (isVisible) {
      setTimeout((): void => modalHeaderRef.current?.focus());
    }
  }, [modalHeaderRef, isVisible]);

  /**
   * Set initial value of local courseNotes state field.
   */
  useEffect(() => {
    setCourseNotes(course?.notes || '');
  }, [course, setCourseNotes]);

  /**
   * Keeps track of whether the user has altered fields in the form to determine
   * whether to show a confirmation dialog on modal close
   */
  const [
    isChanged,
    setIsChanged,
  ] = useState(false);

  const confirmMessage = "You have unsaved changes. Click 'OK' to disregard changes, or 'Cancel' to continue editing.";

  /**
   * Used to add the before unload listener in the case that a form field is changed
   */
  useEffect(() => {
    /**
     * Checks to see if there are any unsaved changes in the modal when the user
     * refreshes the page. If there are unsaved changes, the browser displays a
     * warning message to confirm the page reload. If the user selects cancel, the
     * user can continue making changes in the modal.
     */
    const onBeforeUnload = (event: Event) => {
      if (!isChanged) return;
      event.preventDefault();
      // Need to disable this rule for browser compatibility reasons
      // eslint-disable-next-line no-param-reassign
      event.returnValue = false;
      return confirmMessage;
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [isChanged]);

  /**
   * Called when the modal is closed. If there are any unsaved changes,
   * a warning message appears, and the user must confirm discarding the unsaved
   * changes in order to close the modal. If the user selects cancel, the user
   * can continue making changes in the modal.
   */
  const confirmAndClose = () => {
    if (isChanged) {
      // eslint-disable-next-line no-alert
      if (window.confirm(confirmMessage)) {
        setIsChanged(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const [
    saving,
    setSaving,
  ] = useState(false);

  return (
    <Modal
      ariaLabelledBy="notes"
      closeHandler={confirmAndClose}
      isVisible={isVisible}
    >
      <ModalHeader
        forwardRef={modalHeaderRef}
        tabIndex={0}
      >
        {`Notes For ${course?.catalogNumber}`}
      </ModalHeader>
      <ModalBody>
        {
          saving
            ? (
              <LoadSpinner>Saving Notes</LoadSpinner>
            ) : (
              <MultiLineTextInput
                id={`notes-${course?.id}`}
                value={courseNotes}
                label="Course Notes"
                name="notes"
                placeholder="Some course notes"
                isLabelVisible={false}
                labelPosition={POSITION.TOP}
                isDisabled={!isEditable}
                onChange={
                  ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
                    if (isEditable) {
                      setIsChanged(true);
                      setCourseNotes(value);
                    }
                  }
                }
              />
            )
        }
      </ModalBody>
      <ModalFooter>
        {
          isEditable ? (
            <Button
              onClick={async () => {
                try {
                  setSaving(true);
                  await CourseAPI.editCourse({
                    id: course.id,
                    area: course.area,
                    isSEAS: course.isSEAS,
                    isUndergraduate: course.isUndergraduate,
                    termPattern: course.termPattern,
                    title: course.title,
                    notes: courseNotes,
                  });
                } finally {
                  setSaving(false);
                }
                onSave({
                  ...course,
                  notes: courseNotes,
                });
              }}
              variant={VARIANT.POSITIVE}
            >
              Save
            </Button>
          ) : null
        }
        <Button onClick={confirmAndClose} variant={VARIANT.DEFAULT}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NotesModal;
