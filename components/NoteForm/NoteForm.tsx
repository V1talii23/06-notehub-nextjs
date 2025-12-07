import css from './NoteForm.module.css';
import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { KEY } from '@/app/notes/page';
import type { CreateNoteData } from '../../types/note';

interface NoteFormProps {
  closeModal: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: FormValues = { title: '', content: '', tag: 'Todo' };

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Choose tag of the note'),
});

function NoteForm({ closeModal }: NoteFormProps) {
  const queryClient = useQueryClient();

  const id = useId();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
  });

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    mutate(
      {
        title: values.title,
        content: values.content,
        tag: values.tag,
      },
      {
        onSuccess: (data) => {
          console.log('Created note:', data);
          queryClient.invalidateQueries({ queryKey: [KEY] });
          closeModal();
        },
        onError: (error) => {
          console.log(error.message);
        },
      }
    );

    actions.resetForm();
  };

  return (
    <Formik
      validationSchema={NoteSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${id}-title`}>Title</label>
          <Field
            id={`${id}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${id}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-tag`}>Tag</label>
          <Field as="select" id={`${id}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending && true}
          >
            {isPending ? 'Creating' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
