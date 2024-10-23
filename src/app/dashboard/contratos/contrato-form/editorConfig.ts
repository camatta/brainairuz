import { AngularEditorConfig } from '@kolkov/angular-editor';

export const editorConfig: AngularEditorConfig = {
  editable: true,
  sanitize: true,
  minHeight: '260px',
  placeholder: 'Exemplo',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Poppins',
  defaultFontSize: '1',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'poppins', name: 'Poppins' },
    { class: 'times-new-roman', name: 'Times New Roman' },
  ],
  customClasses: [
    {
      name: 'heading1',
      class: 'h1',
      tag: 'h1',
    },
    {
      name: 'heading2',
      class: 'h2',
      tag: 'h2',
    },
    {
      name: 'heading3',
      class: 'h3',
      tag: 'h3',
    },
    {
      name: 'heading4',
      class: 'h4',
      tag: 'h4',
    },
    {
      name: 'heading5',
      class: 'h5',
      tag: 'h5',
    },
    {
      name: 'heading6',
      class: 'h6',
      tag: 'h6',
    },
    {
      name: 'paragraph',
      class: 'paragraph',
      tag: 'p',
    },
  ],
  toolbarHiddenButtons: [
    [
      'undo',
      'redo',
      'textColor',
      'backgroundColor',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode',
      'customClasses',
      'removeFormat',
      'heading',
      'indent',
      'outdent',
      'fontName',
    ],
  ],
};
